const nodemailer = require("nodemailer");
require("dotenv").config();

async function debug() {
  console.log("--- SMTP Debugger ---");
  console.log("Environment Variables:");
  console.log("SMTP_HOST:", process.env.SMTP_HOST || "DEFAULT: smtp.gmail.com");
  console.log("SMTP_PORT:", process.env.SMTP_PORT || "DEFAULT: 587");
  console.log("SMTP_USER:", process.env.SMTP_USER ? "***[REDACTED]***" : "NOT SET");
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "***[REDACTED]***" : "NOT SET");
  console.log("SMTP_FROM:", process.env.SMTP_FROM || "NOT SET");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log("\nVerifying transporter connection...");
    await transporter.verify();
    console.log("✅ SMTP connection is verified and authenticated!");

    const testMail = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to self
      subject: "SMTP Debug Test",
      text: "This is a test email sent from the debug script.",
      html: "<b>This is a test email sent from the debug script.</b>",
    };

    console.log("\nSending test email to self...");
    const info = await transporter.sendMail(testMail);
    console.log("✅ Test mail sent!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    
    // Check for "accepted" vs "rejected" recipients
    if (info.rejected.length > 0) {
      console.error("❌ Recipients rejected:", info.rejected);
    }
    if (info.accepted.length > 0) {
      console.log("📬 Message accepted for delivery to:", info.accepted);
    }

  } catch (err) {
    console.error("\n❌ SMTP Debug Failure:");
    console.error("Code:", err.code);
    console.error("Command:", err.command);
    console.error("Response:", err.response);
    console.error("Message:", err.message);
    if (err.message.includes("Application-specific password required")) {
      console.error("\nTIP: If using Gmail, you MUST use an App Password, not your regular password.");
    }
  }
}

debug();
