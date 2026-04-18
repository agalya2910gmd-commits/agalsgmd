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
    const schemas = {};
    const tables = ['order_coupons', 'coupons', 'orders', 'orders_table'];
    for(const table of tables) {
      const res = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table]);
      schemas[table] = res.rows;
    }
    console.log(JSON.stringify(schemas, null, 2));

    // Also let's check a sample of orders with applied discounts to see if there is a discount_amount or coupon_code field
    const sample = await client.query("SELECT * FROM orders LIMIT 3");
    console.log("Sample Orders:");
    console.log(sample.rows);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
