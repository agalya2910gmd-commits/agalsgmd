const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='customers'", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows.map(r => r.column_name).join('\n'));
  }
  pool.end();
});
