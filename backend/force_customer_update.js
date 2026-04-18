const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
  connectionTimeoutMillis: 5000, 
});

async function forcedMigrate() {
  let client;
  try {
    console.log("Attempting to get a connection...");
    client = await pool.connect();
    
    console.log("Forcibly terminating other connections to free up slots...");
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid <> pg_backend_pid();
    `);

    console.log("Updating customers table schema...");
    await client.query(`
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS dob DATE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    console.log("Setting up trigger...");
    await client.query(`
      CREATE OR REPLACE FUNCTION update_customers_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS trg_update_customers_timestamp ON customers;
      CREATE TRIGGER trg_update_customers_timestamp
      BEFORE UPDATE ON customers
      FOR EACH ROW
      EXECUTE FUNCTION update_customers_timestamp();
    `);

    console.log("✅ Customers table successfully updated with dob, gender, is_active, and updated_at!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    if (err.message.includes("too many clients")) {
      console.log("TIP: Run 'taskkill /F /IM node.exe' first to kill zombie processes.");
    }
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

forcedMigrate();
