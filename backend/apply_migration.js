const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, "migrate_addresses_schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    
    console.log("Applying migration...");
    await pool.query(sql);
    console.log("✅ Migration applied successfully!");
    
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await pool.end();
  }
}

runMigration();
