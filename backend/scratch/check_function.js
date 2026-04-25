const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres', host: 'localhost', database: 'postgres', password: 'postgres123', port: 5432,
});
async function f() {
  const res = await pool.query(`
    SELECT routine_name, routine_definition 
    FROM information_schema.routines 
    WHERE routine_name = 'sync_finances_on_order'
  `);
  console.log(res.rows[0]?.routine_definition);
  await pool.end();
}
f();
