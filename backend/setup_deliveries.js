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

    console.log("1. Modifying deliveries schema safely...");
    await client.query(`
      ALTER TABLE deliveries
      ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50),
      ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // Ensure UNIQUE constraint on order_id to enable robust UPSERTs preventing fatal duplicates
    console.log("2. Ensuring unique relational identifier sets...");
    const constraintCheck = await client.query(`
      SELECT conname FROM pg_constraint 
      WHERE conrelid = 'deliveries'::regclass 
      AND contype = 'u' 
      AND conname = 'deliveries_order_id_key'
    `);
    
    if (constraintCheck.rows.length === 0) {
      // Just in case there are duplicates already, we shouldn't fail. We checked earlier it was empty.
      await client.query(`ALTER TABLE deliveries ADD CONSTRAINT deliveries_order_id_key UNIQUE (order_id);`);
    }

    console.log("3. Backfilling historic records...");
    const oldOrders = await client.query(`
      SELECT id as order_id, user_id as customer_id, order_status, created_at 
      FROM orders 
      WHERE order_status ILIKE '%deliver%' OR order_status ILIKE '%ship%'
    `);
    
    let insertCount = 0;
    for (const row of oldOrders.rows) {
      let statusFormat = row.order_status.toLowerCase().includes('deliver') ? 'delivered' : 'shipped';
      await client.query(`
        INSERT INTO deliveries (order_id, customer_id, delivery_status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (order_id) DO NOTHING
      `, [row.order_id, row.customer_id, statusFormat, row.created_at]);
      insertCount++;
    }
    console.log(`Historic records mapped: \${insertCount}`);

    console.log("4. Building Core PostgreSQL Trigger Logic hooks...");
    // 4a. Function to upsert dynamically on table updates
    await client.query(`
      CREATE OR REPLACE FUNCTION handle_delivery_status_update()
      RETURNS TRIGGER AS $$
      DECLARE
        v_status VARCHAR(50);
        v_address_id INTEGER;
      BEGIN
        v_status := LOWER(NEW.order_status);
        -- Only intercept native delivery metrics
        IF v_status ILIKE '%deliver%' OR v_status ILIKE '%ship%' THEN
          
          -- Map clean statuses conceptually
          IF v_status ILIKE '%out%' THEN
              v_status := 'out_for_delivery';
          ELSIF v_status ILIKE '%deliver%' THEN
              v_status := 'delivered';
          ELSE 
              v_status := 'shipped';
          END IF;

          -- We attempt to parse address natively if strictly needed, but NULL is inherently supported
          INSERT INTO deliveries (order_id, customer_id, delivery_status, delivery_date, created_at, updated_at)
          VALUES (
            NEW.id, 
            NEW.user_id, 
            v_status, 
            CASE WHEN v_status = 'delivered' THEN NOW() ELSE NULL END, 
            NEW.created_at, 
            NOW()
          )
          ON CONFLICT (order_id) DO UPDATE SET 
            delivery_status = EXCLUDED.delivery_status,
            delivery_date = COALESCE(deliveries.delivery_date, EXCLUDED.delivery_date),
            updated_at = NOW();
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 4b. Function for orders_table using `status` column mapping efficiently
    await client.query(`
       CREATE OR REPLACE FUNCTION handle_orders_table_delivery()
       RETURNS TRIGGER AS $$
       DECLARE
        v_status VARCHAR(50);
       BEGIN
         v_status := LOWER(NEW.status);
         IF v_status ILIKE '%deliver%' OR v_status ILIKE '%ship%' THEN
            IF v_status ILIKE '%out%' THEN
              v_status := 'out_for_delivery';
            ELSIF v_status ILIKE '%deliver%' THEN
              v_status := 'delivered';
            ELSE
              v_status := 'shipped';
            END IF;

            INSERT INTO deliveries (order_id, customer_id, address_id, delivery_status, delivery_date, created_at, updated_at)
            VALUES (
              NEW.order_id,
              NEW.customer_id,
              NEW.address_id,
              v_status,
              CASE WHEN v_status = 'delivered' THEN NOW() ELSE NULL END,
              NEW.ordered_at,
              NOW()
            )
            ON CONFLICT (order_id) DO UPDATE SET 
              delivery_status = EXCLUDED.delivery_status,
              delivery_date = COALESCE(deliveries.delivery_date, EXCLUDED.delivery_date),
              updated_at = NOW();
         END IF;
         
         RETURN NEW;
       END;
       $$ LANGUAGE plpgsql;
    `);

    // 5. Connect Triggers flawlessly preventing UI Route breaks
    await client.query(`DROP TRIGGER IF EXISTS trigger_delivery_update_orders ON orders;`);
    await client.query(`
      CREATE TRIGGER trigger_delivery_update_orders
      AFTER UPDATE OF order_status ON orders
      FOR EACH ROW
      WHEN (OLD.order_status IS DISTINCT FROM NEW.order_status)
      EXECUTE FUNCTION handle_delivery_status_update();
    `);

    await client.query(`DROP TRIGGER IF EXISTS trigger_delivery_update_orders_table ON orders_table;`);
    await client.query(`
      CREATE TRIGGER trigger_delivery_update_orders_table
      AFTER UPDATE OF status ON orders_table
      FOR EACH ROW
      WHEN (OLD.status IS DISTINCT FROM NEW.status)
      EXECUTE FUNCTION handle_orders_table_delivery();
    `);

    await client.query("COMMIT");
    console.log("Delivery Tracker Setup Complete!");
  } catch(e) {
    await client.query("ROLLBACK");
    console.error("Migration Aborted due to fatal error:", e);
  } finally {
    client.release();
    pool.end();
  }
}

run();
