const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

function normalizeId(type, id) {
  if (!id) return null;
  const s = String(id);
  if (s.toLowerCase() === 'nan' || s.toLowerCase() === 'undefined') return null;
  if (/^\d+$/.test(s)) {
    if (type === 'customer' || type === 'user') return 'CUS' + s.padStart(3, '0');
    if (type === 'product') return 'PRDT' + s.padStart(3, '0');
    if (type === 'seller') return 'SEL' + s.padStart(3, '0');
  }
  return s;
}

async function debugStats() {
  const sellerId = normalizeId('seller', 'SEL002');
  console.log("Debugging stats for:", sellerId);
  try {
    console.log("Running revenue query...");
    const revenueRes = await pool.query("SELECT SUM(total_revenue) as total FROM annual_finances WHERE seller_id = $1", [sellerId]);
    console.log("Revenue:", revenueRes.rows[0]);

    console.log("Running sales query...");
    const salesRes = await pool.query("SELECT COUNT(*) FROM orders WHERE seller_id = $1", [sellerId]);
    console.log("Sales:", salesRes.rows[0]);

    console.log("Running products query...");
    const productRes = await pool.query("SELECT COUNT(*) FROM seller_products WHERE seller_id = $1", [sellerId]);
    console.log("Products:", productRes.rows[0]);

    console.log("Running low stock query...");
    const lowStockRes = await pool.query("SELECT COUNT(*) FROM seller_products WHERE seller_id = $1 AND stock > 0 AND stock <= 10", [sellerId]);
    console.log("Low Stock:", lowStockRes.rows[0]);

    const result = {
      totalRevenue: parseFloat(revenueRes.rows[0].total || 0),
      totalSales: parseInt(salesRes.rows[0].count),
      totalProducts: parseInt(productRes.rows[0].count),
      lowStockCount: parseInt(lowStockRes.rows[0].count)
    };
    console.log("Final Result:", result);

  } catch (err) {
    console.error("CATCHED ERROR:", err);
  } finally {
    await pool.end();
  }
}

debugStats();
