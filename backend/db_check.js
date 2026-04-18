const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function check() {
  const admins = await pool.query('SELECT * FROM admins');
  const sellers = await pool.query('SELECT * FROM sellers');
  const customers = await pool.query('SELECT * FROM customers');
  try {
    const products = await pool.query('SELECT * FROM seller_products');
    console.log("Seller Products:", products.rows);
  } catch (e) {
    console.log("Seller Products table does not exist or error:", e.message);
  }
  console.log("Admins:", admins.rows);
  console.log("Admins:", admins.rows);
  console.log("Sellers:", sellers.rows);
  console.log("Customers:", customers.rows);
  pool.end();
}

check().catch(console.dir);
