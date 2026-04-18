const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("1. Modifying categories table structural schema...");
    
    // Safety check renaming using pg table metadata so it doesn't fail if already run
    const schemaRs = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'categories'");
    const columns = schemaRs.rows.map(r => r.column_name);

    if (columns.includes('name')) {
        await client.query(`ALTER TABLE categories RENAME COLUMN name TO category_name;`);
    }
    if (columns.includes('image_url')) {
        await client.query(`ALTER TABLE categories RENAME COLUMN image_url TO category_image;`);
    }

    await client.query(`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    console.log("2. Ensuring unique referential lock...");
    // Only add constraint if it does not exist
    const constraintCheck = await client.query(`
      SELECT conname FROM pg_constraint 
      WHERE conrelid = 'categories'::regclass 
      AND contype = 'u' 
      AND conname = 'categories_category_name_key'
    `);
    
    if (constraintCheck.rows.length === 0) {
      await client.query(`ALTER TABLE categories ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);`);
    }

    console.log("3. Backfilling historic text definitions securely generating organic IDs...");
    const res = await client.query(`
      INSERT INTO categories (category_name, created_at, updated_at)
      SELECT DISTINCT category, NOW(), NOW() FROM admin_products WHERE category IS NOT NULL
      UNION
      SELECT DISTINCT category, NOW(), NOW() FROM seller_products WHERE category IS NOT NULL
      ON CONFLICT (category_name) DO NOTHING
      RETURNING category_id, category_name;
    `);
    console.log(`Historic records natively populated: ${res.rows.length}`);

    console.log("4. Binding historical references mapping back dynamically...");
    
    // Updating admin_products strictly
    const updateAdmin = await client.query(`
      UPDATE admin_products
      SET category_id = c.category_id
      FROM categories c
      WHERE admin_products.category = c.category_name
      AND admin_products.category_id IS DISTINCT FROM c.category_id
    `);
    
    // Updating seller_products strictly
    const updateSeller = await client.query(`
      UPDATE seller_products
      SET category_id = c.category_id
      FROM categories c
      WHERE seller_products.category = c.category_name
      AND seller_products.category_id IS DISTINCT FROM c.category_id
    `);
    
    console.log(`Re-mapped back IDs successfully => Admin: ${updateAdmin.rowCount}, Seller: ${updateSeller.rowCount}`);

    console.log("5. Establishing Core Native 'BEFORE' Structural Triggers bypassing routes...");

    await client.query(`
      CREATE OR REPLACE FUNCTION maintain_categories_linking() RETURNS TRIGGER AS $$
      BEGIN
         -- Only parse valid structured formats inherently
         IF NEW.category IS NOT NULL AND TRIM(NEW.category) != '' THEN
            INSERT INTO categories (category_name, created_at, updated_at)
            VALUES (NEW.category, NOW(), NOW())
            ON CONFLICT (category_name) DO NOTHING;
            
            -- Explicitly silently redefine natively prior to execution avoiding node JS logic
            SELECT category_id INTO NEW.category_id FROM categories WHERE category_name = NEW.category;
         END IF;
         
         RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Tie admin hook
    await client.query(`DROP TRIGGER IF EXISTS trigger_admin_categories_upsert ON admin_products;`);
    await client.query(`
      CREATE TRIGGER trigger_admin_categories_upsert
      BEFORE INSERT OR UPDATE OF category ON admin_products
      FOR EACH ROW EXECUTE FUNCTION maintain_categories_linking();
    `);

    // Tie seller hook
    await client.query(`DROP TRIGGER IF EXISTS trigger_seller_categories_upsert ON seller_products;`);
    await client.query(`
      CREATE TRIGGER trigger_seller_categories_upsert
      BEFORE INSERT OR UPDATE OF category ON seller_products
      FOR EACH ROW EXECUTE FUNCTION maintain_categories_linking();
    `);

    await client.query("COMMIT");
    console.log("✅ Dynamic Category Storage setup executed flawlessly!");
  } catch(e) {
    await client.query("ROLLBACK");
    console.error("Migration Aborted. Fatal runtime constraint:", e);
  } finally {
    client.release();
    pool.end();
  }
}

run();
