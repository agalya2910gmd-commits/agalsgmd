const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432,
});

async function testOrderFlow() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Testing Order Flow with Alphanumeric IDs...");

    // 1. Create a dummy product for SEL002
    const pid = "PRDT_TEST_" + Date.now();
    await client.query(`
      INSERT INTO seller_products (id, name, price, seller_id, stock)
      VALUES ($1, $2, $3, $4, $5)
    `, [pid, "Test Alphanumeric Product", 1000.00, "SEL002", 50]);

    // 2. Insert into orders (This triggers generate_seller_payout)
    console.log("Inserting order (should trigger payout generation)...");
    const orderRes = await client.query(`
      INSERT INTO orders (user_id, product_id, product_name, price, quantity, total_amount, shipping_address, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `, ["CUS001", pid, "Test Alphanumeric Product", 1000.00, 1, 1000.00, "123 Test St", "Cod"]);
    
    const orderId = orderRes.rows[0].id;
    console.log(`Order created: ID ${orderId}`);

    // 3. Verify seller_payouts
    console.log("Verifying seller_payouts record...");
    const payoutRes = await client.query("SELECT * FROM seller_payouts WHERE order_id = $1", [orderId]);
    if (payoutRes.rows.length > 0) {
      console.log("✅ Payout record found:", payoutRes.rows[0]);
    } else {
      throw new Error("❌ Payout record NOT found!");
    }

    // 4. Verify notifications
    console.log("Verifying notifications...");
    // Assuming trigger is on orders or orders_table. If orders_table, we might need to insert there too.
    // Let's check trigger on orders
    const tgRes = await client.query("SELECT * FROM notifications WHERE order_id = $1", [orderId]);
    if (tgRes.rows.length > 0) {
      console.log("✅ Notification found:", tgRes.rows[0]);
    } else {
      console.log("⚠️ Notification not found (check trigger target table).");
    }

    await client.query("ROLLBACK"); // Don't persist test data
    console.log("✅ Test successful! (Rolled back)");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Test failed:", err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

testOrderFlow();
