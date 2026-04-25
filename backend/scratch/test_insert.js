const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function test() {
  try {
    const res = await pool.query("INSERT INTO seller_commissions (commission_id, order_item_id, seller_id, order_id, sale_amount, commission_rate, commission_amount, seller_earnings, status) VALUES ('COM_TEST', '75', 'SEL002', '75', 100, 10, 10, 90, 'pending')");
    console.log('Insert success:', res.rowCount);
  } catch (err) {
    console.error('Insert failed:', err.message);
  } finally {
    await pool.end();
  }
}

test();
