// coupon_service.js
// Dedicated service module to natively trace dynamically applied coupons mathematically post-order

async function processOrderCoupons(client, items, total_amount, first_order_id, user_id) {
  try {
    // 1. Calculate the raw numerical constants out of frontend inputs without trusting logic states
    const subtotal = items.reduce((sum, item) => {
      const p = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[₹,$\s]/g, ""));
      return sum + (p * parseInt(item.quantity || 1, 10));
    }, 0);

    const numericTotal = typeof total_amount === "number" 
      ? total_amount 
      : parseFloat(String(total_amount).replace(/[₹,$\s]/g, ""));

    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const expectedTotal = subtotal + shipping + tax;

    // The gap translates directly into the applied checkout promotion
    const discountAmount = expectedTotal - numericTotal;

    // Proceed solely if an explicit discount > 0 was actually confirmed computationally
    if (discountAmount > 0.01) {
      let appliedCode = null;
      let accurateDiscount = 0;

      // Detect if 10% was applied accurately
      if (Math.abs(discountAmount - (subtotal * 0.1)) < 0.1) {
        appliedCode = 'SAVE10';
        accurateDiscount = subtotal * 0.1;
      } 
      // Detect if FREE shipping promotion stripped
      else if (Math.abs(discountAmount - 10) < 0.1 && shipping === 10) {
        appliedCode = 'FREESHIP';
        accurateDiscount = 10;
      }

      // If mapped cleanly against our DB
      if (appliedCode) {
        const couponsRes = await client.query("SELECT coupon_id FROM coupons WHERE code = $1", [appliedCode]);
        if (couponsRes.rows.length > 0) {
          const couponId = couponsRes.rows[0].coupon_id;

          // Directly insert into the relational mapper utilizing the active database pgClient connection pool
          await client.query(`
            INSERT INTO order_coupons 
            (order_id, coupon_id, customer_id, discount_amount, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, NOW(), NOW())
          `, [first_order_id, couponId, user_id, accurateDiscount]);
          
          console.log(`[Coupon Service] Successfully mapped ${appliedCode} -> Order ID ${first_order_id} ($${accurateDiscount.toFixed(2)})`);
        }
      } else {
        console.warn(`[Coupon Service] Detected mathematically applied discount gap (${discountAmount.toFixed(2)}) but could not match to dynamic active coupon DB reference.`);
      }
    }
  } catch (error) {
    console.error("[Coupon Service Hook] Error intercepting order checkout logic:", error);
  }
}

module.exports = {
  processOrderCoupons
};
