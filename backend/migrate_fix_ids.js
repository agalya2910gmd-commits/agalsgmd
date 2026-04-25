const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Starting ID Standardisation Migration...");

    // 1. seller_payouts
    console.log("Fixing seller_payouts...");
    await client.query("ALTER TABLE seller_payouts ALTER COLUMN seller_id TYPE VARCHAR(255);");

    // 2. notifications
    console.log("Fixing notifications...");
    await client.query("ALTER TABLE notifications ALTER COLUMN seller_id TYPE VARCHAR(255);");
    await client.query("ALTER TABLE notifications ALTER COLUMN customer_id TYPE VARCHAR(255);");

    // 3. categories
    console.log("Fixing categories...");
    await client.query("ALTER TABLE categories ALTER COLUMN admin_id TYPE VARCHAR(255);");

    // 4. Trigger Function: generate_seller_payout
    console.log("Fixing generate_seller_payout function...");
    await client.query(`
      CREATE OR REPLACE FUNCTION generate_seller_payout()
      RETURNS TRIGGER AS $$
      DECLARE
          v_seller_id VARCHAR(255);
          v_payout_amount NUMERIC;
      BEGIN
          -- Fetch the valid seller_id from seller_products using product_id
          SELECT seller_id INTO v_seller_id 
          FROM seller_products 
          WHERE id = NEW.product_id;
      
          IF FOUND AND v_seller_id IS NOT NULL THEN
              v_payout_amount := COALESCE(NEW.total_amount, NEW.price * NEW.quantity, 0);
              INSERT INTO seller_payouts (
                  seller_id, order_id, product_id, order_item_id,
                  payout_amount, payout_status, 
                  amount, status,
                  created_at, updated_at
              ) VALUES (
                  v_seller_id, NEW.id, NEW.product_id, NEW.id,
                  v_payout_amount, 'pending',
                  v_payout_amount, 'Pending',
                  COALESCE(NEW.created_at, NOW()), NOW()
              );
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 5. Trigger Function: fn_create_order_notification (if on orders_table)
    console.log("Fixing fn_create_order_notification function...");
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
          CAST(NEW.customer_id AS VARCHAR),
          NEW.order_id,
          'Your order ' || NEW.order_id || ' has been placed successfully',
          false,
          'Order Success',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (notification_id) DO NOTHING;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query("COMMIT");
    console.log("✅ Migration Successful!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration Failed:", err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
