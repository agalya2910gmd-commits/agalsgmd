const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function check() {
  try {
    const resSellers = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sellers'");
    console.log("Sellers Table:", resSellers.rows);
    
    const resDeliveries = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'deliveries'");
    console.log("Deliveries Table:", resDeliveries.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
