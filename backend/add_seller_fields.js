const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function patchSellers() {
  try {
    console.log("Patching 'sellers' table with new fields...");

    // Add store_name
    await pool.query(`
      ALTER TABLE sellers ADD COLUMN IF NOT EXISTS store_name VARCHAR(255);
    `);
    console.log("- store_name column added");

    // Add gstin
    await pool.query(`
      ALTER TABLE sellers ADD COLUMN IF NOT EXISTS gstin VARCHAR(50);
    `);
    console.log("- gstin column added");

    // Add bank_account
    await pool.query(`
      ALTER TABLE sellers ADD COLUMN IF NOT EXISTS bank_account VARCHAR(50);
    `);
    console.log("- bank_account column added");

    // Add ifsc_code
    await pool.query(`
      ALTER TABLE sellers ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR(50);
    `);
    console.log("- ifsc_code column added");

    console.log("Sellers table patched successfully!");
  } catch (err) {
    console.error("Error patching sellers table:", err);
  } finally {
    await pool.end();
  }
}

patchSellers();
