const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
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

async function generateNextId(client, table, column, prefix) {
  const res = await client.query(
    `SELECT ${column} FROM ${table} WHERE ${column} ~ '^${prefix}[0-9]+$' ORDER BY length(${column}) DESC, ${column} DESC LIMIT 1`
  );
  if (res.rows.length > 0) {
    const lastId = res.rows[0][column];
    const numPart = parseInt(String(lastId).replace(/\D/g, '') || "0", 10);
    return prefix + String(numPart + 1).padStart(3, "0");
  }
  return prefix + "001";
}

async function simulateOrder() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const user_id = "CUS001";
    const items = [{ id: "PRDT026", price: 100, quantity: 1, name: "Test Product" }];
    const total_amount = 100;
    const shipping_address = "Test Address";
    const payment_method = "COD";

    for (const item of items) {
      const pid = normalizeId('product', item.id || item.product_id || item._id);
      
      let pInfo = await client.query("SELECT seller_id, price FROM admin_products WHERE id = $1", [pid]);
      if (pInfo.rows.length === 0) {
        pInfo = await client.query("SELECT seller_id, price FROM seller_products WHERE id = $1", [pid]);
      }
      const sId = pInfo.rows[0]?.seller_id;
      
      const numericPrice = 100;
      const qty = 1;

      const orderResult = await client.query(
        `INSERT INTO orders 
        (user_id, product_id, product_name, price, quantity, total_amount, shipping_address, payment_method, seller_id) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [user_id, pid, "Test Product", numericPrice, qty, total_amount, shipping_address, payment_method, sId]
      );
      const orderId = orderResult.rows[0].id;

      // Commission Logic
      const commId = await generateNextId(client, 'seller_commissions', 'commission_id', 'COM');
      const commissionRate = 10.00;
      let saleAmount = (numericPrice || 0) * (qty || 1);
      let commissionAmount = parseFloat((saleAmount * (commissionRate / 100)).toFixed(2));
      let sellerEarnings = parseFloat((saleAmount - commissionAmount).toFixed(2));

      await client.query(
        `INSERT INTO seller_commissions 
         (commission_id, order_item_id, seller_id, order_id, sale_amount, commission_rate, commission_amount, seller_earnings, status, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
        [commId, String(orderId), String(sId || '0'), String(orderId), saleAmount, commissionRate, commissionAmount, sellerEarnings, 'pending']
      );
      console.log("Simulated order and commission inserted. Order ID:", orderId, "Comm ID:", commId);
    }
    
    await client.query("COMMIT");
    console.log("Transaction committed.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Simulation failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

simulateOrder();
