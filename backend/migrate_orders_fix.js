const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function migrate() {
  try {
    console.log("Applying migration: Add seller_id to orders table...");
    await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id VARCHAR(255)");
    console.log("✅ Migration successful!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await pool.end();
  }
}

migrate();
