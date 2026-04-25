const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

/**
 * GUARANTEED SMTP TRANSPORTER CONFIGURATION
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // Port 587 uses STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // This MUST be a 16-character App Password
  },
  tls: {
    rejectUnauthorized: false // Ensures delivery through common firewall/hosting blocks
  }
});

/**
 * CONNECTION VERIFICATION
 */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ [Mail Service] SMTP Connection Failure:", error.message);
    console.log("👉 Tip: Make sure SMTP_PASS in .env is a 16-character Google App Password.");
  } else {
    console.log("✅ [Mail Service] SMTP Server is ready for delivery (Direct Connection)");
  }
});

// Twilio Setup - Defensive initialization
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && process.env.TWILIO_AUTH_TOKEN)
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

/**
 * Sends order confirmation via Direct SMTP (Email) and SMS (Twilio)
 */
async function sendOrderConfirmation({
  orderNumber,
  customerEmail,
  customerPhone,
  customerName,
  items,
  total,
  shippingAddress
}) {
  console.log(`[Notification Service] Initializing SMTP delivery for Order ${orderNumber} to [${customerEmail}]...`);
  console.log(`[Notification Service] Payload: Items=${items?.length || 0}, Total=${total}, Address=${shippingAddress}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ [Notification Service] EMAIL FAILED: SMTP credentials missing in .env");
      throw new Error("SMTP credentials missing");
  }

  // Ensure total is a valid number
  const numericTotal = typeof total === "number" ? total : parseFloat(String(total).replace(/[₹,$\s]/g, ""));
  if (isNaN(numericTotal)) {
      console.warn(`[Notification Service] Warning: Total is invalid (${total}), defaulting to 0.00 for display.`);
  }

  // Rate Limit / Anti-Spam protection: Slight delay before dispatching
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 1. Send Email
  try {
    const itemsHtml = (items || []).map(item => {
      const itemPrice = typeof item.price === "number" ? item.price : parseFloat(String(item.price || 0).replace(/[₹,$\s]/g, ""));
      const itemQty = parseInt(item.quantity || 1, 10);
      const subtotal = (isNaN(itemPrice) ? 0 : itemPrice) * itemQty;

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name || item.name || "Product"}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${itemQty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${subtotal.toFixed(2)}</td>
        </tr>
      `;
    }).join("");

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #e6d160; text-align: center;">Order Confirmed!</h2>
        <p>Hi ${customerName || "Customer"},</p>
        <p>Thank you for your order. We've received it and are getting it ready for shipment.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${(isNaN(numericTotal) ? 0 : numericTotal).toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Shipping Address:</strong> ${shippingAddress || "Not Provided"}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">If you have any questions, please contact our support team.</p>
        <p>Best regards,<br/>The Store Team</p>
      </div>
    `;

    const mailOptions = {
      from: `"The Store Support" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      bcc: "agalyasrimurugan2000@gmail.com",
      subject: `Your Order Confirmation - ${orderNumber}`,
      html: emailContent,
      replyTo: process.env.SMTP_USER,
    };

    console.log(`[Notification Service] Dispatching email to ${customerEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    
    if (info.accepted.length > 0) {
      console.log(`✅ [Notification Service] Email delivered to: ${customerEmail} (MessageID: ${info.messageId})`);
    } else {
      console.error(`⚠️ [Notification Service] Email rejected by SMTP server for: ${customerEmail}`);
      throw new Error(`Email rejected for ${customerEmail}`);
    }
    
    // Also notify store owner
    if (process.env.STORE_OWNER_EMAIL && process.env.STORE_OWNER_EMAIL !== customerEmail) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await transporter.sendMail({
            from: `"Store Bot" <${process.env.SMTP_USER}>`,
            to: process.env.STORE_OWNER_EMAIL,
            subject: `Action Required: New Order Received - ${orderNumber}`,
            html: `<p>New order placed by ${customerName} (${customerEmail}).</p><p>Total: ₹${(isNaN(numericTotal) ? 0 : numericTotal).toFixed(2)}</p>`,
        });
        console.log(`✅ [Notification Service] Store Owner notified: ${process.env.STORE_OWNER_EMAIL}`);
    }

  } catch (error) {
    console.error(`❌ [Notification Service] SMTP Delivery Failure:`, error);
    throw error; // Re-throw to caller (server.js)
  }

  // 2. Send SMS via Twilio
  if (twilioClient && customerPhone) {
    try {
      const formattedPhone = customerPhone.startsWith("+") ? customerPhone : `+91${customerPhone.replace(/\D/g, "")}`;
      await twilioClient.messages.create({
        body: `Hi ${customerName}, your order ${orderNumber} for ₹${(isNaN(numericTotal) ? 0 : numericTotal).toFixed(2)} was successful!`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });
      console.log(`✅ [Notification Service] SMS sent to ${formattedPhone}`);
    } catch (error) {
      console.error(`❌ [Notification Service] SMS failed:`, error.message);
    }
  }
}

async function sendCartNotification({
  customerEmail,
  customerName,
  productName,
  price,
  quantity
}) {

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #4CAF50; text-align: center;">Cart Updated!</h2>
        <p>Hi ${customerName},</p>
        <p><strong>Product added to your cart successfully.</strong></p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
          <p style="margin: 5px 0;"><strong>Price:</strong> $${price}</p>
          <p style="margin: 5px 0;"><strong>Quantity:</strong> ${quantity}</p>
          <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${(parseFloat(price) * quantity).toFixed(2)}</p>
        </div>

        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">Ready to checkout? Head back to the store to complete your purchase!</p>
        <p>Best regards,<br/>The Store Team</p>
      </div>
    `;

    const mailOptions = {
      from: `"The Store Support" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      bcc: "agalyasrimurugan2000@gmail.com",
      subject: `Product added to your cart - ${productName}`,
      html: emailContent,
      replyTo: process.env.SMTP_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      console.log(`✅ [Notification Service] Cart Email delivered to: ${customerEmail}`);
    }
  } catch (error) {
    console.error(`❌ [Notification Service] Cart Email Delivery Failure:`, error);
  }
}

async function sendWelcomeEmail({ email, name, userType }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #4CAF50; text-align: center;">Welcome to Our Store!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining us as a <strong>${userType}</strong>. We're excited to have you on board!</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Account Type:</strong> ${userType}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Active</p>
        </div>

        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">Start exploring our store and enjoy your shopping experience!</p>
        <p>Best regards,<br/>The Store Team</p>
      </div>
    `;

    const mailOptions = {
      from: `"The Store Support" <${process.env.SMTP_USER}>`,
      to: email,
      bcc: "agalyasrimurugan2000@gmail.com",
      subject: `Welcome to Our Store - ${name}`,
      html: emailContent,
      replyTo: process.env.SMTP_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      console.log(`✅ [Notification Service] Welcome Email delivered to: ${email}`);
    }
  } catch (error) {
    console.error(`❌ [Notification Service] Welcome Email Delivery Failure:`, error);
  }
}

module.exports = {
  sendOrderConfirmation,
  sendCartNotification,
  sendWelcomeEmail,
};
