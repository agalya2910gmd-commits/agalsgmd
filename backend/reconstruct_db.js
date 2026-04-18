const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function reconstruct() {
  const client = await pool.connect();
  try {
    console.log("🚀 Starting database reconstruction...");
    await client.query("SET session_replication_role = 'replica'");
    await client.query("BEGIN");

    // 1. Identify all FKs (already have a list from research, but doing a sweep)
    console.log("- Dropping all ID-related foreign keys...");
    const fks = [
      { t: 'seller_products', c: 'seller_products_seller_id_fkey' },
      { t: 'admin_products', c: 'admin_products_seller_id_fkey' },
      { t: 'payments', c: 'payments_customer_id_fkey' },
      { t: 'address', c: 'address_customer_id_fkey' },
      { t: 'orders_table', c: 'orders_table_customer_id_fkey' },
      { t: 'cart_items', c: 'cart_items_product_id_fkey' },
      { t: 'reviews', c: 'reviews_product_id_fkey' },
      { t: 'product_images', c: 'product_images_product_id_fkey' },
      { t: 'wishlist_items', c: 'wishlist_items_product_id_fkey' }
    ];

    for (const fk of fks) {
      await client.query(`ALTER TABLE ${fk.t} DROP CONSTRAINT IF EXISTS ${fk.c}`).catch(() => {});
    }

    // 2. Comprehensive Type Conversion and Normalization
    const targets = [
      { tab: 'customers', id: 'id', prefix: 'CUS' },
      { tab: 'sellers', id: 'id', prefix: 'SEL' },
      { tab: 'seller_products', id: 'id', prefix: 'PRDT' },
      { tab: 'admin_products', id: 'id', prefix: 'PRDT' },
      { tab: 'cart', id: 'product_id', prefix: 'PRDT' },
      { tab: 'cart', id: 'user_id', prefix: 'CUS' },
      { tab: 'wishlist', id: 'product_id', prefix: 'PRDT' },
      { tab: 'wishlist', id: 'user_id', prefix: 'CUS' },
      { tab: 'wishlist_items', id: 'product_id', prefix: 'PRDT' },
      { tab: 'wishlist_items', id: 'customer_id', prefix: 'CUS' },
      { tab: 'orders', id: 'product_id', prefix: 'PRDT' },
      { tab: 'orders', id: 'user_id', prefix: 'CUS' },
      { tab: 'reviews', id: 'product_id', prefix: 'PRDT' },
      { tab: 'reviews', id: 'customer_id', prefix: 'CUS' },
      { tab: 'notifications', id: 'customer_id', prefix: 'CUS' },
      { tab: 'notifications', id: 'seller_id', prefix: 'SEL' },
      { tab: 'deliveries', id: 'seller_id', prefix: 'SEL' },
      { tab: 'seller_products', id: 'seller_id', prefix: 'SEL' },
      { tab: 'admin_products', id: 'seller_id', prefix: 'SEL' }
    ];

    for (const t of targets) {
      console.log(`- Converting and Normalizing ${t.tab}.${t.id}...`);
      // Ensure VARCHAR
      await client.query(`ALTER TABLE ${t.tab} ALTER COLUMN ${t.id} TYPE VARCHAR(255) USING ${t.id}::VARCHAR`);
      // Update numeric values to formatted strings
      await client.query(`
        UPDATE ${t.tab} 
        SET ${t.id} = '${t.prefix}' || LPAD(${t.id}, 3, '0') 
        WHERE ${t.id} ~ '^[0-9]+$'
      `);
    }

    // 3. Re-Sync admin_products to be absolutely sure
    console.log("- Re-syncing admin_products from seller_products...");
    await client.query("DELETE FROM admin_products");
    await client.query(`
      INSERT INTO admin_products (id, name, price, description, image, seller_id, category, subcategory, stock, created_at)
      SELECT id, name, price, description, image, seller_id, category, subcategory, stock, created_at FROM seller_products
    `);

    // 4. Re-create essential Foreign Keys
    console.log("- Re-creating primary foreign keys...");
    await client.query(`ALTER TABLE seller_products ADD CONSTRAINT seller_products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE`).catch(e => console.log("!", e.message));
    await client.query(`ALTER TABLE admin_products ADD CONSTRAINT admin_products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE`).catch(e => console.log("!", e.message));
    await client.query(`ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES seller_products(id) ON DELETE CASCADE`).catch(e => console.log("!", e.message));
    
    await client.query("COMMIT");
    console.log("✅ Database reconstruction and ID standardization finished!");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Critical error during reconstruction:", err.message);
  } finally {
    await client.query("SET session_replication_role = 'origin'");
    client.release();
    await pool.end();
  }
}

reconstruct();
