const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT enumlabel 
      FROM pg_enum 
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
      WHERE typname = 'transaction_type'
    `);
    console.log("Enum values for transaction_type:");
    console.log(res.rows);
  } catch (e) {
    console.error("Error checking enum:", e.message);
  } finally {
    pool.end();
  }
}
check();
