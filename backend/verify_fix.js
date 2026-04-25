async function verify() {
  const baseUrl = "http://localhost:5000/api";
  const sellerIdRaw = 2;
  const sellerIdNorm = "SEL002";

  console.log("Verifying Seller Stats (Raw ID 2):");
  try {
    const res1 = await fetch(`${baseUrl}/seller/stats/${sellerIdRaw}`);
    const data1 = await res1.json();
    console.log(data1);
  } catch (e) { console.error("Error 1:", e.message); }

  console.log("\nVerifying Seller Stats (Normalized ID SEL002):");
  try {
    const res2 = await fetch(`${baseUrl}/seller/stats/${sellerIdNorm}`);
    const data2 = await res2.json();
    console.log(data2);
  } catch (e) { console.error("Error 2:", e.message); }

  console.log("\nVerifying Admin Revenue API:");
  try {
    const res3 = await fetch(`${baseUrl}/analytics/revenue?period=monthly`);
    const data3 = await res3.json();
    console.log(data3);
  } catch (e) { console.error("Error 3:", e.message); }
}

verify();
