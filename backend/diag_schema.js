const { Pool } = require("pg");
const pool = new Pool({ user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432 });
async function run() {
  const tables = ['admin_products', 'sellers', 'seller_products', 'wishlist_items'];
  for (const table of tables) {
    try {
      const res = await pool.query(`SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = '${table}'`);
      console.log(`\nTable: ${table}`);
      console.table(res.rows);
    } catch (e) {
      console.log(`\nError checking table ${table}: ${e.message}`);
    }
  }
  pool.end();
}
run();
