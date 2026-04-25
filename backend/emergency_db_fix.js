const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function emergencyFix() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    console.log("1. Creating order_items table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255),
        product_id VARCHAR(255),
        seller_id VARCHAR(255),
        quantity INT DEFAULT 1,
        price DECIMAL(12, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("2. Ensuring orders table has seller_id...");
    await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id VARCHAR(255)");
    
    // Also ensure admin_products and seller_products are in sync
    console.log("3. Verifying product tables...");
    await client.query("ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE");
    await client.query("UPDATE admin_products SET is_active = TRUE WHERE is_active IS NULL");

    await client.query("COMMIT");
    console.log("✅ Emergency Database Fix Applied Successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Fix Failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

emergencyFix();
