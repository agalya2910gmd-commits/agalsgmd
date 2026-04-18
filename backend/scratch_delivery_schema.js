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
    const tables = ['deliveries', 'orders_table', 'orders', 'shiprocket'];
    for(const table of tables) {
      const res = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table]);
      schemas[table] = res.rows;
    }
    console.log(JSON.stringify(schemas, null, 2));

    const ordersRes = await client.query("SELECT * FROM orders WHERE order_status ILIKE '%deliver%' OR order_status ILIKE '%ship%' LIMIT 3");
    console.log("Orders with delivery status:", ordersRes.rows);

    const ordersTableRes = await client.query("SELECT * FROM orders_table WHERE status ILIKE '%deliver%' OR status ILIKE '%ship%' LIMIT 3");
    console.log("Orders_table with delivery status:", ordersTableRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
