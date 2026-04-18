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

    console.log("Creating product_variants table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        variant_id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255),
        sku VARCHAR(100),
        variant_name VARCHAR(100),
        variant_value VARCHAR(100),
        price DECIMAL(10, 2),
        stock_quantity INT,
        weight DECIMAL(10, 2),
        is_active BOOLEAN
      );
    `);

    console.log("Creating return_requests table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS return_requests (
        return_request_id VARCHAR(255) PRIMARY KEY,
        order_item_id VARCHAR(255),
        customer_id VARCHAR(255),
        order_id VARCHAR(255),
        resolved_by_admin_id VARCHAR(255),
        reason TEXT,
        return_type VARCHAR(255),
        refund_amount DECIMAL(10, 2),
        refund_status VARCHAR(50),
        resolution_note TEXT,
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP
      );
    `);

    console.log("Creating audit_logs table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        audit_id VARCHAR(255) PRIMARY KEY,
        admin_id VARCHAR(255),
        table_name VARCHAR(255),
        record_id VARCHAR(255),
        action VARCHAR(255),
        old_values JSONB,
        new_values JSONB,
        ip_address VARCHAR(45),
        user_agent VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating order_status_history table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        history_id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255),
        status VARCHAR(255),
        changed_by VARCHAR(255),
        notes BYTEA,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("All tables successfully created!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating tables:", error);
  } finally {
    client.release();
    pool.end();
  }
}

createTables();
