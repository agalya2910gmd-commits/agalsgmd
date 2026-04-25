const { Pool } = require("pg");
const pool = new Pool({ user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432 });
async function checkReviews() {
  try {
    const res = await pool.query(`SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'reviews'`);
    console.log(`\nTable: reviews`);
    console.table(res.rows);
    
    const countRes = await pool.query("SELECT COUNT(*) FROM reviews");
    console.log(`Total reviews: ${countRes.rows[0].count}`);
    
    if (countRes.rows[0].count > 0) {
        const sample = await pool.query("SELECT * FROM reviews LIMIT 1");
        console.log("Sample review:");
        console.log(sample.rows[0]);
    }
  } catch (e) {
    console.log(`\nError checking table reviews: ${e.message}`);
  }
  pool.end();
}
checkReviews();
