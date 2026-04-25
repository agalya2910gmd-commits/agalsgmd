const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function check() {
  const tables = ['finance_transactions', 'weekly_finances', 'monthly_finances', 'annual_finances'];
  for (const t of tables) {
    try {
      const res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${t}'`);
      console.log(`Table: ${t}`);
      console.log(res.rows);
    } catch (e) {
      console.error(`Error checking table ${t}:`, e.message);
    }
  }
  pool.end();
}
check();
