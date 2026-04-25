const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createRequestedTablesV3() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Creating half_yearly_finances table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS half_yearly_finances (
        half_yearly_finances_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        seller_id UUID,
        half_number INTEGER,
        year INTEGER,
        annual_finance_id UUID,
        total_revenue DECIMAL(15, 2),
        platform_commission DECIMAL(15, 2),
        net_seller_earnings DECIMAL(15, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating ORDER_SELLERS table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS ORDER_SELLERS (
        order_seller_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID,
        seller_id UUID,
        seller_subtotal DECIMAL(15, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating SHIPROCKET_TRACKING table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS SHIPROCKET_TRACKING (
        tracking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sr_order_id UUID,
        awb_code VARCHAR(255),
        current_status VARCHAR(255),
        current_location VARCHAR(50),
        estimated_delivery DATE,
        activity_log JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating SHIPROCKET_PAYLOAD table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS SHIPROCKET_PAYLOAD (
        payload_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sr_order_id UUID,
        product_id UUID,
        order_item_id UUID,
        product_name_snapshot TEXT,
        sku_snapshot VARCHAR(255),
        quantity INTEGER,
        weight_kg DECIMAL(10, 3),
        length_cm DECIMAL(10, 2),
        breadth_cm DECIMAL(10, 2),
        height_cm DECIMAL(10, 2),
        unit_price DECIMAL(15, 2),
        total_price DECIMAL(15, 2),
        hsn_code VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating SHIPROCKET_WEBHOOK_LOG table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS SHIPROCKET_WEBHOOK_LOG (
        webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sr_order_id UUID,
        event_type VARCHAR(255),
        raw_payload JSONB,
        is_processed BOOLEAN DEFAULT FALSE,
        error_message TEXT,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("✅ All additional requested tables created successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating tables:", error.message);
  } finally {
    client.release();
    pool.end();
  }
}

createRequestedTablesV3();
