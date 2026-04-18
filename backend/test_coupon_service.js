const { processOrderCoupons } = require('./coupon_service');
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
    
    // Pass same params as test_hook.js
    const items = [
      {
        id: "PRDT_TEST2",
        name: "Test Hook Product 2",
        price: 150,
        quantity: 2,
      }
    ];
    const total_amount = 300;
    const first_order_id = 999;
    const user_id = "CUS003";

    await processOrderCoupons(client, items, total_amount, first_order_id, user_id);
    await client.query("ROLLBACK");
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}
run();
