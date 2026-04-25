const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function checkTables() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("Existing tables:", res.rows.map(r => r.table_name).sort());
  } catch (err) {
    console.error("Error checking tables:", err);
  } finally {
    await pool.end();
  }
}

checkTables();
