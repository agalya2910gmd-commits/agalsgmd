const { sendOrderConfirmation } = require("./notification_service");
require("dotenv").config();

async function test() {
  console.log("--- Starting Notification Service Test ---");
  
  const mockOrderData = {
    orderNumber: "ORD-TEST-12345",
    customerEmail: "test-customer@example.com",
    customerPhone: "9999999999",
    customerName: "Test User",
    items: [
      { name: "Awesome T-Shirt", price: 25.00, quantity: 2 },
      { name: "Cool Cap", price: 15.00, quantity: 1 }
    ],
    total: 65.00,
    shippingAddress: "123 Test Lane, City, 123456"
  };

  await sendOrderConfirmation(mockOrderData);
  
  console.log("--- Test Finished ---");
}

test();
