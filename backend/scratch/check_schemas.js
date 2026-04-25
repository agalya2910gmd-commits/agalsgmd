const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

const tables = [
  'bank_account',
  'auth_sessions',
  'coupon_usage'
];

async function checkSchemas() {
  for (const table of tables) {
    try {
      const res = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = '${table}'
      `);
      console.log(`--- Schema for ${table} ---`);
      console.table(res.rows);
    } catch (err) {
      console.error(`Error checking ${table}:`, err);
    }
  }
  await pool.end();
}

checkSchemas();
