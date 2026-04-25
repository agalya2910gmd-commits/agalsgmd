const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function run() {
  try {
    console.log("Starting backfill for finance and coupons...");

    // 1. Backfill coupon_usage from order_coupons
    const couponUsageRes = await pool.query(`
      INSERT INTO coupon_usage (usage_id, coupon_id, customer_id, order_id, used_at)
      SELECT 
        'USG-' || order_coupon_id || '-' || floor(random()*1000), 
        coupon_id, 
        NULL, -- customer_id not in order_coupons usually, we'll try to join if needed
        order_id, 
        now()
      FROM order_coupons
      ON CONFLICT DO NOTHING
    `);
    console.log(`Coupon usage backfilled: ${couponUsageRes.rowCount}`);

    // 2. Backfill half_yearly_finances from orders
    // We group orders by seller, year, and half
    const ordersRes = await pool.query(`
      SELECT 
        seller_id,
        EXTRACT(YEAR FROM created_at) as year,
        CASE WHEN EXTRACT(MONTH FROM created_at) <= 6 THEN 1 ELSE 2 END as half,
        SUM(total_amount) as revenue
      FROM orders
      WHERE seller_id IS NOT NULL
      GROUP BY seller_id, year, half
    `);

    let hyCount = 0;
    for (const row of ordersRes.rows) {
      const hyId = 'HY-' + row.seller_id + '-' + row.year + '-' + row.half;
      const commission = row.revenue * 0.10;
      const net = row.revenue - commission;

      await pool.query(`
        INSERT INTO half_yearly_finances 
        (half_yearly_finances_id, seller_id, half_number, year, total_revenue, platform_commission, net_seller_earnings)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (half_yearly_finances_id) DO UPDATE SET
          total_revenue = half_yearly_finances.total_revenue + EXCLUDED.total_revenue,
          platform_commission = half_yearly_finances.platform_commission + EXCLUDED.platform_commission,
          net_seller_earnings = half_yearly_finances.net_seller_earnings + EXCLUDED.net_seller_earnings
      `, [hyId, row.seller_id, row.half, row.year, row.revenue, commission, net]);
      hyCount++;
    }
    console.log(`Half-yearly finances backfilled: ${hyCount}`);

    console.log("Backfill complete.");
  } catch (err) {
    console.error("Backfill error:", err);
  } finally {
    await pool.end();
  }
}

run();
