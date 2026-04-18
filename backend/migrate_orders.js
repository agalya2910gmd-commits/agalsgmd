const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function migrate() {
  try {
    console.log("Starting order migration...");

    // 1. Fetch all existing orders
    const ordersResult = await pool.query("SELECT * FROM orders");
    console.log(`Found ${ordersResult.rows.length} order items to migrate.`);

    for (const order of ordersResult.rows) {
      // 2. Resolve Address
      // For migration, we create an address entry if it doesn't exist for the user
      // We parse the shipping_address string (usually comma separated email, city, pincode)
      const addressParts = order.shipping_address ? order.shipping_address.split(',') : [];
      const street = addressParts[1] ? addressParts[1].trim() : 'Migrated Street';
      const city = addressParts[1] ? addressParts[1].trim() : order.shipping_address;
      const pincode = addressParts[2] ? addressParts[2].trim() : '';

      // Check if this address already exists in the addresses table for this customer
      let addressCheck = await pool.query(
        "SELECT address_id FROM addresses WHERE customer_id = $1 AND address_line_2 = $2 AND pincode = $3 LIMIT 1",
        [order.user_id, street, pincode]
      );

      let addressId;
      if (addressCheck.rows.length > 0) {
        addressId = addressCheck.rows[0].address_id;
      } else {
        // Create new address record
        const newAddress = await pool.query(
          `INSERT INTO addresses (customer_id, address_line_2, city, pincode, address_type) 
           VALUES ($1, $2, $3, $4, $5) RETURNING address_id`,
          [order.user_id, street, city, pincode, 'Migrated']
        );
        addressId = newAddress.rows[0].address_id;
        console.log(`- Created new address ID ${addressId} for customer ${order.user_id}`);
      }

      // 3. Insert into orders_table
      // We map the total_amount to both total and final for the migration
      await pool.query(
        `INSERT INTO orders_table (customer_id, address_id, status, total_amount, discount_amount, final_amount, ordered_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.user_id,
          addressId,
          order.order_status.toLowerCase(),
          parseFloat(order.total_amount) || 0,
          0,
          parseFloat(order.total_amount) || 0,
          order.created_at
        ]
      );
      console.log(`- Migrated order item ID ${order.id} into orders_table`);
    }

    console.log("✅ Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
