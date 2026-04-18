const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432,
});

async function migrateProducts() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Product Migration started...");

    // 1. Get all products ordered by ID
    const prodRes = await client.query(`SELECT id FROM seller_products ORDER BY id ASC`);
    const mapping = {};
    prodRes.rows.forEach((row, index) => {
      const newId = "PRDT" + String(index + 1).padStart(3, "0");
      mapping[String(row.id)] = newId;
    });

    console.log(`Mapped ${prodRes.rows.length} products.`);

    // 2. Define tables and their respective product-link columns
    const updateTargets = [
      { table: 'cart', col: 'product_id' },
      { table: 'cart_items', col: 'product_id' },
      { table: 'wishlist', col: 'product_id' },
      { table: 'wishlist_items', col: 'product_id' },
      { table: 'orders', col: 'product_id' },
      { table: 'reviews', col: 'product_id' },
      { table: 'product_images', col: 'product_id' },
      { table: 'deliveries', col: 'product_id' }
    ];

    const mainTables = [
      { table: 'seller_products', col: 'id' },
      { table: 'admin_products', col: 'id' }
    ];

    // 3. Drop all foreign keys that reference our main tables
    console.log("Dropping foreign key constraints...");
    const fkRes = await client.query(`
      SELECT 
        tc.table_name, 
        tc.constraint_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND ccu.table_name IN ('seller_products', 'admin_products');
    `);

    for (const fk of fkRes.rows) {
      console.log(`Dropping FK ${fk.constraint_name} on ${fk.table_name}...`);
      await client.query(`ALTER TABLE ${fk.table_name} DROP CONSTRAINT IF EXISTS ${fk.constraint_name}`);
    }

    // 4. Ensure all target columns and main ID columns are VARCHAR
    for (const target of [...mainTables, ...updateTargets]) {
      const checkCol = await client.query(`
        SELECT data_type FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
      `, [target.table, target.col]);

      if (checkCol.rows.length > 0) {
        if (checkCol.rows[0].data_type === 'integer') {
          console.log(`Altering ${target.table}.${target.col} to VARCHAR...`);
          await client.query(`ALTER TABLE ${target.table} ALTER COLUMN ${target.col} TYPE VARCHAR(255) USING ${target.col}::varchar`);
        }
      }
    }

    // 5. Update related tables
    for (const target of updateTargets) {
      const checkCol = await client.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
      `, [target.table, target.col]);
      if (checkCol.rows.length > 0) {
        console.log(`Updating ${target.table}.${target.col}...`);
        for (const [oldId, newId] of Object.entries(mapping)) {
          await client.query(`UPDATE ${target.table} SET ${target.col} = $1 WHERE ${target.col} = $2`, [newId, oldId]);
        }
      }
    }

    // 6. Update main product tables
    for (const target of mainTables) {
      console.log(`Updating ${target.table}.id...`);
      for (const [oldId, newId] of Object.entries(mapping)) {
        await client.query(`UPDATE ${target.table} SET id = $1 WHERE id = $2`, [newId, oldId]);
      }
    }

    // 7. Recreate foreign keys (simplest version, since we're in a private environment)
    // We'll point back to seller_products for most things as that's the primary source
    console.log("Recreating foreign key constraints...");
    await client.query(`ALTER TABLE cart_items ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES seller_products(id)`);
    // Add others if they existed... usually reviews, images, etc.
    const refs = [
      { table: 'reviews', col: 'product_id', refTable: 'seller_products' },
      { table: 'product_images', col: 'product_id', refTable: 'seller_products' },
      { table: 'wishlist_items', col: 'product_id', refTable: 'seller_products' }
    ];
    for (const ref of refs) {
       const checkTable = await client.query(`SELECT 1 FROM information_schema.tables WHERE table_name = $1`, [ref.table]);
       if (checkTable.rows.length > 0) {
         await client.query(`ALTER TABLE ${ref.table} ADD CONSTRAINT ${ref.table}_product_id_fkey FOREIGN KEY (${ref.col}) REFERENCES ${ref.refTable}(id) ON DELETE CASCADE`);
       }
    }

    await client.query("COMMIT");
    console.log("✅ Product migration completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Product migration failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateProducts();
