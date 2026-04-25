const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres', host: 'localhost', database: 'postgres', password: 'postgres123', port: 5432,
});
async function f() {
  const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sellers'");
  console.log(res.rows);
  await pool.end();
}
f();
