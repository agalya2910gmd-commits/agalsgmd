const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createRequestedTables() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Enabling uuid-ossp extension...");
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    console.log("Creating AUTH_SESSIONS table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS AUTH_SESSIONS (
        session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_type VARCHAR(255),
        user_ref_id UUID,
        token_hash VARCHAR(64),
        device_info VARCHAR(255),
        ip_address VARCHAR(45),
        is_blacklisted BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating COUPON_USAGE table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS COUPON_USAGE (
        usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        coupon_id UUID,
        customer_id UUID,
        order_id UUID,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating SHIPROCKET_ORDERS table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS SHIPROCKET_ORDERS (
        sr_order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID,
        payment_id UUID,
        channel_order_id VARCHAR(255),
        awb_code VARCHAR(255),
        shipment_id VARCHAR(255),
        courier_id VARCHAR(255),
        courier_name VARCHAR(255),
        pickup_location VARCHAR(255),
        sr_status VARCHAR(255),
        sr_status_code INTEGER,
        sr_created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating SELLER_PICKUP_LOCATIONS table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS SELLER_PICKUP_LOCATIONS (
        pickup_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        seller_id UUID,
        location_name VARCHAR(255),
        contact_name VARCHAR(255),
        contact_phone VARCHAR(255),
        address_line_1 TEXT,
        city VARCHAR(255),
        state VARCHAR(255),
        pincode VARCHAR(255),
        shiprocket_location_id VARCHAR(255),
        is_default BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating BANK_ACCOUNT table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS BANK_ACCOUNT (
        bank_account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        owner_id UUID NOT NULL,
        owner_type VARCHAR(50), 
        account_number VARCHAR(20),
        account_holder_name VARCHAR(255),
        upi_id VARCHAR(100),
        bank_name VARCHAR(100),
        ifsc_code VARCHAR(20),
        account_type VARCHAR(50),
        verification_status VARCHAR(50),
        verified_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_by_admin_id UUID
      );
    `);

    await client.query("COMMIT");
    console.log("✅ All requested tables created successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating tables:", error.message);
  } finally {
    client.release();
    pool.end();
  }
}

createRequestedTables();
