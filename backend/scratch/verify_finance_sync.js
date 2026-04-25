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
    const resT = await pool.query("SELECT count(*) FROM finance_transactions");
    const resO = await pool.query("SELECT count(*) FROM orders");
    const resW = await pool.query("SELECT sum(total_revenue) as total FROM weekly_finances");
    console.log(`Transactions: ${resT.rows[0].count}`);
    console.log(`Orders: ${resO.rows[0].count}`);
    console.log(`Total Revenue (Weekly Aggregated): ${resW.rows[0].total}`);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
