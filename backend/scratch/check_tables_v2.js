const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function run() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log("ALL_TABLES:", res.rows.map(r => r.table_name).sort());
    
    // Check specific tables mentioned by user
    const tablesToCheck = ['coupons', 'delivery', 'deliveries', 'payments', 'orders', 'products', 'seller_products', 'admin_products'];
    for (const table of tablesToCheck) {
      const exists = res.rows.some(r => r.table_name === table);
      console.log(`Table ${table} exists: ${exists}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
