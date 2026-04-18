const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Starting order coupons migration...");

    // 1. Seed Coupons Table
    console.log("Seeding base coupons...");
    await client.query(`
      INSERT INTO coupons (code, type, discount_percent, created_at)
      VALUES 
        ('SAVE10', 'percent', 10, NOW()),
        ('FREESHIP', 'fixed', 0, NOW())
      ON CONFLICT (code) DO NOTHING
    `);

    // 2. Alter order_coupons table
    console.log("Altering order_coupons schema...");
    await client.query(`
      ALTER TABLE order_coupons
      ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    // Fetch dynamic coupon IDs
    const couponsRes = await client.query("SELECT coupon_id, code FROM coupons WHERE code IN ('SAVE10', 'FREESHIP')");
    const couponsMap = {};
    couponsRes.rows.forEach(r => couponsMap[r.code] = r.coupon_id);

    // 3. Backfill historic data
    console.log("Checking historical orders for coupon mapping...");
    // Group orders per user and exact string of total_amount, representing an individual checkout
    const groupedOrders = await client.query(`
      SELECT 
        user_id, total_amount, created_at,
        MIN(id) as first_order_id,
        SUM(price * quantity) as actual_subtotal
      FROM orders
      GROUP BY user_id, total_amount, created_at
    `);

    let insertions = 0;
    for (const group of groupedOrders.rows) {
      const subtotal = parseFloat(group.actual_subtotal) || 0;
      const numericTotal = parseFloat(String(group.total_amount).replace(/[^0-9.-]+/g,"")) || 0;
      
      const shipping = subtotal > 100 ? 0 : 10;
      const tax = subtotal * 0.1;
      const expectedTotal = subtotal + shipping + tax;
      
      const diff = expectedTotal - numericTotal;

      if (diff > 0.01) {
        let appliedCode = null;
        let discountAmount = 0;

        // Check if 10% was applied
        if (Math.abs(diff - (subtotal * 0.1)) < 0.1) {
          appliedCode = 'SAVE10';
          discountAmount = subtotal * 0.1;
        } 
        // Check if FREESHIP was applied
        else if (Math.abs(diff - 10) < 0.1 && shipping === 10) {
          appliedCode = 'FREESHIP';
          discountAmount = 10;
        }

        if (appliedCode && couponsMap[appliedCode]) {
          await client.query(`
            INSERT INTO order_coupons (order_id, coupon_id, customer_id, discount_amount, created_at, updated_at)
            SELECT $1, $2, $3, $4, $5, $5
            WHERE NOT EXISTS (
              SELECT 1 FROM order_coupons WHERE order_id = $1
            )
          `, [group.first_order_id, couponsMap[appliedCode], group.user_id, discountAmount, group.created_at]);
          insertions++;
        }
      }
    }

    console.log(`Successfully backfilled ${insertions} historical coupons.`);

    await client.query("COMMIT");
    console.log("Migration complete!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
