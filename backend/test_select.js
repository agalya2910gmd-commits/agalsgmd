const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function run() {
  const r = await pool.query("SELECT * FROM orders WHERE product_id = 'PRDT_TEST'");
  console.log("orders:", r.rows);
  
  const rc = await pool.query("SELECT * FROM order_coupons WHERE order_id IN (SELECT id FROM orders WHERE product_id = 'PRDT_TEST')");
  console.log("order_coupons:", rc.rows);

  await pool.end();
}
run();
