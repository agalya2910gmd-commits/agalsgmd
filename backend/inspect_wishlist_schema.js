const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function inspectWishlistSchema() {
  const client = await pool.connect();
  try {
    const tables = ['wishlist', 'wishlist_items'];
    for (const table of tables) {
      const res = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table]);
      console.log(`\nSchema for ${table}:`);
      console.table(res.rows);
    }

    const fks = await client.query(`
      SELECT
        tc.table_name, kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('wishlist', 'wishlist_items');
    `);
    console.log("\nForeign keys for wishlist tables:");
    console.table(fks.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

inspectWishlistSchema();
