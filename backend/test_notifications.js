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
    console.log("--- Testing Notification Automation ---");

    // 1. Insert a mock order
    console.log("Inserting test order...");
    const orderRes = await client.query(`
      INSERT INTO orders_table (customer_id, address_id, status, total_amount, final_amount, ordered_at)
      VALUES ('CUS_TEST_NOTIF', 1, 'Pending', 99.99, 99.99, NOW())
      RETURNING order_id
    `);
    const newOrderId = orderRes.rows[0].order_id;
    console.log(`Order created with ID: ${newOrderId}`);

    // 2. Wait a moment and check notifications table
    console.log("Checking notifications table for automatic entry...");
    const notifRes = await client.query("SELECT * FROM notifications WHERE order_id = $1", [newOrderId]);

    if (notifRes.rows.length > 0) {
      console.log("✅ Success! Notification entry detected:");
      console.log(notifRes.rows[0]);
    } else {
      console.error("❌ Failure: No notification entry found for new order.");
    }

    // 3. Cleanup
    await client.query("DELETE FROM notifications WHERE order_id = $1", [newOrderId]);
    await client.query("DELETE FROM orders_table WHERE order_id = $1", [newOrderId]);
    console.log("Cleanup complete.");

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
