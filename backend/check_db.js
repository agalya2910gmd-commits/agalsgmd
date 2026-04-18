const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function checkSchema() {
  try {
    const tabs = ['cart', 'wishlist', 'orders'];
    for (const t of tabs) {
      console.log(`\n--- Schema for table: ${t} ---`);
      const res = await pool.query(
        "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1",
        [t]
      );
      if (res.rows.length === 0) {
        console.log(`Table ${t} does not exist!`);
      } else {
        console.table(res.rows);
      }
    }
  } catch (err) {
    console.error("Check failed:", err);
  } finally {
    await pool.end();
  }
}

checkSchema();
