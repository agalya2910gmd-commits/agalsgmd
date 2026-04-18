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
    console.log("Mocking a native order state change manually as if handled by UI...");
    
    // First, insert an order
    const orderRes = await client.query(`
      INSERT INTO orders_table (customer_id, address_id, status, total_amount, final_amount, ordered_at)
      VALUES ('CUS_NATIVE', 999, 'Pending', 100, 100, NOW())
      RETURNING order_id
    `);
    const mockOrderId = orderRes.rows[0].order_id;
    console.log("Created Mock Order_Table ID:", mockOrderId);
    
    // Update it to shipped natively! This fires trigger!
    await client.query(`UPDATE orders_table SET status = 'Shipped' WHERE order_id = $1`, [mockOrderId]);
    console.log("Updated natively to Shipped!");
    
    // Validate the automated tracker immediately
    const deliveryCheck = await client.query(`SELECT * FROM deliveries WHERE order_id = $1`, [mockOrderId]);
    
    console.log("\n----- AUTOMATED DELIVERY TRACKER HOOK RESULT -----");
    console.log(deliveryCheck.rows);

    // Rollback test
    await client.query("ROLLBACK");
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}

run();
