const { Pool } = require("pg");
const pool = new Pool({ user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432 });
async function run() {
  try {
    const res = await pool.query("SELECT customer_id, product_id, created_at FROM wishlist_items ORDER BY created_at DESC LIMIT 10");
    console.log("Recent Wishlist Items:");
    console.table(res.rows);
    
    const headers = await pool.query("SELECT user_id, product_id FROM wishlist LIMIT 10");
    console.log("Wishlist Headers:");
    console.table(headers.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
