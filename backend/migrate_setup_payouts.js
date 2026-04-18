const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Starting Seller Payouts setup...");

    // 1. ALTER TABLE to add missing fields safely
    console.log("Altering seller_payouts table...");
    await client.query(`
      ALTER TABLE seller_payouts 
      ADD COLUMN IF NOT EXISTS order_id INTEGER,
      ADD COLUMN IF NOT EXISTS product_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS order_item_id INTEGER,
      ADD COLUMN IF NOT EXISTS payout_amount NUMERIC(12,2),
      ADD COLUMN IF NOT EXISTS payout_status VARCHAR(50) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // 2. CREATE DB TRIGGER for new orders
    // This function automatically picks up the seller_id from seller_products
    // Note: 'total_amount' might be per item in orders table, or we multiply price * quantity.
    // The server.js does `numericTotal || 0` which represents the order item total exactly.
    console.log("Setting up PostgreSQL Trigger for new orders...");
    await client.query(`
      CREATE OR REPLACE FUNCTION generate_seller_payout()
      RETURNS TRIGGER AS $$
      DECLARE
          v_seller_id INTEGER;
          v_payout_amount NUMERIC;
      BEGIN
          -- Fetch the valid seller_id from seller_products using product_id
          SELECT seller_id INTO v_seller_id 
          FROM seller_products 
          WHERE id = NEW.product_id;
      
          IF FOUND AND v_seller_id IS NOT NULL THEN
              -- Use total_amount or price * quantity as a fallback
              v_payout_amount := COALESCE(NEW.total_amount, NEW.price * NEW.quantity, 0);

              INSERT INTO seller_payouts (
                  seller_id, order_id, product_id, order_item_id,
                  payout_amount, payout_status, 
                  amount, status,
                  created_at, updated_at
              ) VALUES (
                  v_seller_id, NEW.id, NEW.product_id, NEW.id,
                  v_payout_amount, 'pending',
                  v_payout_amount, 'Pending',
                  COALESCE(NEW.created_at, NOW()), NOW()
              );
          END IF;
      
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS trigger_generate_seller_payout ON orders;
      CREATE TRIGGER trigger_generate_seller_payout
      AFTER INSERT ON orders
      FOR EACH ROW
      EXECUTE FUNCTION generate_seller_payout();
    `);

    // 3. BACKFILL existing orders
    console.log("Backfilling existing orders...");
    const ordersResult = await client.query(`
      SELECT o.id, o.product_id, o.price, o.quantity, o.total_amount, o.created_at, sp.seller_id
      FROM orders o
      JOIN seller_products sp ON o.product_id = sp.id
      WHERE NOT EXISTS (
        SELECT 1 FROM seller_payouts spay WHERE spay.order_id = o.id
      )
    `);

    let inserted = 0;
    for (const order of ordersResult.rows) {
      if (order.seller_id) {
        const payoutAmount = order.total_amount || (order.price * order.quantity) || 0;
        await client.query(`
          INSERT INTO seller_payouts (
              seller_id, order_id, product_id, order_item_id,
              payout_amount, payout_status, 
              amount, status,
              created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          order.seller_id,
          order.id,
          order.product_id,
          order.id, // order_item_id is equivalent to order_id in this design
          payoutAmount,
          'paid', // Retroactively mark as paid (or pending, user prompt mentioned "Fetch all existing completed/paid orders")
          payoutAmount,
          'Paid',
          order.created_at || new Date(),
          new Date()
        ]);
        inserted++;
      }
    }
    console.log(`Successfully backfilled ${inserted} payouts.`);

    await client.query("COMMIT");
    console.log("✅ Seller Payouts Setup complete!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
