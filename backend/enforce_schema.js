const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function enforceSchema() {
  const client = await pool.connect();
  try {
    console.log("Starting schema enforcement...");
    await client.query("SET session_replication_role = 'replica'");
    await client.query("BEGIN");

    const changes = [
      { table: "sellers", col: "id" },
      { table: "product_images", col: "product_id" },
      { table: "wishlist_items", col: "product_id" },
      { table: "notifications", col: "customer_id" },
      { table: "notifications", col: "seller_id" },
      { table: "deliveries", col: "seller_id" },
      { table: "categories", col: "admin_id" } // Just in case admins want same format later
    ];

    for (const change of changes) {
      try {
        console.log(`Checking ${change.table}.${change.col}...`);
        // Check current type
        const typeRes = await client.query(
          "SELECT data_type FROM information_schema.columns WHERE table_name = $1 AND column_name = $2",
          [change.table, change.col]
        );
        
        if (typeRes.rows.length > 0 && typeRes.rows[0].data_type === 'integer') {
          console.log(`- Converting ${change.table}.${change.col} to VARCHAR...`);
          await client.query(`ALTER TABLE ${change.table} ALTER COLUMN ${change.col} TYPE VARCHAR(255) USING ${change.col}::VARCHAR`);
        } else {
          console.log(`- ${change.table}.${change.col} is already string/not found.`);
        }
      } catch (err) {
        console.error(`- Error converting ${change.table}.${change.col}:`, err.message);
      }
    }

    await client.query("COMMIT");
    console.log("✅ Schema enforcement completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Schema enforcement failed:", err.message);
  } finally {
    await client.query("SET session_replication_role = 'origin'");
    client.release();
    await pool.end();
  }
}

enforceSchema();
