const { sendOrderConfirmation } = require('./notification_service');

async function runTest() {
  console.log("SENDING TEST EMAIL...");
  try {
    await sendOrderConfirmation({
      orderNumber: `TEST-${Date.now()}`,
      customerEmail: "agalyasrimurugan2000@gmail.com",
      customerPhone: "1234567890",
      customerName: "Test Customer",
      items: [
        { product_name: "Test Item", quantity: 1, price: 9.99 }
      ],
      total: 9.99,
      shippingAddress: "123 Test Street"
    });
    console.log("TEST EMAIL AWAIT FINISHED");
  } catch(e) {
    console.log("ERROR IN TEST EMAIL", e);
  }
}

runTest();
