const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function setupOtpPersistence() {
  const client = await pool.connect();
  try {
    console.log("Setting up OTP persistence table...");

    // We drop and recreate to ensure the exact columns requested are present
    // Since it was previously a simulation, no critical data will be lost
    await client.query(`DROP TABLE IF EXISTS otp_verifications`);

    await client.query(`
      CREATE TABLE otp_verifications (
        otp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id VARCHAR(255),
        phone_or_email VARCHAR(255) NOT NULL,
        otp_code VARCHAR(10) NOT NULL,
        expiry_time TIMESTAMP NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ otp_verifications table is ready.");
  } catch (err) {
    console.error("❌ Failed to setup OTP table:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupOtpPersistence();
