const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    console.log("Checking for products in admin_products not in seller_products...");
    const missing = await client.query(`
      SELECT * FROM admin_products 
      WHERE id NOT IN (SELECT id FROM seller_products)
    `);
    
    console.log(`Found ${missing.rows.length} products to migrate.`);
    
    for (const p of missing.rows) {
      await client.query(`
        INSERT INTO seller_products 
        (id, name, price, description, image, seller_id, category, subcategory, stock, 
         parent_product_id, category_id, review_id, sku, mrp, stock_quantity, 
         weight, length, breadth, height, brand, image_url, 
         variant_name, variant_value, is_variant, is_active, 
         available_sizes, available_colors, coupon_details, offers, measurements)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)
      `, [
        p.id, p.name, p.price, p.description, p.image, p.seller_id, p.category, p.subcategory, p.stock,
        p.parent_product_id, p.category_id, p.review_id, p.sku, p.mrp, p.stock_quantity,
        p.weight, p.length, p.breadth, p.height, p.brand, p.image_url,
        p.variant_name, p.variant_value, p.is_variant, p.is_active,
        p.available_sizes, p.available_colors, p.coupon_details, p.offers, p.measurements
      ]);
    }
    
    await client.query("COMMIT");
    console.log("Migration completed successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
