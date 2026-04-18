const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function run() {
  await pool.query('DROP TABLE IF EXISTS users CASCADE;');
  console.log("Successfully dropped 'users' table.");
  pool.end();
}

run().catch(console.dir);
