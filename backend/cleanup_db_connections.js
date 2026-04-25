const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function cleanup() {
  try {
    const res = await pool.query(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE state = 'idle' 
        AND pid <> pg_backend_pid()
    `);
    console.log(`Terminated ${res.rowCount} idle connections.`);
  } catch (err) {
    console.error("Cleanup error:", err);
  } finally {
    await pool.end();
  }
}

cleanup();
