const { sendWelcomeEmail } = require('../notification_service');

async function test() {
  console.log("Testing Welcome Email for Customer...");
  await sendWelcomeEmail({
    email: "agalyasrimurugan2000@gmail.com",
    name: "John Doe",
    userType: "Customer"
  });

  console.log("\nTesting Welcome Email for Seller...");
  await sendWelcomeEmail({
    email: "agalyasrimurugan2000@gmail.com",
    name: "Jane Smith",
    userType: "Seller"
  });

  console.log("\nTest finished.");
}

test();
