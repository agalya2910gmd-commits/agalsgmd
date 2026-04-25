const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkFinanceSchema() {
  const client = await pool.connect();
  try {
    const tables = ['daily_finances', 'weekly_finances', 'monthly_finances', 'quarterly_finances', 'annual_finances'];
    for (const table of tables) {
      console.log(`\n--- ${table} ---`);
      const res = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table]);
      res.rows.forEach(row => {
        console.log(`${row.column_name}: ${row.data_type}`);
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

checkFinanceSchema();
