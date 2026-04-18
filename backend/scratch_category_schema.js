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
    const r1 = await client.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_name IN ('categories', 'admin_products', 'seller_products') AND column_name ILIKE '%categor%'");
    console.log("Columns:", r1.rows);
    const r2 = await client.query("SELECT * FROM categories LIMIT 5");
    console.log("Categories:", r2.rows);
    const r3 = await client.query("SELECT DISTINCT category FROM admin_products LIMIT 10");
    console.log("Admin Products Categories:", r3.rows);
    const r4 = await client.query("SELECT DISTINCT category FROM seller_products LIMIT 10");
    console.log("Seller Products Categories:", r4.rows);
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}
run();
