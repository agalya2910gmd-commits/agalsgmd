const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function inspectSchema() {
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
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        JOIN information_schema.columns AS c
          ON c.table_name = tc.table_name
          AND c.column_name = kcu.column_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'customers';
    `;
    const res = await client.query(query);
    console.log("Foreign keys referencing 'customers':");
    console.table(res.rows);

    const colsQuery = `
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('customers', 'cart', 'wishlist', 'orders', 'contact', 'payments', 'reviews', 'notifications', 'addresses', 'orders_table')
      AND column_name IN ('id', 'customer_id', 'user_id');
    `;
    const colsRes = await client.query(colsQuery);
    console.log("\nColumn types for identifying columns:");
    console.table(colsRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

inspectSchema();
