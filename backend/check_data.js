const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkData() {
  const client = await pool.connect();
  try {
    const custs = await client.query("SELECT id FROM customers LIMIT 10");
    console.log("Existing Customer IDs:");
    console.table(custs.rows);

    const tables = ['cart', 'wishlist', 'orders', 'contact', 'payments', 'reviews', 'notifications', 'addresses', 'orders_table'];
    for (const table of tables) {
      const col = table === 'cart' || table === 'wishlist' || table === 'orders' || table === 'contact' ? 'user_id' : 'customer_id';
      try {
        const res = await client.query(`SELECT DISTINCT ${col} FROM ${table} LIMIT 5`);
        console.log(`\nSample ${col} from ${table}:`);
        console.table(res.rows);
      } catch (e) {
        // console.log(`Skipping ${table}: ${e.message}`);
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkData();
