const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432,
});

async function verifyMigration() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT id, name FROM seller_products LIMIT 10");
    console.log("Migrated Product IDs (seller_products):");
    console.table(res.rows);

    const related = await client.query("SELECT product_id FROM product_images LIMIT 5");
    console.log("Sample product_id from product_images:");
    console.table(related.rows);

    const cart = await client.query("SELECT product_id FROM cart LIMIT 5");
    console.log("Sample product_id from cart:");
    console.table(cart.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyMigration();
