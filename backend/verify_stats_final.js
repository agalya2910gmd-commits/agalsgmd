const axios = require('axios');

async function verify() {
  try {
    console.log("Checking seller stats API...");
    const res = await axios.get('http://localhost:5000/api/seller/stats/SEL002');
    console.log("Stats Response:", JSON.stringify(res.data, null, 2));
    
    if (res.data.totalProducts !== undefined) {
      console.log("✅ Stats API is working!");
    } else {
      console.log("❌ Stats API returned unexpected data");
    }
  } catch (err) {
    if (err.response) {
      console.error(`❌ API Failed: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    } else {
      console.error("❌ Failed to reach server:", err.message);
    }
  }
}

verify();
