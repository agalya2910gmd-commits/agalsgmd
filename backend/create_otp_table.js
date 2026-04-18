const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createOtpTable() {
  const client = await pool.connect();
  try {
    console.log("Forcibly terminating other connections to free up slots...");
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid <> pg_backend_pid();
    `);

    console.log("Enabling pgcrypto extension...");
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    console.log("Creating otp_verifications table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        otp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_type VARCHAR(50),
        user_ref_id UUID,
        contact VARCHAR(64),
        otp_hash VARCHAR(64),
        purpose VARCHAR(100),
        attempts INT DEFAULT 0,
        is_used BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ otp_verifications table created successfully!");
  } catch (err) {
    console.error("❌ Failed to create table:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createOtpTable();
