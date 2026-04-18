const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkCollisionDetails() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT id, name, email FROM customers WHERE id IN ('4', 'C004')");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkCollisionDetails();
