const { Pool } = require("pg");
const pool = new Pool({ user: "postgres", host: "localhost", database: "postgres", password: "postgres123", port: 5432 });

async function verify() {
  try {
    // 1. Check if we can find items by normalized ID (testing logic)
    const testId = "2";
    const formatted = "CUS" + testId.padStart(3, "0");
    const res = await pool.query("SELECT * FROM wishlist_items WHERE customer_id = $1 LIMIT 1", [formatted]);
    console.log(`Wishlist check for ${formatted}:`, res.rows.length > 0 ? "SUCCESS" : "FAIL (No data for this user yet)");

    // 2. Check product_images for recent entries
    const imgRes = await pool.query("SELECT * FROM product_images ORDER BY created_at DESC LIMIT 1");
    if (imgRes.rows.length > 0) {
      console.log("Recent Product Image stored:", imgRes.rows[0]);
    } else {
      console.log("No images in product_images table yet.");
    }
  } catch (e) {
    console.error("Verification Error:", e.message);
  } finally {
    pool.end();
  }
}
verify();
