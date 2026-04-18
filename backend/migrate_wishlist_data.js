const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function migrateWishlistData() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Disable constraints temporarily for the session
    await client.query("SET session_replication_role = 'replica';");

    console.log("Migrating wishlist records to wishlist_items...");

    // 1. Get all existing wishlist items
    const wishlistItems = await client.query("SELECT * FROM wishlist");
    
    // 2. Map users to their primary wishlist_id (first item found or generated)
    const userToWishlistId = {};
    
    for (const item of wishlistItems.rows) {
      if (!userToWishlistId[item.user_id]) {
        userToWishlistId[item.user_id] = item.id;
      }
      
      const parentWishlistId = userToWishlistId[item.user_id];

      // 3. Check if already exists in wishlist_items to avoid duplicate inserts
      const exists = await client.query(
        "SELECT 1 FROM wishlist_items WHERE wishlist_id=$1 AND product_id=$2",
        [parentWishlistId, item.product_id]
      );

      if (exists.rows.length === 0) {
        await client.query(
          `INSERT INTO wishlist_items 
           (wishlist_id, customer_id, product_id, created_at) 
           VALUES ($1, $2, $3, $4)`,
          [parentWishlistId, item.user_id, item.product_id, item.created_at || new Date()]
        );
      }
    }

    // Reset session_replication_role
    await client.query("SET session_replication_role = 'origin';");

    await client.query("COMMIT");
    console.log(`✅ Successfully synced ${wishlistItems.rows.length} items to wishlist_items!`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateWishlistData();
