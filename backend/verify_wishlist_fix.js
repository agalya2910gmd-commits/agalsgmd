const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432,
});

async function verifyWishlist() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM wishlist_items LIMIT 10");
    console.log("Migrated Wishlist Items:");
    console.table(res.rows);

    const counts = await client.query("SELECT COUNT(*) FROM wishlist_items");
    console.log(`Total items in wishlist_items: ${counts.rows[0].count}`);

    const joins = await client.query(`
      SELECT wi.customer_id, p.name 
      FROM wishlist_items wi 
      JOIN seller_products p ON wi.product_id = p.id 
      LIMIT 5
    `);
    console.log("Sample Joins with Products:");
    console.table(joins.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyWishlist();
