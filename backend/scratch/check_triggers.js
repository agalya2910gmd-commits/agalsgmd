const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres', host: 'localhost', database: 'postgres', password: 'postgres123', port: 5432,
});
async function f() {
  const res = await pool.query(`
    SELECT event_object_table, trigger_name, event_manipulation, action_statement 
    FROM information_schema.triggers
  `);
  console.table(res.rows);
  await pool.end();
}
f();
