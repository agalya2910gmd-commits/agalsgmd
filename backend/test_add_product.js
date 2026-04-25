const axios = require('axios');
const FormData = require('form-data');

async function testAddProduct() {
  try {
    console.log("Adding Test Product...");
    const formData = new FormData();
    formData.append("name", "DEBUG_PRODUCT_" + Date.now());
    formData.append("price", "99.99");
    formData.append("seller_id", "SEL002");
    formData.append("category", "Men");
    formData.append("subcategory", "Shirts");
    formData.append("stock", "50");

    const res = await axios.post('http://localhost:5000/api/products', formData, {
      headers: formData.getHeaders()
    });

    console.log("✅ Success! Product ID:", res.data.product?.id);
  } catch (err) {
    if (err.response) {
      console.error(`❌ Failed: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    } else {
      console.error("❌ Error:", err.message);
    }
  }
}

testAddProduct();
