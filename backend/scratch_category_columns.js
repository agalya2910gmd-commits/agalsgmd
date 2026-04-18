const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function run() {
  const rs = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories'");
  console.log(rs.rows);
  await pool.end();
}
run();
