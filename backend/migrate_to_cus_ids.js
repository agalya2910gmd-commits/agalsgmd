const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Migration started...");

    // 1. Get all customers ordered by their current ID (numeric-aware ordering)
    const custRes = await client.query(`
      SELECT id, email FROM customers 
      ORDER BY 
        CASE WHEN id ~ '^[0-9]+$' THEN id::integer ELSE 999999 END,
        id ASC
    `);
    
    const mapping = {};
    custRes.rows.forEach((row, index) => {
      const newId = "CUS" + String(index + 1).padStart(3, "0");
      mapping[row.id] = newId;
    });

    console.log(`Mapped ${custRes.rows.length} customers.`);

    // 2. Define tables and their respective customer-link columns
    const updateTargets = [
      { table: 'cart', col: 'user_id' },
      { table: 'cart', col: 'customer_id' },
      { table: 'wishlist', col: 'user_id' },
      { table: 'orders', col: 'user_id' },
      { table: 'contact', col: 'user_id' },
      { table: 'payments', col: 'customer_id' },
      { table: 'reviews', col: 'customer_id' },
      { table: 'notifications', col: 'customer_id' },
      { table: 'addresses', col: 'customer_id' },
      { table: 'orders_table', col: 'customer_id' },
      { table: 'deliveries', col: 'customer_id' }
    ];

    // 3. Temporarily disable foreign key constraints to allow ID updates
    await client.query("SET session_replication_role = 'replica';");

    // 4. Ensure all target columns are VARCHAR(255) to avoid type mismatches
    for (const target of [ { table: 'customers', col: 'id' }, ...updateTargets]) {
      const checkCol = await client.query(`
        SELECT data_type FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
      `, [target.table, target.col]);

      if (checkCol.rows.length > 0) {
        const type = checkCol.rows[0].data_type;
        if (type === 'integer') {
          console.log(`Altering ${target.table}.${target.col} from integer to varchar...`);
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

    // 6. Update customers table
    console.log("Updating customers.id...");
    for (const [oldId, newId] of Object.entries(mapping)) {
      await client.query(`UPDATE customers SET id = $1 WHERE id = $2`, [newId, oldId]);
    }

    // 7. Reset session_replication_role
    await client.query("SET session_replication_role = 'origin';");

    await client.query("COMMIT");
    console.log("✅ Migration completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
