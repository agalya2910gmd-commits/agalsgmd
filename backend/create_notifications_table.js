const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createNotificationsTable() {
  const client = await pool.connect();
  try {
    console.log("Forcibly terminating other connections to free up slots...");
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid <> pg_backend_pid();
    `);

    console.log("Creating notifications table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id SERIAL PRIMARY KEY,
        customer_id INTEGER,
        seller_id INTEGER,
        order_id INTEGER,
        type VARCHAR(50),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ notifications table created successfully!");
  } catch (err) {
    console.error("❌ Failed to create table:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createNotificationsTable();
