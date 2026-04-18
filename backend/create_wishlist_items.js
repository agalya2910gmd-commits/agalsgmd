const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createWishlistItemsTable() {
  const client = await pool.connect();
  try {
    console.log("Forcibly terminating other connections to free up slots...");
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid <> pg_backend_pid();
    `);

    console.log("Creating wishlist_items table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS wishlist_items (
        wishlist_item_id SERIAL PRIMARY KEY,
        wishlist_id INTEGER,
        product_id INTEGER,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ wishlist_items table created successfully!");
  } catch (err) {
    console.error("❌ Failed to create table:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createWishlistItemsTable();
