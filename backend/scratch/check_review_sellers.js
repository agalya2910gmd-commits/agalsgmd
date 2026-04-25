const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function checkReviewSellers() {
  try {
    const res = await pool.query(`
      SELECT r.review_id, r.product_id, p.seller_id
      FROM reviews r
      LEFT JOIN seller_products p ON r.product_id = p.id
    `);
    console.log('Reviews and their sellers:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkReviewSellers();
