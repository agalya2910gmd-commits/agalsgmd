const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function checkProduct() {
  try {
    const resSeller = await pool.query("SELECT COUNT(*) FROM seller_products");
    console.log("Count in seller_products:", resSeller.rows[0].count);
    
    const resAdmin = await pool.query("SELECT COUNT(*) FROM admin_products");
    console.log("Count in admin_products:", resAdmin.rows[0].count);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkProduct();
