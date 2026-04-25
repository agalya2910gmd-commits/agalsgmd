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
    console.log("Starting backfill for finance with product join...");

    // Find seller_id for each order by checking products
    const ordersRes = await pool.query(`
      SELECT 
        o.id as order_id,
        o.total_amount,
        o.created_at,
        COALESCE(o.seller_id, sp.seller_id, ap.seller_id) as seller_id
      FROM orders o
      LEFT JOIN seller_products sp ON o.product_id = sp.id
      LEFT JOIN admin_products ap ON o.product_id = ap.id
    `);

    console.log(`Processing ${ordersRes.rows.length} orders...`);

    let hyCount = 0;
    for (const row of ordersRes.rows) {
      if (!row.seller_id) continue;

      const date = new Date(row.created_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const half = month <= 6 ? 1 : 2;
      const revenue = parseFloat(row.total_amount || 0);
      const commission = revenue * 0.10;
      const net = revenue - commission;

      const hyId = 'HY-' + row.seller_id + '-' + year + '-' + half;

      await pool.query(`
        INSERT INTO half_yearly_finances 
        (half_yearly_finances_id, seller_id, half_number, year, total_revenue, platform_commission, net_seller_earnings)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (half_yearly_finances_id) DO UPDATE SET
          total_revenue = half_yearly_finances.total_revenue + EXCLUDED.total_revenue,
          platform_commission = half_yearly_finances.platform_commission + EXCLUDED.platform_commission,
          net_seller_earnings = half_yearly_finances.net_seller_earnings + EXCLUDED.net_seller_earnings
      `, [hyId, row.seller_id, half, year, revenue, commission, net]);
      hyCount++;
    }
    
    console.log(`Half-yearly finances backfilled successfully.`);

    console.log("Backfill complete.");
  } catch (err) {
    console.error("Backfill error:", err);
  } finally {
    await pool.end();
  }
}

run();
