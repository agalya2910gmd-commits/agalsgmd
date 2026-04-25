const fetch = require('node-fetch');

async function debugProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    console.log(`Total Products: ${data.length}`);
    if (data.length > 0) {
      console.log('Sample Product (id, name, seller_id, is_active):');
      console.log(data.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        seller_id: p.seller_id,
        is_active: p.is_active,
        type_of_seller_id: typeof p.seller_id
      })));
    }
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}

debugProducts();
