const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Creating SELLER_COMMISSIONS table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS seller_commissions (
        commission_id VARCHAR(255) PRIMARY KEY,
        order_item_id VARCHAR(255),
        seller_id VARCHAR(255),
        order_id VARCHAR(255),
        sale_amount DECIMAL(10, 2),
        commission_rate DECIMAL(10, 2),
        commission_amount DECIMAL(10, 2),
        seller_earnings DECIMAL(10, 2),
        status VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating REVERSE_SHIPMENTS table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS reverse_shipments (
        reverse_id VARCHAR(255) PRIMARY KEY,
        return_request_id VARCHAR(255),
        order_item_id VARCHAR(255),
        seller_id VARCHAR(255),
        customer_id VARCHAR(255),
        pickup_address_id VARCHAR(255),
        dropoff_pickup_location_id VARCHAR(255),
        shiprocket_reverse_order_id VARCHAR(255),
        reverse_awb_code VARCHAR(255),
        status VARCHAR(255),
        initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivered_at TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("Both tables successfully created!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating tables:", error);
  } finally {
    client.release();
    pool.end();
  }
}

createTables();
