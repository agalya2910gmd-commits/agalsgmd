const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkRecentIds() {
  try {
    const resC = await pool.query("SELECT id, name, created_at FROM customers ORDER BY created_at DESC LIMIT 5");
    console.log("Recent Customers:");
    console.table(resC.rows);

    const resP = await pool.query("SELECT id, name, created_at FROM seller_products ORDER BY created_at DESC LIMIT 5");
    console.log("Recent Products:");
    console.table(resP.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}

checkRecentIds();
