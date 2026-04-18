const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function check() {
  const client = await pool.connect();
  try {
    console.log("--- Checking notifications table ---");
    const notificationsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position
    `);
    console.log("notifications columns:", notificationsRes.rows);

    console.log("\n--- Checking orders tables ---");
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('orders', 'orders_table')
    `);
    console.log("tables found:", tablesRes.rows);

    if (tablesRes.rows.some(r => r.table_name === 'orders_table')) {
        const orderCols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'orders_table'");
        console.log("orders_table columns:", orderCols.rows.map(r => r.column_name));
    }

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

check();
