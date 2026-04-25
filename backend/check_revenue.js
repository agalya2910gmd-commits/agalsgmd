const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkRevenue() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT SUM(total_amount) as total, COUNT(*) as count FROM orders");
    console.log("Revenue Stats:", res.rows[0]);

    const samples = await client.query("SELECT id, total_amount FROM orders LIMIT 10");
    console.log("Sample totals:", samples.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkRevenue();
