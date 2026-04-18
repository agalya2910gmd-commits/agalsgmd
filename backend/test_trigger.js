const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function runTest() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Pick an existing seller product
    const prodRes = await client.query("SELECT id, seller_id FROM seller_products LIMIT 1");
    if (prodRes.rows.length === 0) {
      console.log("No products available to test.");
      await client.query("ROLLBACK");
      return;
    }
    const product = prodRes.rows[0];

    // Insert dummy order
    console.log(`Inserting mock order for product_id: ${product.id}`);
    const orderRes = await client.query(`
      INSERT INTO orders (user_id, product_id, product_name, price, quantity, total_amount, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `, ['mock_user', product.id, 'Mock Product', 150, 2, 300, 'Card']);

    const orderId = orderRes.rows[0].id;
    console.log(`Mock order_id inserted: ${orderId}`);

    // Verify trigger inserted into seller_payouts
    const payoutRes = await client.query("SELECT * FROM seller_payouts WHERE order_id = $1", [orderId]);
    if (payoutRes.rows.length > 0) {
      const payout = payoutRes.rows[0];
      console.log("✅ TRIGGER SUCCESS! Payout found:", payout);
      if (payout.seller_id === product.seller_id && Number(payout.amount) === 300) {
         console.log("✅ Data validation success: seller_id and amount match perfectly.");
      } else {
         console.error("❌ Data validation failed:", payout);
      }
    } else {
      console.error("❌ TRIGGER FAILED! No payout inserted for order.");
    }
    
    // Rollback so we don't spam the DB with mock data
    await client.query("ROLLBACK");
    console.log("Test completed and rolled back.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

runTest();
