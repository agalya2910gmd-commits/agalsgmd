const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function refactorWishlistItems() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Altering wishlist_items table...");
    
    // Add customer_id if missing
    await client.query(`
      ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255)
    `);

    // Rename added_at to created_at if added_at exists and created_at doesn't
    const checkAddedAt = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wishlist_items' AND column_name = 'added_at'
    `);
    const checkCreatedAt = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wishlist_items' AND column_name = 'created_at'
    `);

    if (checkAddedAt.rows.length > 0 && checkCreatedAt.rows.length === 0) {
      await client.query(`
        ALTER TABLE wishlist_items RENAME COLUMN added_at TO created_at
      `);
    } else if (checkCreatedAt.rows.length === 0) {
      await client.query(`
        ALTER TABLE wishlist_items ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
    }

    // Add updated_at if missing
    await client.query(`
      ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    await client.query("COMMIT");
    console.log("✅ wishlist_items table refactored successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Refactoring failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

refactorWishlistItems();
