const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function run() {
  const client = await pool.connect();
  try {
    const listTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tables = listTables.rows.map(r => r.table_name);
    console.log("Tables:", tables);

    // Specifically check if address/addresses/orders_table exist
    const specific = ['address', 'addresses', 'orders_table', 'orders', 'quarterly_finances', 'weekly_finances', 'monthly_finances', 'annual_finances'];
    for (const t of specific) {
      if (tables.includes(t)) {
        console.log(`\nTable ${t} exists. Columns:`);
        const columns = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
        `, [t]);
        console.table(columns.rows);
      } else {
        console.log(`\nTable ${t} DOES NOT exist.`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
