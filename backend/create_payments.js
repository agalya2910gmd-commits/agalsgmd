const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createPaymentsTable() {
  try {
    console.log("Creating payments table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        customer_id INTEGER REFERENCES customers(id),
        payment_method VARCHAR(100),
        amount NUMERIC(10, 2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'Pending',
        gateway_name VARCHAR(100),
        gateway_response JSONB,
        failure_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      );
    `);
    console.log("✅ Payments table created successfully!");
  } catch (err) {
    console.error("Error creating payments table:", err);
  } finally {
    await pool.end();
  }
}

createPaymentsTable();
