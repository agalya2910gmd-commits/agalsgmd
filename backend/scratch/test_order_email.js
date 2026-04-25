const { sendOrderConfirmation } = require('../notification_service');

async function test() {
  try {
    await sendOrderConfirmation({
      orderNumber: "ORD-TEST-123",
      customerEmail: "agalyasrimurugan2000@gmail.com", // Using the fallback/test email
      customerPhone: "1234567890",
      customerName: "Test User",
      items: [
        { product_name: "Test Product 1", price: 100, quantity: 2 },
        { product_name: "Test Product 2", price: 50, quantity: 1 }
      ],
      total: 250,
      shippingAddress: "123 Test St, Test City"
    });
    console.log("Test finished.");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
