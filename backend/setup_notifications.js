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
    console.log("Starting Notification Automation Setup...");

    await client.query("BEGIN");

    // 1. Schema Enhancement
    console.log("Ensuring table schema has required columns...");
    await client.query(`
      ALTER TABLE notifications 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ALTER COLUMN is_read SET DEFAULT false,
      ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP
    `);

    // 2. Clear out any previous triggers to avoid double-processing if rerunning
    await client.query("DROP TRIGGER IF EXISTS trg_order_placed_notification ON orders_table");
    await client.query("DROP FUNCTION IF EXISTS fn_create_order_notification()");

    // 3. Create Trigger Function
    console.log("Creating automation function...");
    await client.query(`
      CREATE OR REPLACE FUNCTION fn_create_order_notification()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO notifications (
          customer_id, 
          order_id, 
          message, 
          is_read, 
          type, 
          created_at, 
          updated_at
        )
        VALUES (
          NEW.customer_id,
          NEW.order_id,
          'Your order ' || NEW.order_id || ' has been placed successfully',
          false,
          'Order Success',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (notification_id) DO NOTHING; -- Ensure we don't crash on ID clash
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 4. Attach Trigger to orders
    console.log("Attaching trigger to orders...");
    await client.query(`
      CREATE TRIGGER trg_order_placed_notification
      AFTER INSERT ON orders
      FOR EACH ROW
      EXECUTE FUNCTION fn_create_order_notification();
    `);

    // 5. Existing Data Migration (Safety check to avoid duplicates)
    console.log("Migrating historical data...");
    const migrationRes = await client.query(`
      INSERT INTO notifications (customer_id, order_id, message, is_read, type)
      SELECT 
        o.user_id as customer_id, 
        o.id as order_id, 
        'Your order ' || o.id || ' has been placed successfully', 
        false, 
        'Order Success'
      FROM orders o
      WHERE NOT EXISTS (
        SELECT 1 FROM notifications n WHERE n.order_id = o.id
      )
    `);

    console.log(`Migration complete. Backfilled ${migrationRes.rowCount} historical notifications.`);

    await client.query("COMMIT");
    console.log("✅ Notification automation is now live!");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Setup failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
