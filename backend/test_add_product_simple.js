async function testAddProduct() {
  const name = "DEBUG_PRODUCT_" + Date.now();
  console.log(`Adding Test Product: ${name}...`);
  
  try {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        price: 99.99,
        seller_id: "SEL002",
        category: "Men",
        subcategory: "Shirts",
        stock: 50
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Success! Product ID:", data.product?.id);
    } else {
      console.error(`❌ Failed: ${response.status} - ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testAddProduct();
