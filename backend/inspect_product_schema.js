const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function inspectProductSchema() {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        c.data_type
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.table_schema = tc.table_schema
          AND ccu.constraint_name = tc.constraint_name
        JOIN information_schema.columns AS c
          ON c.table_name = tc.table_name
          AND c.column_name = kcu.column_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name IN ('seller_products', 'admin_products');
    `;
    const res = await client.query(query);
    console.log("Foreign keys referencing product tables:");
    console.table(res.rows);

    const tables = [
      'seller_products', 'admin_products', 'cart', 'wishlist', 'orders', 
      'reviews', 'product_images', 'wishlist_items', 'deliveries'
    ];
    const colsQuery = `
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = ANY($1)
      AND column_name IN ('id', 'product_id');
    `;
    const colsRes = await client.query(colsQuery, [tables]);
    console.log("\nColumn types for product identification:");
    console.table(colsRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

inspectProductSchema();
