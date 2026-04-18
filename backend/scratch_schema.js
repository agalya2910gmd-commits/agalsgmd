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
    const schemas = {};
    const tables = ['seller_payouts', 'orders', 'seller_products', 'admin_products'];
    for(const table of tables) {
      const res = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table]);
      schemas[table] = res.rows;
    }
    console.log(JSON.stringify(schemas, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
