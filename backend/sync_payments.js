const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function sync() {
  try {
    console.log("Fetching existing orders...");
    const ordersResult = await pool.query("SELECT * FROM orders");
    console.log(`Found ${ordersResult.rows.length} order items. Syncing to payments table...`);

    for (const order of ordersResult.rows) {
      await pool.query(
        `INSERT INTO payments 
         (order_id, customer_id, payment_method, amount, payment_status, created_at, updated_at, paid_at)
         VALUES ($1, $2, $3, $4, $5, $6, $6, $6)
         ON CONFLICT (payment_id) DO NOTHING`,
        [
          order.id,
          order.user_id,
          order.payment_method,
          parseFloat(order.price) * (order.quantity || 1), // Using item total for payment amount
          "Success",
          order.created_at,
        ]
      );
      console.log(`- Synced payment for order item ID: ${order.id}`);
    }

    console.log("✅ All existing orders have been synced to the payments table.");
  } catch (err) {
    console.error("Error during sync:", err);
  } finally {
    await pool.end();
  }
}

sync();
