const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createPayoutCouponTables() {
  const client = await pool.connect();
  try {
    console.log("Forcibly terminating other connections to free up slots...");
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid <> pg_backend_pid();
    `);

    console.log("Creating seller_payouts table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS seller_payouts (
        payout_id SERIAL PRIMARY KEY,
        seller_id INTEGER,
        initiated_by_admin_id INTEGER,
        amount NUMERIC(12, 2) NOT NULL,
        payment_method VARCHAR(100),
        transaction_ref VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        payout_period_start TIMESTAMP,
        payout_period_end TIMESTAMP
      )
    `);

    console.log("Creating coupons table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        coupon_id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        code VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50),
        discount_percent NUMERIC(5, 2),
        max_discount NUMERIC(12, 2),
        min_order_val NUMERIC(12, 2),
        used_count INTEGER DEFAULT 0,
        valid_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating order_coupons table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_coupons (
        order_coupon_id SERIAL PRIMARY KEY,
        order_id INTEGER,
        coupon_id INTEGER,
        discount_amount NUMERIC(12, 2) NOT NULL
      )
    `);

    console.log("✅ seller_payouts, coupons, and order_coupons tables created successfully!");
  } catch (err) {
    console.error("❌ Failed to create tables:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createPayoutCouponTables();
