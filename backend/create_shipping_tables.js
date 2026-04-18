const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createShippingTables() {
  const client = await pool.connect();
  try {
    console.log("Forcibly terminating other connections to free up slots...");
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid <> pg_backend_pid();
    `);

    console.log("Creating deliveries table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        delivery_id SERIAL PRIMARY KEY,
        order_id INTEGER,
        order_item_id INTEGER,
        seller_id INTEGER,
        address_id INTEGER,
        pickup_location_id INTEGER,
        processed_webhook_id VARCHAR(255),
        shipping_address_snapshot TEXT,
        shiprocket_order_id VARCHAR(100),
        shipment_id VARCHAR(100),
        awb_code VARCHAR(100),
        courier_name VARCHAR(100),
        shipping_status VARCHAR(50),
        estimated_delivery_date TIMESTAMP,
        dispatched_at TIMESTAMP,
        delivered_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating shiprocket table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS shiprocket (
        sr_order_id SERIAL PRIMARY KEY,
        order_id INTEGER,
        payment_id INTEGER,
        channel_order_id VARCHAR(100),
        awb_code VARCHAR(100),
        shipment_id VARCHAR(100),
        courier_id INTEGER,
        courier_name VARCHAR(100),
        pickup_location VARCHAR(255),
        sr_status VARCHAR(50),
        sr_status_code INTEGER,
        sr_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ deliveries and shiprocket tables created successfully!");
  } catch (err) {
    console.error("❌ Failed to create tables:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createShippingTables();
