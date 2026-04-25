const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function verify() {
  const client = await pool.connect();
  try {
    console.log("--- 1. Verifying Product Fetch (should use seller_products) ---");
    const resProducts = await client.query("SELECT * FROM seller_products LIMIT 1");
    console.log(`Found ${resProducts.rows.length} products in seller_products.`);

    console.log("\n--- 2. Verifying Coupon Storage ---");
    const testCouponCode = 'TEST' + Date.now();
    const couponDetails = {
      code: testCouponCode,
      discount: 25,
      min_order: 1500,
      max_discount: 750,
      valid_until: '2026-12-31'
    };
    
    // Simulate API call logic for coupon sync
    const discount = parseFloat(couponDetails.discount) || 10;
    const minOrder = parseFloat(couponDetails.min_order) || 1000;
    const maxDiscount = parseFloat(couponDetails.max_discount) || 500;
    const expiryDate = new Date(couponDetails.valid_until);
    
    await client.query(
      `INSERT INTO coupons (admin_id, code, type, discount_percent, max_discount, min_order_val, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (code) DO UPDATE SET 
        type = EXCLUDED.type, 
        discount_percent = EXCLUDED.discount_percent,
        max_discount = EXCLUDED.max_discount,
        min_order_val = EXCLUDED.min_order_val,
        valid_until = EXCLUDED.valid_until`,
      [null, testCouponCode, 'percentage', discount, maxDiscount, minOrder, expiryDate]
    );
    
    const checkCoupon = await client.query("SELECT * FROM coupons WHERE code = $1", [testCouponCode]);
    if (checkCoupon.rows.length > 0) {
      console.log("Coupon stored correctly:", checkCoupon.rows[0]);
    } else {
      console.error("FAIL: Coupon not found.");
    }

    console.log("\n--- 3. Verifying Delivery Integration ---");
    // Simulate order placement
    const testOrderId = 99999 + Math.floor(Math.random() * 1000);
    await client.query(
        `INSERT INTO deliveries 
         (order_id, seller_id, shipping_address_snapshot, shipping_status, created_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [testOrderId, 101, '123 Test St', 'Pending']
    );
    
    const checkDelivery = await client.query("SELECT * FROM deliveries WHERE order_id = $1", [testOrderId]);
    if (checkDelivery.rows.length > 0) {
      console.log("Delivery record created correctly:", checkDelivery.rows[0]);
    } else {
      console.error("FAIL: Delivery record not found.");
    }

  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    client.release();
    pool.end();
  }
}

verify();
