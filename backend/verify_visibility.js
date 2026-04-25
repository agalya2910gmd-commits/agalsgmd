async function verifyVisibility() {
  console.log("Fetching products to verify visibility...");
  try {
    const response = await fetch('http://localhost:5000/api/products');
    if (response.ok) {
      const products = await response.json();
      const latest = products[0];
      console.log("Total Products:", products.length);
      console.log("Latest Product:", JSON.stringify(latest, null, 2));
      
      if (latest && latest.name.startsWith("DEBUG_PRODUCT_")) {
        console.log("✅ Success! Latest product is the one we just added.");
      } else {
        console.warn("⚠️ Warning: Latest product is NOT the one we just added. Check ordering.");
      }
    } else {
      console.error(`❌ Failed: ${response.status}`);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

verifyVisibility();
