const http = require("http");

const reqBody = JSON.stringify({
  user_id: "CUS003",
  items: [
    {
      id: "PRDT_TEST",
      name: "Test Hook Product",
      price: 150,
      quantity: 2,
    }
  ],
  shipping_address: "123 Hook St",
  payment_method: "card",
  // Subtotal = 300. Tax = 30. Shipping = 0. Expected total = 330.
  // We applySAVE10 => -30. So final total_amount = 300.
  total_amount: 300
});

const req = http.request(
  {
    hostname: "localhost",
    port: 5000,
    path: "/api/orders",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(reqBody),
    },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", async () => {
      console.log("Response:", data);
      
      // Let's check DB immediately
      const { Pool } = require("pg");
      const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "postgres123",
        port: 5432,
      });

      const orderRes = await pool.query("SELECT * FROM orders WHERE user_id = 'CUS_TEST' ORDER BY id DESC LIMIT 1");
      console.log("Order row:", orderRes.rows[0]);
      
      if(orderRes.rows.length > 0) {
         const ocRes = await pool.query("SELECT * FROM order_coupons WHERE order_id = $1", [orderRes.rows[0].id]);
         console.log("Order Coupon Mapping:", ocRes.rows);
         if(ocRes.rows.length > 0) {
             console.log("✅ HOOK INTERCEPTION WORKS NATURALLY!")
         } else {
             console.error("❌ HOOK INTERCEPTION FAILED TO SEED.")
         }
      }

      await pool.query("DELETE FROM order_coupons WHERE order_id = $1", [orderRes.rows[0].id]);
      await pool.query("DELETE FROM payments WHERE order_id = $1", [orderRes.rows[0].id]);
      await pool.query("DELETE FROM orders WHERE user_id = 'CUS003' AND product_id = 'PRDT_TEST'");
      await pool.end();
    });
  }
);

req.on("error", (e) => {
  console.error("Problem with request:", e.message);
});

req.write(reqBody);
req.end();
