const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function inspectImageSchema() {
  const client = await pool.connect();
  try {
    const table = 'product_images';
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `, [table]);
    console.log(`\nSchema for ${table}:`);
    console.table(res.rows);

    const productsRes = await client.query(`
      SELECT id, name, image, image_url FROM seller_products LIMIT 5
    `);
    console.log("\nSample images in seller_products:");
    console.table(productsRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

inspectImageSchema();
