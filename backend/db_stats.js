const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkStats() {
  try {
    const res = await pool.query("SHOW max_connections");
    console.log("Max Connections:", res.rows[0].max_connections);
    
    const count = await pool.query("SELECT count(*) FROM pg_stat_activity");
    console.log("Current Connections:", count.rows[0].count);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkStats();
