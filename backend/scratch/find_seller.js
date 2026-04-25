const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function findSeller() {
  try {
    const res = await pool.query('SELECT DISTINCT seller_id FROM seller_products LIMIT 5');
    console.log('Sellers:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

findSeller();
