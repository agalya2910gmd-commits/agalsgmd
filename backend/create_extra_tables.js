const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createExtraTables() {
  const client = await pool.connect();
  try {
    console.log("Forcibly terminating other connections to free up slots...");
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid <> pg_backend_pid();
    `);

    console.log("Creating product_images table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        image_id SERIAL PRIMARY KEY,
        product_id INTEGER,
        image_url TEXT,
        alt_text VARCHAR(255),
        is_primary BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating categories table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        parent_category_id INTEGER,
        name VARCHAR(255),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ product_images and categories tables created successfully!");
  } catch (err) {
    console.error("❌ Failed to create tables:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createExtraTables();
