const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function fixAll() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    console.log("1. Checking orders table...");
    await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id VARCHAR(255)");
    
    console.log("2. Checking finance tables...");
    // Ensure finance tables from create_finance_tables.js exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_finances (
        daily_finance_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        date DATE,
        total_revenue DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS annual_finances (
        annual_finance_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        year INT,
        total_revenue DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("3. Verifying stats query components...");
    const sellerId = 'SEL002'; // Test ID
    const rev = await client.query("SELECT SUM(total_revenue) as total FROM annual_finances WHERE seller_id = $1", [sellerId]);
    const sales = await client.query("SELECT COUNT(*) FROM orders WHERE seller_id = $1", [sellerId]);
    console.log(`- Revenue check: ${rev.rows[0].total || 0}`);
    console.log(`- Sales check: ${sales.rows[0].count}`);

    await client.query("COMMIT");
    console.log("✅ All database fixes applied!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Fix failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixAll();
