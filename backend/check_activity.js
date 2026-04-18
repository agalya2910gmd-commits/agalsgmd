const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkActivity() {
  try {
    const res = await pool.query("SELECT count(*) FROM pg_stat_activity");
    console.log("Current total connections:", res.rows[0].count);

    const detailed = await pool.query("SELECT pid, state, query, backend_start FROM pg_stat_activity");
    console.table(detailed.rows);
  } catch (err) {
    console.error("Error checking activity:", err.message);
  } finally {
    await pool.end();
  }
}

checkActivity();
