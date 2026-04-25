const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432
});

async function check() {
  try {
    const orders = await pool.query('SELECT id, created_at, total_amount FROM orders ORDER BY created_at DESC LIMIT 1');
    if (!orders.rows.length) return console.log('No orders found in db');
    const oid = orders.rows[0].id;
    console.log('LATEST ORDER OID:', oid, '| AMOUNT:', orders.rows[0].total_amount);
    
    // Check payments
    const pays = await pool.query('SELECT * FROM payments WHERE order_id = $1', [String(oid)]);
    console.log('PAYMENTS STORED:', pays.rowCount);
    
    // Check commissions
    const comm = await pool.query('SELECT * FROM seller_commissions WHERE order_id = $1', [String(oid)]);
    console.log('SELLER COMMISSIONS STORED:', comm.rowCount);
    if(comm.rowCount) console.log('COMMISSION DETAILS:', comm.rows[0]);
    
    // Check daily finances
    const dfin = await pool.query('SELECT * FROM daily_finances ORDER BY date DESC LIMIT 1');
    console.log('DAILY FINANCES STORED:', dfin.rowCount);
    if(dfin.rowCount) console.log('DAILY FINANCE SYNC:', dfin.rows[0]);

  } catch(err) {
    console.error('DB_ERROR:', err.message);
  } finally {
    pool.end();
  }
}
check();
