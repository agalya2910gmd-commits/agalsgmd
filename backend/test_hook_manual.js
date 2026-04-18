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
    const r = await client.query("UPDATE orders SET order_status = 'shipped' WHERE id = (SELECT id FROM orders LIMIT 1) RETURNING id");
    console.log("updated:", r.rows);
    const d = await client.query("SELECT * FROM deliveries");
    console.log("deliveries:", d.rows);
    await client.query("UPDATE orders SET order_status = 'Pending' WHERE id = " + r.rows[0].id);
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}
run();
