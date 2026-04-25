const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

function logErrorToFile(error, context) {
  const logPath = path.join(__dirname, "server_error.txt");
  const logMessage = `\n[${new Date().toISOString()}] ${context}\n${error.stack}\n${"-".repeat(50)}\n`;
  fs.appendFileSync(logPath, logMessage);
}

app.use(cors());
app.use(express.json());

// ================= SELLER ONBOARDING & PICKUP LOCATIONS =================
app.post("/api/seller/onboarding", async (req, res) => {
  const { sellerId, formData } = req.body;
  if (!sellerId || !formData) {
    return res.status(400).json({ message: "Seller ID and Form Data required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Extract Pickup Location info from formData
    const step1 = formData.step1 || {};
    const step2 = formData.step2 || {};
    const step5 = formData.step5 || {};

    const contactName = step1.fullName || "";
    const contactPhone = step1.mobile || "";
    const addressLine1 = step5.pickupAddress || "";
    const city = step2.city || "";
    const state = step2.state || "";
    const pincode = step2.pincode || "";

    if (addressLine1) {
      // Check for existing primary pickup for this seller
      const existing = await client.query(
        "SELECT pickup_id FROM seller_pickup_locations WHERE seller_id = $1 AND location_name = $2",
        [sellerId, "Primary Pickup"]
      );

      if (existing.rows.length > 0) {
        const pickupId = existing.rows[0].pickup_id;
        await client.query(
          `UPDATE seller_pickup_locations SET
            contact_name = $1, contact_phone = $2, address_line_1 = $3, city = $4, state = $5, pincode = $6
          WHERE pickup_id = $7`,
          [contactName, contactPhone, addressLine1, city, state, pincode, pickupId]
        );
      } else {
        const pickupId = await generateNextId(client, "seller_pickup_locations", "pickup_id", "PICK");
        await client.query(
          `INSERT INTO seller_pickup_locations 
          (pickup_id, seller_id, location_name, contact_name, contact_phone, address_line_1, city, state, pincode, is_default, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [pickupId, sellerId, "Primary Pickup", contactName, contactPhone, addressLine1, city, state, pincode, true, true]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ message: "Onboarding data saved successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /api/seller/onboarding error:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
});

app.get("/api/seller/pickup-locations/:sellerId", async (req, res) => {
  const { sellerId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM seller_pickup_locations WHERE seller_id = $1",
      [sellerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/seller/pickup-locations error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= FORCE JSON =================
app.use("/api", (req, res, next) => {
  console.log(`[DEBUG] Middleware hit. Original URL: ${req.originalUrl}, Current URL: ${req.url}`);
  res.setHeader("Content-Type", "application/json");
  next();
});

app.get("/api/test-me", (req, res) => {
  res.json({ message: "I am working at the top!" });
});

// ================= DB =================
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
  max: 25, 
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
  connectionTimeoutMillis: 5000, 
});

// Graceful shutdown to prevent connection leaks
process.on('SIGINT', async () => {
  console.log('[DB] Closing pool on SIGINT...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[DB] Closing pool on SIGTERM...');
  await pool.end();
  process.exit(0);
});
console.log(`[DB DEBUG] Connecting to ${pool.options.database} on ${pool.options.host}:${pool.options.port} as ${pool.options.user}`);

async function logAudit(client, admin_id, table_name, record_id, action, old_values = null, new_values = null) {
  try {
    // Generate AUDTxxx ID
    const auditIdRes = await client.query(
      "SELECT audit_id FROM audit_logs ORDER BY created_at DESC LIMIT 1"
    );
    let nextAuditId = "AUDT001";
    if (auditIdRes.rows.length > 0) {
      const lastId = auditIdRes.rows[0].audit_id;
      const numPart = parseInt(String(lastId).replace(/\D/g, '') || "0", 10);
      nextAuditId = "AUDT" + String(numPart + 1).padStart(3, "0");
    }

    await client.query(
      `INSERT INTO audit_logs (audit_id, admin_id, table_name, record_id, action, old_values, new_values, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
      [
        nextAuditId,
        String(admin_id || 'SYSTEM'),
        table_name || 'N/A',
        String(record_id || 'N/A'),
        action,
        old_values ? JSON.stringify(old_values) : null,
        new_values ? JSON.stringify(new_values) : null
      ]
    );
    console.log(`[Audit] ${action} logged for ${table_name}:${record_id}`);
  } catch (err) {
    console.error("Audit logging failed:", err);
  }
}

async function generateNextId(client, table, column, prefix) {
  const res = await client.query(
    `SELECT ${column} FROM ${table} WHERE ${column} ~ '^${prefix}[0-9]+$' ORDER BY length(${column}) DESC, ${column} DESC LIMIT 1`
  );
  if (res.rows.length > 0) {
    const lastId = res.rows[0][column];
    const numPart = parseInt(String(lastId).replace(/\D/g, '') || "0", 10);
    return prefix + String(numPart + 1).padStart(3, "0");
  }
  return prefix + "001";
}

// ================= HELPERS (ID NORMALIZATION) =================
function normalizeId(type, id) {
  if (!id) return null;
  const s = String(id);
  if (s.toLowerCase() === 'nan' || s.toLowerCase() === 'undefined') return null;

  // If it's pure numeric, convert to CUSxxx, PRDTxxx, or SELxxx
  if (/^\d+$/.test(s)) {
    if (type === 'customer' || type === 'user') return 'CUS' + s.padStart(3, '0');
    if (type === 'product') return 'PRDT' + s.padStart(3, '0');
    if (type === 'seller') return 'SEL' + s.padStart(3, '0');
  }
  return s;
}
async function initTables() {
  const client = await pool.connect();
  try {
    const resSeller = await client.query("SELECT COUNT(*) FROM seller_products");
    const resAdmin = await client.query("SELECT COUNT(*) FROM admin_products");
    console.log(`[DB INFO] Total Products - Seller: ${resSeller.rows[0].count}, Admin: ${resAdmin.rows[0].count}`);
    
    await client.query("BEGIN");

    // Core Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image TEXT,
        price NUMERIC(10,2) NOT NULL,
        quantity INTEGER DEFAULT 1,
        subtotal NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image TEXT,
        price NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image TEXT,
        price NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        order_status VARCHAR(50) DEFAULT 'Pending',
        shipping_address TEXT,
        payment_method VARCHAR(100),
        seller_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        full_name VARCHAR(255),
        phone_number VARCHAR(20),
        email VARCHAR(255),
        house_name VARCHAR(255),
        street VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        landmark VARCHAR(255),
        address_type VARCHAR(50),
        subject VARCHAR(255),
        message TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS payments (
        payment_id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        customer_id VARCHAR(255),
        payment_method VARCHAR(100),
        amount NUMERIC(10, 2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'Pending',
        gateway_name VARCHAR(100),
        gateway_response JSONB,
        failure_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS reviews (
        review_id SERIAL PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        customer_id VARCHAR(255),
        order_item_id INTEGER,
        order_id INTEGER,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        body TEXT,
        reviewer_name VARCHAR(255),
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // OTP & Notifications
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        otp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_type VARCHAR(50),
        user_ref_id UUID,
        contact VARCHAR(64),
        otp_hash VARCHAR(64),
        purpose VARCHAR(100),
        attempts INT DEFAULT 0,
        is_used BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id SERIAL PRIMARY KEY,
        customer_id VARCHAR(255),
        seller_id VARCHAR(255),
        order_id INTEGER,
        type VARCHAR(50),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Product Metadata
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        image_id SERIAL PRIMARY KEY,
        product_id VARCHAR(255),
        image_url TEXT,
        alt_text VARCHAR(255),
        is_primary BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS categories (
        category_id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        parent_category_id INTEGER,
        name VARCHAR(255),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Shipping & Payouts
    await client.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        delivery_id SERIAL PRIMARY KEY,
        order_id INTEGER,
        order_item_id INTEGER,
        seller_id VARCHAR(255),
        address_id INTEGER,
        pickup_location_id INTEGER,
        processed_webhook_id VARCHAR(255),
        shipping_address_snapshot TEXT,
        shiprocket_order_id VARCHAR(100),
        shipment_id VARCHAR(100),
        awb_code VARCHAR(100),
        courier_name VARCHAR(100),
        shipping_status VARCHAR(50),
        estimated_delivery_date TIMESTAMP,
        dispatched_at TIMESTAMP,
        delivered_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS shiprocket (
        sr_order_id SERIAL PRIMARY KEY,
        order_id INTEGER,
        payment_id INTEGER,
        channel_order_id VARCHAR(100),
        awb_code VARCHAR(100),
        shipment_id VARCHAR(100),
        courier_id INTEGER,
        courier_name VARCHAR(100),
        pickup_location VARCHAR(255),
        sr_status VARCHAR(50),
        sr_status_code INTEGER,
        sr_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS seller_payouts (
        payout_id SERIAL PRIMARY KEY,
        seller_id VARCHAR(255),
        initiated_by_admin_id INTEGER,
        amount NUMERIC(12, 2) NOT NULL,
        payment_method VARCHAR(100),
        transaction_ref VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        payout_period_start TIMESTAMP,
        payout_period_end TIMESTAMP
      );
    `);

    // Coupons & Wishlist Items
    await client.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        coupon_id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        code VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50),
        discount_percent NUMERIC(5, 2),
        max_discount NUMERIC(12, 2),
        min_order_val NUMERIC(12, 2),
        used_count INTEGER DEFAULT 0,
        valid_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS order_coupons (
        order_coupon_id SERIAL PRIMARY KEY,
        order_id INTEGER,
        coupon_id INTEGER,
        discount_amount NUMERIC(12, 2) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS wishlist_items (
        wishlist_item_id SERIAL PRIMARY KEY,
        wishlist_id INTEGER,
        product_id VARCHAR(255),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Persistence & Finance Tables (Alphanumeric IDs)
    await client.query(`
      CREATE TABLE IF NOT EXISTS bank_account (
        bank_account_id VARCHAR(255) PRIMARY KEY,
        owner_id VARCHAR(255) NOT NULL,
        owner_type VARCHAR(50),
        account_number VARCHAR(100),
        account_holder_name VARCHAR(255),
        upi_id VARCHAR(100),
        bank_name VARCHAR(255),
        ifsc_code VARCHAR(100),
        account_type VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS auth_sessions (
        session_id VARCHAR(255) PRIMARY KEY,
        user_type VARCHAR(50),
        user_ref_id VARCHAR(255),
        token_hash VARCHAR(255),
        device_info VARCHAR(255),
        ip_address VARCHAR(50),
        is_blacklisted BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS coupon_usage (
        usage_id VARCHAR(255) PRIMARY KEY,
        coupon_id INTEGER,
        customer_id VARCHAR(255),
        order_id INTEGER,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS daily_finances (
        daily_finance_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        date DATE,
        weekly_finance_id VARCHAR(255),
        monthly_finance_id VARCHAR(255),
        total_revenue NUMERIC(15, 2) DEFAULT 0,
        platform_commission NUMERIC(15, 2) DEFAULT 0,
        net_seller_earnings NUMERIC(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS weekly_finances (
        weekly_finance_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        week_number INT,
        year INT,
        total_revenue NUMERIC(15, 2) DEFAULT 0,
        platform_commission NUMERIC(15, 2) DEFAULT 0,
        net_seller_earnings NUMERIC(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS monthly_finances (
        monthly_finance_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        month_number INT,
        year INT,
        total_revenue NUMERIC(15, 2) DEFAULT 0,
        platform_commission NUMERIC(15, 2) DEFAULT 0,
        net_seller_earnings NUMERIC(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS half_yearly_finances (
        half_yearly_finances_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        half_number INT,
        year INT,
        total_revenue NUMERIC(15, 2) DEFAULT 0,
        platform_commission NUMERIC(15, 2) DEFAULT 0,
        net_seller_earnings NUMERIC(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS finance_transactions (
        finance_transaction_id VARCHAR(255) PRIMARY KEY,
        daily_finance_id VARCHAR(255),
        order_id INTEGER,
        user_id VARCHAR(255),
        transaction_type VARCHAR(50),
        amount NUMERIC(15, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Standard columns & extensions
    await client.query(`
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS dob DATE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id VARCHAR(255);
      
      ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS available_sizes TEXT;
      ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS available_colors TEXT;
      ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS coupon_details JSONB;
      ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS offers TEXT;
      ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS measurements TEXT;

      ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS available_sizes TEXT;
      ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS available_colors TEXT;
      ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS coupon_details JSONB;
      ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS offers TEXT;
      ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS measurements TEXT;
    `);

    // TYPE STANDARDIZATION (Convert UUID to VARCHAR where linking exists)
    await client.query(`
      DO $$ 
      BEGIN 
        -- Fix bank_account
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bank_account' AND column_name = 'owner_id' AND data_type = 'uuid') THEN
          ALTER TABLE bank_account ALTER COLUMN owner_id TYPE VARCHAR(255);
          ALTER TABLE bank_account ALTER COLUMN bank_account_id TYPE VARCHAR(255);
        END IF;
        -- Fix coupon_usage
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupon_usage' AND column_name = 'customer_id' AND data_type = 'uuid') THEN
          ALTER TABLE coupon_usage ALTER COLUMN customer_id TYPE VARCHAR(255);
          ALTER TABLE coupon_usage ALTER COLUMN usage_id TYPE VARCHAR(255);
          ALTER TABLE coupon_usage ALTER COLUMN coupon_id TYPE INTEGER USING (NULL);
          ALTER TABLE coupon_usage ALTER COLUMN order_id TYPE INTEGER USING (NULL);
        END IF;
        -- Fix finance_transactions
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'finance_transactions' AND column_name = 'daily_finance_id' AND data_type = 'uuid') THEN
          ALTER TABLE finance_transactions ALTER COLUMN daily_finance_id TYPE VARCHAR(255);
          ALTER TABLE finance_transactions ALTER COLUMN finance_transaction_id TYPE VARCHAR(255);
          ALTER TABLE finance_transactions ALTER COLUMN user_id TYPE VARCHAR(255);
        END IF;
        -- Fix auth_sessions
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auth_sessions' AND column_name = 'user_ref_id' AND data_type = 'uuid') THEN
          ALTER TABLE auth_sessions ALTER COLUMN user_ref_id TYPE VARCHAR(255);
          ALTER TABLE auth_sessions ALTER COLUMN session_id TYPE VARCHAR(255);
        END IF;
      END $$;
    `);

    // Setup trigger for customers updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_customers_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS trg_update_customers_timestamp ON customers;
      CREATE TRIGGER trg_update_customers_timestamp
      BEFORE UPDATE ON customers
      FOR EACH ROW
      EXECUTE FUNCTION update_customers_timestamp();
    `);

    await client.query("COMMIT");
    console.log("✅ All tables ensured and standardized.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating/standardizing tables:", err);
  } finally {
    client.release();
  }
}
initTables();

// ================= STATIC =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= SIGNUP =================
app.post("/api/signup", async (req, res) => {
  const {
    name, email, password, isSeller,
    store_name, gstin, bank_account, ifsc_code,
    dob, gender
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isSeller) {
      const sellerCheck = await pool.query(
        "SELECT * FROM sellers WHERE email=$1",
        [email],
      );

      if (sellerCheck.rows.length > 0) {
        return res.status(400).json({
          message: "Seller email already exists",
        });
      }

      // Generate next SELxxx seller ID
      const lastSel = await pool.query(
        "SELECT id FROM sellers WHERE id::text ~ '^SEL[0-9]+$' ORDER BY length(id::text) DESC, id DESC LIMIT 1"
      );

      let nextSelId = "SEL001";
      if (lastSel.rows.length > 0) {
        const lastId = lastSel.rows[0].id;
        const numPart = parseInt(String(lastId).replace(/\D/g, ''), 10);
        nextSelId = "SEL" + String(numPart + 1).padStart(3, "0");
      } else {
        const lastEntry = await pool.query("SELECT id FROM sellers ORDER BY length(id::text) DESC, id DESC LIMIT 1");
        if (lastEntry.rows.length > 0) {
          const rawId = lastEntry.rows[0].id;
          const numPart = parseInt(String(rawId).replace(/\D/g, '') || "0", 10);
          nextSelId = "SEL" + String(numPart + 1).padStart(3, "0");
        }
      }

      await pool.query(
        "INSERT INTO sellers (id, name, email, password, store_name, gstin, bank_account, ifsc_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [nextSelId, name, email, hashedPassword, store_name, gstin, bank_account, ifsc_code],
      );

      // Record bank details in bank_account table
      if (bank_account) {
        const bankId = "BNK-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        await pool.query(
          "INSERT INTO bank_account (bank_account_id, owner_id, owner_type, account_number, ifsc_code, is_primary) VALUES ($1, $2, $3, $4, $5, $6)",
          [bankId, nextSelId, 'seller', bank_account, ifsc_code || '', true]
        );
      }

      // Async trigger welcome email
      const { sendWelcomeEmail } = require('./notification_service');
      if (email) {
        console.log("Sending Welcome Email to:", email);
        try {
          await sendWelcomeEmail({ email, name, userType: 'Seller' });
        } catch (err) {
          console.error("Welcome Email Error:", err);
        }
      }
    } else {
      const customerCheck = await pool.query(
        "SELECT * FROM customers WHERE email=$1",
        [email],
      );

      if (customerCheck.rows.length > 0) {
        return res.status(400).json({
          message: "Customer email already exists",
        });
      }

      // Generate next CUSxxx customer ID (Robust version)
      const lastCust = await pool.query(
        "SELECT id FROM customers WHERE id ~ '^CUS[0-9]+$' ORDER BY length(id) DESC, id DESC LIMIT 1"
      );

      let nextId = "CUS001";
      if (lastCust.rows.length > 0) {
        const lastId = lastCust.rows[0].id;
        const numPart = parseInt(lastId.replace(/\D/g, ''), 10);
        nextId = "CUS" + String(numPart + 1).padStart(3, "0");
      } else {
        // Fallback for any legacy numeric or Cxxx IDs
        const lastEntry = await pool.query("SELECT id FROM customers ORDER BY length(id) DESC, id DESC LIMIT 1");
        if (lastEntry.rows.length > 0) {
          const rawId = lastEntry.rows[0].id;
          const numPart = parseInt(rawId.replace(/\D/g, '') || "0", 10);
          nextId = "CUS" + String(numPart + 1).padStart(3, "0");
        }
      }

      await pool.query(
        "INSERT INTO customers (id, name, email, password, dob, gender) VALUES ($1, $2, $3, $4, $5, $6)",
        [nextId, name, email, hashedPassword, dob || null, gender || null],
      );

      // Async trigger welcome email
      const { sendWelcomeEmail } = require('./notification_service');
      if (email) {
        console.log("Sending Welcome Email to:", email);
        try {
          await sendWelcomeEmail({ email, name, userType: 'Customer' });
        } catch (err) {
          console.error("Welcome Email Error:", err);
        }
      }
    }

    return res.json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Server error during signup",
    });
  }
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const tableChecks = [
      { tableName: "admins", role: "admin" },
      { tableName: "sellers", role: "seller" },
      { tableName: "customers", role: "customer" },
    ];

    for (const check of tableChecks) {
      const result = await pool.query(
        `SELECT * FROM ${check.tableName} WHERE email=$1`,
        [email],
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
        let validPassword = false;

        // admin plain password support
        if (
          check.role === "admin" &&
          user.password &&
          !user.password.startsWith("$2")
        ) {
          validPassword = password === user.password;
        } else {
          validPassword = await bcrypt.compare(password, user.password);
        }

        if (!validPassword) {
          return res.status(400).json({
            message: "Invalid credentials",
          });
        }

        delete user.password;

        // Record Auth Session
        const sessionId = "SESS-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await pool.query(
          "INSERT INTO auth_sessions (session_id, user_type, user_ref_id, expires_at) VALUES ($1, $2, $3, $4)",
          [sessionId, check.role, user.id, expiresAt]
        );

        return res.json({
          message: `${check.role} login successful`,
          user: {
            ...user,
            role: check.role,
            sessionId: sessionId
          },
        });
      }
    }

    return res.status(400).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
    });
  }
});


// ================= OTP PERSISTENCE =================

// 1. Generate and Send OTP
app.post("/api/otp/send", async (req, res) => {
  const { customer_id, phone_or_email } = req.body;

  if (!phone_or_email) {
    return res.status(400).json({ message: "Missing contact information" });
  }

  try {
    // Generate 6-digit OTP
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry_time = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await pool.query(
      `INSERT INTO otp_verifications (customer_id, phone_or_email, otp_code, expiry_time) 
       VALUES ($1, $2, $3, $4)`,
      [customer_id || null, phone_or_email, otp_code, expiry_time]
    );

    console.log(`[OTP DEBUG] Code for ${phone_or_email}: ${otp_code}`); // Log to console for development

    res.json({
      message: "OTP sent successfully",
      // In production, we don't return the code, but for this dev setup we keep it silent or log it
    });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// 2. Verify OTP
app.post("/api/otp/verify", async (req, res) => {
  const { phone_or_email, otp_code } = req.body;

  if (!phone_or_email || !otp_code) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE phone_or_email = $1 AND otp_code = $2 AND is_verified = FALSE AND expiry_time > CURRENT_TIMESTAMP
       ORDER BY created_at DESC LIMIT 1`,
      [phone_or_email, otp_code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const otpRecord = result.rows[0];

    // Mark as verified
    await pool.query(
      "UPDATE otp_verifications SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE otp_id = $1",
      [otpRecord.otp_id]
    );

    res.json({ message: "OTP verified successfully", verified: true });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
});

// ================= ADD PRODUCT =================
app.post("/api/products", upload.single("image"), async (req, res) => {
  const {
    name, price, description, category, subcategory, stock,
    parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
    weight, length, breadth, height, brand, image_url,
    variant_name, variant_value, is_variant, is_active,
    available_sizes, available_colors, coupon_details, offers, measurements
  } = req.body;
  console.log("Seller ID:", req.body.seller_id);
  const seller_id = normalizeId('seller', req.body.seller_id);
  console.log(`[API DEBUG] POST /api/products - name: ${name}, seller_id: ${seller_id}`);

  // Sanitization and hardcoded visibility for persistence
  console.log(`[POST DEBUG] STARTING TRANSACTION - User: ${seller_id}, Name: ${name}`);
  const cleanPrice = parseFloat(price) || 0;
  const cleanMRP = parseFloat(mrp) || cleanPrice;
  const cleanStock = parseInt(stock) || 0;
  const cleanStockQty = isNaN(parseInt(stock_quantity)) ? cleanStock : parseInt(stock_quantity);
  const isActiveStatus = true; // HARDCODED TRUE for visibility

  console.log(`[POST DEBUG] STARTING TRANSACTION - User: ${seller_id}, Name: ${name}`);
  const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || image_url);

  if (!name || (!price && price !== 0)) {
    console.warn(`[API] Creation blocked: Missing name/price (name=${name}, price=${price})`);
    return res.status(400).json({
      message: "Missing required fields: Name and Price are mandatory.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Generate next PRDTxxx product ID
    const nextProductId = await generateNextId(client, 'seller_products', 'id', 'PRDT');

    const sellerResult = await client.query(
      `INSERT INTO seller_products 
      (id, name, price, description, image, seller_id, category, subcategory, stock,
       parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
       weight, length, breadth, height, brand, image_url,
       variant_name, variant_value, is_variant, is_active,
       available_sizes, available_colors, coupon_details, offers, measurements) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30) RETURNING *`,
      [
        nextProductId,
        name,
        cleanPrice,
        description,
        imagePath,
        seller_id,
        category,
        subcategory,
        cleanStock,
        parseInt(parent_product_id) || null,
        parseInt(category_id) || null,
        parseInt(review_id) || null,
        sku || null,
        cleanMRP,
        cleanStockQty,
        parseFloat(weight) || 0,
        parseFloat(length) || 0,
        parseFloat(breadth) || 0,
        parseFloat(height) || 0,
        brand || null,
        image_url || null,
        variant_name || null,
        variant_value || null,
        (is_variant === 'true' || is_variant === true),
        isActiveStatus,
        available_sizes || null,
        available_colors || null,
        coupon_details ? (typeof coupon_details === 'string' ? coupon_details : JSON.stringify(coupon_details)) : null,
        offers || null,
        measurements || null
      ],
    );
    console.log(`[POST DEBUG] seller_products INSERT rowCount: ${sellerResult.rowCount}`);

    const product = sellerResult.rows[0];
    console.log("Inserted Product:", product);

    await client.query(
      `INSERT INTO admin_products
      (id, name, price, description, image, seller_id, category, subcategory, stock,
       parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
       weight, length, breadth, height, brand, image_url,
       variant_name, variant_value, is_variant, is_active,
       available_sizes, available_colors, coupon_details, offers, measurements)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)`,
      [
        product.id,
        name,
        cleanPrice,
        description,
        imagePath,
        seller_id,
        category,
        subcategory,
        cleanStock,
        parseInt(parent_product_id) || null,
        parseInt(category_id) || null,
        parseInt(review_id) || null,
        sku || null,
        cleanMRP,
        cleanStockQty,
        parseFloat(weight) || 0,
        parseFloat(length) || 0,
        parseFloat(breadth) || 0,
        parseFloat(height) || 0,
        brand || null,
        image_url || null,
        variant_name || null,
        variant_value || null,
        (is_variant === 'true' || is_variant === true),
        isActiveStatus,
        available_sizes || null,
        available_colors || null,
        coupon_details ? (typeof coupon_details === 'string' ? coupon_details : JSON.stringify(coupon_details)) : null,
        offers || null,
        measurements || null
      ],
    );
    console.log(`[POST DEBUG] INSERT INTO admin_products SUCCESS: ${product.id}`);

    // ─── Automated Multi-Table Sync: Product Variants ───
    if (available_sizes || available_colors) {
      const sizes = available_sizes ? available_sizes.split(',').map(s => s.trim()) : ['Standard'];
      const colors = available_colors ? available_colors.split(',').map(c => c.trim()) : ['Default'];

      for (const size of sizes) {
        for (const color of colors) {
          // Generate VRTxxx ID
          const nextVrtId = await generateNextId(client, 'product_variants', 'variant_id', 'VRT');

          await client.query(
            `INSERT INTO product_variants 
             (variant_id, product_id, sku, variant_name, variant_value, price, stock_quantity, weight, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              nextVrtId,
              product.id,
              sku ? `${sku}-${size.charAt(0)}${color.charAt(0)}` : `SKU-${product.id}-${size}-${color}`,
              'Color-Size',
              `${color}-${size}`,
              parseFloat(price),
              parseInt(stock_quantity) || 10,
              parseFloat(weight) || 0,
              true
            ]
          );
        }
      }
    }

    // ─── Automated Multi-Table Sync: Coupons ───
    if (coupon_details) {
      try {
        const cd = typeof coupon_details === 'string' ? JSON.parse(coupon_details) : coupon_details;
        if (cd && cd.code) {
          await client.query(
            `INSERT INTO coupons (admin_id, code, type, discount_percent, max_discount, min_order_val, valid_until)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (code) DO NOTHING`,
            [null, cd.code, cd.type || 'percentage', parseFloat(cd.discount) || 10, 500, 1000, null]
          );
        }
      } catch (e) {
        console.warn("Could not auto-generate coupon entry:", e.message);
      }
    }

    // ─── Automated Multi-Table Sync: Product Images ───
    if (imagePath) {
      await client.query(
        "INSERT INTO product_images (product_id, image_url, is_primary, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
        [product.id, imagePath, true]
      );
    }

    await client.query("COMMIT");
    console.log(`[POST DEBUG] COMMIT SUCCESSFUL - Product ${nextProductId} is now PERMANENTLY in DB.`);

    // Log audit AFTER commit to avoid transaction poisoning
    await logAudit(pool, seller_id, 'seller_products', product.id, 'CREATE_PRODUCT', null, product);

    return res.json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("CRITICAL: Add product error (Transaction Rolled Back):", error);
    logErrorToFile(error, "POST /api/products - Product Addition");
    return res.status(500).json({
      message: "Database error while adding product. The operation was safely rolled back.",
      detail: error.message
    });
  } finally {
    client.release();
  }
});

// ================= GET PRODUCTS =================
app.get("/api/products", async (req, res) => {
  try {
    console.log(`[DATABASE DEBUG] Fetching ALL products from admin_products at ${new Date().toISOString()}`);
    const result = await pool.query(
      "SELECT *, offers as offer FROM admin_products ORDER BY created_at DESC",
    );

    console.log(`[DATABASE DEBUG] Successfully retrieved ${result.rows.length} products from DB.`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("CRITICAL: Fetch products error:", error);
    return res.status(500).json({
      message: "Server error while fetching products",
      error: error.message
    });
  }
});

// ================= UPDATE PRODUCT =================
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  const { id: rawId } = req.params;
  const id = normalizeId('product', rawId);
  const {
    name, price, description, category, subcategory, stock,
    parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
    weight, length, breadth, height, brand, image_url,
    variant_name, variant_value, is_variant, is_active,
    available_sizes, available_colors, coupon_details, offers, measurements
  } = req.body;
  const seller_id = normalizeId('seller', req.body.seller_id);

  const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || image_url);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Fetch old record for Audit
    const oldRes = await client.query("SELECT * FROM seller_products WHERE id = $1", [id]);
    const oldProduct = oldRes.rows[0];

    const query = `
      UPDATE seller_products SET 
        name=$1, price=$2, description=$3, category=$4, subcategory=$5, stock=$6, image=$7,
        parent_product_id=$8, category_id=$9, review_id=$10, sku=$11, mrp=$12, stock_quantity=$13,
        weight=$14, length=$15, breadth=$16, height=$17, brand=$18, image_url=$19,
        variant_name=$20, variant_value=$21, is_variant=$22, is_active=$23,
        available_sizes=$25, available_colors=$26, coupon_details=$27, offers=$28, measurements=$29
      WHERE id=$24 RETURNING *`;
    const updateResult = await client.query(query, [
      name, parseFloat(price), description, category, subcategory, parseInt(stock) || 0, imagePath,
      parseInt(parent_product_id) || null, parseInt(category_id) || null, parseInt(review_id) || null,
      sku || null, parseFloat(mrp) || null, parseInt(stock_quantity) || (parseInt(stock) || 0),
      parseFloat(weight) || null, parseFloat(length) || null, parseFloat(breadth) || null,
      parseFloat(height) || null, brand || null, image_url || null,
      variant_name || null, variant_value || null, is_variant === 'true' || is_variant === true,
      is_active === 'false' || is_active === false ? false : true,
      id,
      available_sizes || null,
      available_colors || null,
      coupon_details ? (typeof coupon_details === 'string' ? coupon_details : JSON.stringify(coupon_details)) : null,
      offers || null,
      measurements || null
    ]);

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await client.query(`
      UPDATE admin_products SET 
        name=$1, price=$2, description=$3, category=$4, subcategory=$5, stock=$6, image=$7,
        parent_product_id=$8, category_id=$9, review_id=$10, sku=$11, mrp=$12, stock_quantity=$13,
        weight=$14, length=$15, breadth=$16, height=$17, brand=$18, image_url=$19,
        variant_name=$20, variant_value=$21, is_variant=$22, is_active=$23,
        available_sizes=$25, available_colors=$26, coupon_details=$27, offers=$28, measurements=$29
      WHERE id=$24`, [
      name, parseFloat(price), description, category, subcategory, parseInt(stock) || 0, imagePath,
      parseInt(parent_product_id) || null, parseInt(category_id) || null, parseInt(review_id) || null,
      sku || null, parseFloat(mrp) || null, parseInt(stock_quantity) || (parseInt(stock) || 0),
      parseFloat(weight) || null, parseFloat(length) || null, parseFloat(breadth) || null,
      parseFloat(height) || null, brand || null, image_url || null,
      variant_name || null, variant_value || null, is_variant === 'true' || is_variant === true,
      is_active === 'false' || is_active === false ? false : true,
      id,
      available_sizes || null,
      available_colors || null,
      coupon_details ? (typeof coupon_details === 'string' ? coupon_details : JSON.stringify(coupon_details)) : null,
      offers || null,
      measurements || null
    ]);

    const updatedProduct = updateResult.rows[0];

    // ─── Automated Multi-Table Sync: Product Variants (Re-sync) ───
    if (available_sizes || available_colors) {
      await client.query("DELETE FROM product_variants WHERE product_id = $1", [id]);
      const sizes = available_sizes ? available_sizes.split(',').map(s => s.trim()) : ['Standard'];
      const colors = available_colors ? available_colors.split(',').map(c => c.trim()) : ['Default'];
      for (const size of sizes) {
        for (const color of colors) {
          const nextVrtId = await generateNextId(client, 'product_variants', 'variant_id', 'VRT');
          await client.query(
            `INSERT INTO product_variants 
             (variant_id, product_id, sku, variant_name, variant_value, price, stock_quantity, weight, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [nextVrtId, id, sku ? `${sku}-${size.charAt(0)}${color.charAt(0)}` : `SKU-${id}-${size}-${color}`, 'Color-Size', `${color}-${size}`, parseFloat(price), parseInt(stock_quantity) || 10, parseFloat(weight) || 0, true]
          );
        }
      }
    }

    // ─── Automated Multi-Table Sync: Coupons ───
    if (coupon_details) {
      try {
        const cd = typeof coupon_details === 'string' ? JSON.parse(coupon_details) : coupon_details;
        if (cd && cd.code) {
          await client.query(
            `INSERT INTO coupons (admin_id, code, type, discount_percent, max_discount, min_order_val, valid_until)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (code) DO UPDATE SET discount_percent = EXCLUDED.discount_percent`,
            [null, cd.code, cd.type || 'percentage', parseFloat(cd.discount) || 10, 500, 1000, null]
          );
        }
      } catch (e) {
        console.warn("Could not auto-update coupon entry:", e.message);
      }
    }

    await logAudit(client, seller_id || 'ADMIN', 'seller_products', id, 'UPDATE_PRODUCT', oldProduct, updatedProduct);

    await client.query("COMMIT");

    return res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update product error:", error);
    return res.status(500).json({
      message: "Server error while updating product",
    });
  } finally {
    client.release();
  }
});

// ================= DELETE PRODUCT =================
app.delete("/api/products/:id", async (req, res) => {
  const id = req.params.id;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM admin_products WHERE id=$1", [id]);

    const result = await client.query(
      "DELETE FROM seller_products WHERE id=$1",
      [id],
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await client.query("COMMIT");

    return res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete product error:", error);
    return res.status(500).json({
      message: "Server error while deleting product",
    });
  } finally {
    client.release();
  }
});

// ================= CART ENDPOINTS =================
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 ORDER BY created_at ASC",
      [req.params.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch cart error:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

app.post("/api/cart", async (req, res) => {
  const { user_id, product_id, product_name, product_image, price, quantity } =
    req.body;

  const uid = normalizeId("customer", user_id || req.body.userId);
  const pid = normalizeId("product", product_id || req.body.id || req.body._id || req.body.productId);

  if (!uid || !pid) {
    console.warn(`[Cart] Validation Failed: uid=${uid}, pid=${pid} (Input: ${JSON.stringify(req.body)})`);
    return res
      .status(400)
      .json({ message: "Missing required user_id or product_id" });
  }

  let cleanPrice = 0;
  if (typeof price === "number") {
    cleanPrice = price;
  } else if (typeof price === "string") {
    cleanPrice = parseFloat(price.replace(/[₹,$\s]/g, ""));
  }

  if (!uid || !pid) {
    return res.status(400).json({ message: "Invalid user_id or product_id" });
  }

  try {
    const checkItem = await pool.query(
      "SELECT * FROM cart WHERE user_id=$1 AND product_id=$2",
      [uid, pid],
    );

    if (checkItem.rows.length > 0) {
      const newQty = (checkItem.rows[0].quantity || 0) + (quantity || 1);
      const subtotal = newQty * (cleanPrice || 0);
      const update = await pool.query(
        "UPDATE cart SET quantity=$1, subtotal=$2 WHERE id=$3 RETURNING *",
        [newQty, subtotal, checkItem.rows[0].id],
      );
      res.json(update.rows[0]);

      // Async trigger cart notification
      const { sendCartNotification } = require('./notification_service');
      const userRes = await pool.query("SELECT name, email FROM customers WHERE id = $1", [uid]);
      let targetEmail = (userRes.rows.length > 0 && userRes.rows[0].email) ? userRes.rows[0].email : "";
      if (!targetEmail || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail))) targetEmail = "agalyasrimurugan2000@gmail.com";
      const targetName = (userRes.rows.length > 0 && userRes.rows[0].name) ? userRes.rows[0].name : "Test Customer";

      if (targetEmail) {
        console.log("Sending Add-to-Cart Email to:", targetEmail);
        try {
          await sendCartNotification({
            customerEmail: targetEmail,
            customerName: targetName,
            productName: product_name || "Product",
            price: cleanPrice || 0,
            quantity: quantity || 1
          });
        } catch (err) {
          console.error("Email Error:", err);
        }
      }
      return;
    } else {
      const sub = (quantity || 1) * (cleanPrice || 0);
      const insert = await pool.query(
        "INSERT INTO cart (user_id, product_id, product_name, product_image, price, quantity, subtotal) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [
          uid,
          pid,
          product_name,
          product_image,
          cleanPrice || 0,
          quantity || 1,
          sub,
        ],
      );
      res.json(insert.rows[0]);

      // Async trigger cart notification
      const { sendCartNotification } = require('./notification_service');
      const userRes = await pool.query("SELECT name, email FROM customers WHERE id = $1", [uid]);
      let targetEmail = (userRes.rows.length > 0 && userRes.rows[0].email) ? userRes.rows[0].email : "";
      if (!targetEmail || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail))) targetEmail = "agalyasrimurugan2000@gmail.com";
      const targetName = (userRes.rows.length > 0 && userRes.rows[0].name) ? userRes.rows[0].name : "Test Customer";

      if (targetEmail) {
        console.log("Sending Add-to-Cart Email to:", targetEmail);
        try {
          await sendCartNotification({
            customerEmail: targetEmail,
            customerName: targetName,
            productName: product_name || "Product",
            price: cleanPrice || 0,
            quantity: quantity || 1
          });
        } catch (err) {
          console.error("Email Error:", err);
        }
      }
      return;
    }
  } catch (err) {
    console.error("POST /api/cart - SQL Error:", err);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: err.message });
  }
});

app.put("/api/cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    if (quantity < 1) {
      await pool.query("DELETE FROM cart WHERE user_id=$1 AND product_id=$2", [
        user_id,
        product_id,
      ]);
      return res.json({ message: "Item removed" });
    }
    const cartItem = await pool.query(
      "SELECT price FROM cart WHERE user_id=$1 AND product_id=$2",
      [user_id, product_id],
    );
    if (cartItem.rows.length > 0) {
      const price = cartItem.rows[0].price;
      const subtotal = price * quantity;
      const update = await pool.query(
        "UPDATE cart SET quantity=$1, subtotal=$2 WHERE user_id=$3 AND product_id=$4 RETURNING *",
        [quantity, subtotal, user_id, product_id],
      );
      return res.json(update.rows[0]);
    }
    res.status(404).json({ message: "Item not found" });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: "Error updating cart" });
  }
});

app.delete("/api/cart", async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await pool.query("DELETE FROM cart WHERE user_id=$1 AND product_id=$2", [
      user_id,
      product_id,
    ]);
    res.json({ message: "Item deleted from cart" });
  } catch (err) {
    console.error("Delete cart item error:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
});

app.delete("/api/cart/clear/:userId", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart WHERE user_id=$1", [req.params.userId]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

// ================= WISHLIST ENDPOINTS (MAPPED TO wishlist_items) =================
app.get("/api/wishlist/:userId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        wi.wishlist_item_id as id,
        wi.product_id,
        p.name as product_name,
        p.image as product_image,
        p.price,
        wi.created_at
      FROM wishlist_items wi
      JOIN seller_products p ON wi.product_id = p.id
      WHERE wi.customer_id = $1
      ORDER BY wi.created_at DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch wishlist error:", err);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

app.post("/api/wishlist", async (req, res) => {
  try {
    const wishlistUserId = normalizeId('customer', req.body.uid || req.body.user_id || req.body.userId);
    const wishlistProductId = normalizeId('product', req.body.pid || req.body.product_id || req.body.id || req.body._id || req.body.productId);

    if (!wishlistUserId || !wishlistProductId) {
      return res.status(400).json({ error: "Invalid user_id or product_id" });
    }

    // 1. Map or create parent wishlist record
    let wishlistHeader = await pool.query("SELECT id FROM wishlist WHERE user_id=$1 LIMIT 1", [wishlistUserId]);

    let wishlistId;
    if (wishlistHeader.rows.length === 0) {
      // Create a shell record in wishlist table to act as header
      const newHeader = await pool.query(
        "INSERT INTO wishlist (user_id, product_id, product_name, price) VALUES ($1, $2, $3, $4) RETURNING id",
        [wishlistUserId, 'HEADER', 'Wishlist Root', 0]
      );
      wishlistId = newHeader.rows[0].id;
    } else {
      wishlistId = wishlistHeader.rows[0].id;
    }

    // 2. Check if item already exists in wishlist_items
    const existing = await pool.query(
      "SELECT * FROM wishlist_items WHERE customer_id=$1 AND product_id=$2",
      [wishlistUserId, wishlistProductId]
    );

    if (existing.rows.length > 0) {
      return res.json({ message: "Already in wishlist" });
    }

    // 3. Insert into wishlist_items
    const result = await pool.query(
      `INSERT INTO wishlist_items 
      (wishlist_id, customer_id, product_id)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [wishlistId, wishlistUserId, wishlistProductId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Critical Wishlist SQL Error:", error);
    res.status(500).json({ error: "Failed to add wishlist", detail: error.message });
  }
});

app.delete("/api/wishlist/:userId/:productId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const result = await pool.query(
      "DELETE FROM wishlist_items WHERE customer_id=$1 AND product_id=$2 RETURNING *",
      [userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.json({ message: "Item removed from wishlist" });
  } catch (err) {
    console.error("Delete wishlist item error:", err);
    res.status(500).json({ message: "Error deleting item from wishlist" });
  }
});

// ================= ORDERS ENDPOINTS =================
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC",
      [req.params.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ================= REVIEWS ENDPOINTS =================

// GET reviews by product_id
app.get("/api/reviews/:productId", async (req, res) => {
  const productId = req.params.productId;
  if (!productId) {
    return res.status(400).json({ message: "Invalid product_id" });
  }
  try {
    const result = await pool.query(
      `SELECT review_id, product_id, customer_id, order_id, rating, title, body,
              reviewer_name, is_approved, created_at
       FROM reviews
       WHERE product_id = $1 AND is_approved = TRUE
       ORDER BY created_at DESC`,
      [productId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("Fetch reviews error:", err);
    return res.status(500).json({ message: "Error fetching reviews" });
  }
});

// POST a new review
app.post("/api/reviews", async (req, res) => {
  const {
    product_id, customer_id, order_item_id, order_id,
    rating, title, body, reviewer_name
  } = req.body;

  const pid = product_id;
  const ratingVal = parseInt(rating, 10);

  if (!pid) {
    return res.status(400).json({ message: "Invalid product_id" });
  }
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }
  if (!body || !String(body).trim()) {
    return res.status(400).json({ message: "Review body is required" });
  }

  const cid = customer_id || null;
  const oitemid = order_item_id ? parseInt(order_item_id, 10) : null;
  const oid = order_id ? parseInt(order_id, 10) : null;

  try {
    console.log(`[Review] New submission: product_id=${pid}, customer_id=${cid}`);

    // Optional: Ensure only purchased users can review
    // (TEMPORARILY DISABLED FOR TESTING - Allowing all reviews)
    /*
    if (cid) {
      const purchaseCheck = await pool.query(
        "SELECT id FROM orders WHERE user_id=$1 AND product_id=$2 LIMIT 1",
        [cid, pid]
      );
      if (purchaseCheck.rows.length === 0) {
        console.log(`[Review] Blocked: user_id=${cid} hasn't purchased product_id=${pid}`);
        return res.status(403).json({ message: "You must purchase this product to leave a review" });
      }
      
      if (!oid) oid = purchaseCheck.rows[0].id;
      if (!oitemid) oitemid = purchaseCheck.rows[0].id;
    }
    */

    const result = await pool.query(
      `INSERT INTO reviews (product_id, customer_id, order_item_id, order_id, rating, title, body, reviewer_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        pid,
        cid,
        oitemid,
        oid,
        ratingVal,
        title ? String(title).trim() : null,
        String(body).trim(),
        reviewer_name ? String(reviewer_name).trim() : "Anonymous"
      ]
    );
    console.log(`[Review] Successfully saved: review_id=${result.rows[0].review_id}`);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Post review error:", err);
    return res.status(500).json({ message: "Error saving review" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { items, shipping_address, payment_method, total_amount, email: bodyEmail } = req.body;
  const user_id = normalizeId('user', req.body.user_id || req.body.userId || req.body.uid);

  if (!user_id || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid order payload" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch contact info for addresses
    const contactRes = await client.query("SELECT * FROM contact WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1", [user_id]);
    
    // Ensure address table is updated/synced if contact info is available
    if (contactRes.rows.length > 0) {
      const contact = contactRes.rows[0];
      await client.query(`
        INSERT INTO address (customer_id, street, city, pincode, address_type, created_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        ON CONFLICT DO NOTHING
      `, [user_id, contact.street, contact.city, contact.pincode, 'Billing']);
    }

    let firstOrderId = null;

    for (const item of items) {
      const pid = normalizeId('product', item.id || item.product_id || item._id);
      
      // Fetch seller info and product details for commission
      let pInfo = await client.query("SELECT seller_id, price FROM admin_products WHERE id = $1", [pid]);
      if (pInfo.rows.length === 0) {
        pInfo = await client.query("SELECT seller_id, price FROM seller_products WHERE id = $1", [pid]);
      }
      const sId = pInfo.rows[0]?.seller_id;

      const name = item.product_name || item.name || "Unknown Product";
      const image = item.product_image || item.image || (item.images ? item.images[0] : "");
      const qty = parseInt(item.quantity || 1, 10);

      let numericPrice = 0;
      if (typeof item.price === "number") {
        numericPrice = item.price;
      } else if (typeof item.price === "string") {
        numericPrice = parseFloat(item.price.replace(/[₹,$\s]/g, ""));
      }
      if (isNaN(numericPrice)) numericPrice = 0;

      let numericTotal = 0;
      if (typeof total_amount === "number") {
        numericTotal = total_amount;
      } else if (typeof total_amount === "string") {
        numericTotal = parseFloat(total_amount.replace(/[₹,$\s]/g, ""));
      }

      const orderResult = await client.query(
        `INSERT INTO orders 
        (user_id, product_id, product_name, product_image, price, quantity, total_amount, shipping_address, payment_method, seller_id) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
        [
          user_id || null,
          pid || null,
          name || null,
          image || null,
          numericPrice || 0,
          qty || 1,
          numericTotal || null,
          shipping_address || null,
          payment_method || null,
          sId || null,
        ],
      );

      const orderId = orderResult.rows[0].id;
      if (!firstOrderId) firstOrderId = orderId;

      const pPrice = pInfo.rows[0]?.price || numericPrice;

      // Log Order Creation to Audit
      await logAudit(client, user_id, 'orders', orderId, 'CREATE_ORDER', null, { product_id: pid, quantity: qty, total: (numericPrice || 0) * (qty || 1) });

      // Manual finance transaction removed - handled by trigger


      // Initialize Order Status History
      const nextHstId = await generateNextId(client, 'order_status_history', 'history_id', 'HST');
      await client.query(
        `INSERT INTO order_status_history (history_id, order_id, status, changed_by, changed_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [nextHstId, orderId, 'placed', user_id]
      );

      // Create Delivery Record
      await client.query(
        `INSERT INTO deliveries 
         (order_id, seller_id, shipping_address_snapshot, shipping_status, created_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [
          orderId, 
          parseInt(String(sId || '0').replace(/\D/g, '') || '0', 10), 
          shipping_address, 
          'Pending'
        ]
      );
      // Also record payment for this item (Legacy payments table)
      await client.query(
        `INSERT INTO payments 
        (order_id, customer_id, payment_method, amount, payment_status) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
          orderId || null,
          user_id || null,
          payment_method || null,
          (numericPrice || 0) * (qty || 1),
          'Success'
        ]
      );
      // Create Commission Record
      try {
        const commId = await generateNextId(client, 'seller_commissions', 'commission_id', 'COM');
        const commissionRate = 10.00; // 10% default
        let saleAmount = (numericPrice || 0) * (qty || 1);
        if (isNaN(saleAmount)) saleAmount = 0;
        
        let commissionAmount = parseFloat((saleAmount * (commissionRate / 100)).toFixed(2));
        if (isNaN(commissionAmount)) commissionAmount = 0;
        
        let sellerEarnings = parseFloat((saleAmount - commissionAmount).toFixed(2));
        if (isNaN(sellerEarnings)) sellerEarnings = 0;

        await client.query(
          `INSERT INTO seller_commissions 
           (commission_id, order_item_id, seller_id, order_id, sale_amount, commission_rate, commission_amount, seller_earnings, status, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
          [
            commId,
            String(orderId),
            String(sId || '0'),
            String(orderId),
            saleAmount,
            commissionRate,
            commissionAmount,
            sellerEarnings,
            'pending'
          ]
        );
      } catch (commErr) {
        console.error("Error storing commission:", commErr);
        logErrorToFile(commErr, "Storing commission for order item " + (orderId || 'unknown'));
        // We don't want to fail the whole order if commission recording fails, but we log it.
      }
    }

    await client.query("DELETE FROM cart WHERE user_id=$1", [user_id]);

    // Service Hook: Map & Calculate Checkout Dynamic Coupons Independently
    if (firstOrderId) {
      const { processOrderCoupons } = require('./coupon_service');
      await processOrderCoupons(client, items, total_amount, firstOrderId, user_id);
    }

    await client.query("COMMIT");

    // Async trigger order confirmation (Matched exactly to cart logic)
    const { sendOrderConfirmation } = require('./notification_service');
    const userRes = await pool.query("SELECT name, email FROM customers WHERE id = $1", [user_id]);
    let targetEmail = (userRes.rows.length > 0 && userRes.rows[0].email) ? userRes.rows[0].email : "";
    if (!targetEmail || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail))) {
      targetEmail = "agalyasrimurugan2000@gmail.com";
    }
    const targetName = (userRes.rows.length > 0 && userRes.rows[0].name) ? userRes.rows[0].name : "Customer";
    const customerPhone = req.body.phone || contactRes.rows[0]?.phone_number || "";

    const rawTotal = String(total_amount || 0).replace(/[₹,$\s]/g, "");
    const numericTotal = parseFloat(rawTotal);

    if (targetEmail) {
      console.log("Order Email Triggered");
      console.log("Sending Order Confirmation Email to:", targetEmail);
      try {
        await sendOrderConfirmation({
          orderNumber: `ORD-${firstOrderId}`,
          customerEmail: targetEmail,
          customerPhone: customerPhone,
          customerName: targetName,
          items: items,
          total: isNaN(numericTotal) ? 0 : numericTotal,
          shippingAddress: shipping_address
        });
      } catch (err) {
        console.error(`[Order Processing] NOTIFICATION FAILURE for ${targetEmail}:`, err.message);
      }
    }
    return res.json({ message: "Order placed successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /api/orders - SQL Error:", err);
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Missing status" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderCheck = await client.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    await client.query("UPDATE orders SET order_status = $1 WHERE id = $2", [status, id]);

    // Insert into status history
    const nextHstId = await generateNextId(client, 'order_status_history', 'history_id', 'HST');
    await client.query(
      "INSERT INTO order_status_history (history_id, order_id, status, changed_by, changed_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
      [nextHstId, id, status, req.body.admin_id || 'ADMIN']
    );

    // Audit log
    await logAudit(client, req.body.admin_id || 'ADMIN', 'orders', id, 'UPDATE_ORDER_STATUS', { old_status: orderCheck.rows[0].order_status }, { new_status: status });

    await client.query("COMMIT");
    res.json({ message: "Order status updated", status });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PUT /api/orders/:id/status error:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
});

// ================= UNIFIED CONTACT ENDPOINTS =================
app.get("/api/contact/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1",
      [req.params.userId],
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

app.put("/api/contact", async (req, res) => {
  const {
    user_id,
    full_name,
    phone_number,
    email,
    house_name,
    street,
    city,
    state,
    pincode,
    landmark,
    address_type,
    subject,
    message,
  } = req.body;

  if (!user_id) return res.status(400).json({ message: "Missing user_id" });

  try {
    const existing = await pool.query(
      "SELECT * FROM contact WHERE user_id=$1 ORDER BY id DESC LIMIT 1",
      [user_id],
    );

    if (existing.rows.length > 0) {
      const old = existing.rows[0];
      const result = await pool.query(
        `UPDATE contact SET 
            full_name=$1, phone_number=$2, email=$3, 
            house_name=$4, street=$5, city=$6, state=$7, pincode=$8, landmark=$9, address_type=$10,
            subject=$11, message=$12,
            updated_at=CURRENT_TIMESTAMP 
         WHERE id=$13 RETURNING *`,
        [
          (full_name || old.full_name) || null,
          (phone_number || old.phone_number) || null,
          (email || old.email) || null,
          (house_name || old.house_name) || null,
          (street || old.street) || null,
          (city || old.city) || null,
          (state || old.state) || null,
          (pincode || old.pincode) || null,
          (landmark || old.landmark) || null,
          (address_type || old.address_type) || null,
          (subject || old.subject) || null,
          (message || old.message) || null,
          old.id,
        ],
      );
      return res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        `INSERT INTO contact 
          (user_id, full_name, phone_number, email, house_name, street, city, state, pincode, landmark, address_type, subject, message) 
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [
          user_id || null,
          full_name || null,
          phone_number || null,
          email || null,
          house_name || null,
          street || null,
          city || null,
          state || null,
          pincode || null,
          landmark || null,
          address_type || null,
          subject || null,
          message || null,
        ],
      );
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

// ================= ADMIN & ANALYTICS =================
app.get("/api/admin/general-stats", async (req, res) => {
  try {
    const custRes = await pool.query("SELECT COUNT(*) FROM customers");
    const orderRes = await pool.query("SELECT COUNT(*) FROM orders");
    const productRes = await pool.query("SELECT COUNT(*) FROM seller_products");
    
    // Use orders table for real-time revenue instead of finance tables
    const revenueRes = await pool.query("SELECT SUM(total_amount) as total FROM orders");
    
    const activeRes = await pool.query("SELECT COUNT(*) FROM customers WHERE is_active = TRUE");

    // Shipping and Returns
    const shipRes = await pool.query("SELECT COUNT(*) FROM deliveries WHERE shipping_status = 'Pending' OR shipping_status = 'Shipped'");
    const returnRes = await pool.query("SELECT COUNT(*) FROM reviews WHERE is_approved = FALSE"); // Assuming pending reviews as proxy or if there's a returns table

    res.json({
      totalUsers: parseInt(custRes.rows[0].count),
      totalOrders: parseInt(orderRes.rows[0].count),
      totalProducts: parseInt(productRes.rows[0].count),
      totalRevenue: parseFloat(revenueRes.rows[0].total || 0),
      activeUsers: parseInt(activeRes.rows[0].count),
      totalShipping: parseInt(shipRes.rows[0].count),
      totalReturns: parseInt(returnRes.rows[0].count)
    });
  } catch (err) {
    console.error("GET /api/admin/general-stats error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET all orders for admin
app.get("/api/admin-all-orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, s.name as seller_name, c.name as customer_name, c.email as customer_email
      FROM orders o 
      LEFT JOIN sellers s ON o.seller_id = s.id 
      LEFT JOIN customers c ON o.user_id = c.id
      ORDER BY o.created_at DESC
    `);
    
    const mappedOrders = result.rows.map(o => ({
        ...o,
        user_name: o.customer_name
    }));
    
    res.json(mappedOrders);
  } catch (err) {
    console.error("GET /api/admin-all-orders error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET all deliveries for admin
app.get("/api/admin-all-deliveries", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM deliveries ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET all users for admin (Unified: Customers + Sellers + Admins)
app.get("/api/admin-all-users", async (req, res) => {
  try {
    const custRes = await pool.query("SELECT id, name, email, 'user' as role, created_at, is_active FROM customers");
    const sellerRes = await pool.query("SELECT id, name, email, 'seller' as role, created_at, is_active FROM sellers");
    const adminRes = await pool.query("SELECT id, name, email, 'admin' as role, created_at, is_active FROM admins");
    
    const allUsers = [
      ...custRes.rows.map(r => ({
        id: r.id, name: r.name, email: r.email, role: r.role,
        status: r.is_active ? 'active' : 'blocked',
        joinDate: r.created_at
      })),
      ...sellerRes.rows.map(r => ({
        id: r.id, name: r.name, email: r.email, role: r.role,
        status: r.is_active ? 'active' : 'blocked',
        joinDate: r.created_at
      })),
      ...adminRes.rows.map(r => ({
        id: r.id, name: r.name, email: r.email, role: r.role,
        status: r.is_active ? 'active' : 'blocked',
        joinDate: r.created_at
      }))
    ];
    res.json(allUsers);
  } catch (err) {
    console.error("GET /api/admin-all-users error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Toggle User/Seller Status
app.put("/api/admin/users/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body;
  const isActive = status === 'active';
  let table = 'customers';
  if (role === 'seller') table = 'sellers';
  else if (role === 'admin') table = 'admins';

  try {
    await pool.query(`UPDATE ${table} SET is_active = $1 WHERE id = $2`, [isActive, id]);
    res.json({ message: "User status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user status" });
  }
});

// Admin: Delete User/Seller
app.delete("/api/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.query;
  let table = 'customers';
  if (role === 'seller') table = 'sellers';
  else if (role === 'admin') table = 'admins';

  try {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Admin: Delete Order
app.delete("/api/admin/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM orders WHERE id = $1", [id]);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting order" });
  }
});
// GET all payments for admin
app.get("/api/admin-all-payments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as customer_name 
      FROM payments p 
      LEFT JOIN customers c ON p.customer_id = c.id 
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/admin-all-payments error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/analytics/revenue", async (req, res) => {
  const { period } = req.query; // 'weekly', 'monthly', 'annual'
  let query = "";
  
  if (period === 'weekly') {
    query = "SELECT week_number as label, SUM(total_revenue) as value FROM weekly_finances GROUP BY week_number ORDER BY week_number";
  } else if (period === 'monthly') {
    query = "SELECT month_number as label, SUM(total_revenue) as value FROM monthly_finances GROUP BY month_number ORDER BY month_number";
  } else if (period === 'quarterly') {
    query = "SELECT quarter_number as label, SUM(total_revenue) as value FROM quarterly_finances GROUP BY quarter_number ORDER BY quarter_number";
  } else {
    query = "SELECT year as label, SUM(total_revenue) as value FROM annual_finances GROUP BY year ORDER BY year";
  }

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/analytics/revenue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/seller/stats/:sellerId", async (req, res) => {
  const sellerId = normalizeId('seller', req.params.sellerId);
  try {
    const revenueRes = await pool.query("SELECT SUM(total_revenue) as total FROM annual_finances WHERE seller_id = $1", [sellerId]);
    const salesRes = await pool.query("SELECT COUNT(*) FROM orders WHERE seller_id = $1", [sellerId]);
    const productRes = await pool.query("SELECT COUNT(*) FROM seller_products WHERE seller_id = $1", [sellerId]);
    const lowStockRes = await pool.query("SELECT COUNT(*) FROM seller_products WHERE seller_id = $1 AND stock > 0 AND stock <= 10", [sellerId]);

    const revenue = revenueRes.rows[0]?.total || 0;
    const salesCount = salesRes.rows[0]?.count || 0;
    const productCount = productRes.rows[0]?.count || 0;
    const lowStockCount = lowStockRes.rows[0]?.count || 0;

    res.json({
      totalRevenue: parseFloat(revenue),
      totalSales: parseInt(salesCount),
      totalProducts: parseInt(productCount),
      lowStockCount: parseInt(lowStockCount)
    });
  } catch (err) {
    console.error("GET /api/seller/stats error:", err);
    logErrorToFile(err, "GET /api/seller/stats/" + sellerId);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/seller/analytics/:sellerId", async (req, res) => {
  const sellerId = normalizeId('seller', req.params.sellerId);
  const { period } = req.query;
  let query = "";
  
  if (period === 'weekly') {
    query = "SELECT week_number as label, total_revenue as value FROM weekly_finances WHERE seller_id = $1 ORDER BY week_number";
  } else if (period === 'monthly') {
    query = "SELECT month_number as label, total_revenue as value FROM monthly_finances WHERE seller_id = $1 ORDER BY month_number";
  } else if (period === 'quarterly') {
    query = "SELECT quarter_number as label, total_revenue as value FROM quarterly_finances WHERE seller_id = $1 ORDER BY quarter_number";
  } else {
    query = "SELECT year as label, total_revenue as value FROM annual_finances WHERE seller_id = $1 ORDER BY year";
  }

  try {
    const result = await pool.query(query, [sellerId]);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/seller/analytics error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/seller/reviews/:sellerId", async (req, res) => {
  const sellerId = normalizeId('seller', req.params.sellerId);
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as product_name
       FROM reviews r
       JOIN seller_products p ON r.product_id = p.id
       WHERE p.seller_id = $1
       ORDER BY r.created_at DESC`,
      [sellerId]
    );
    
    // Map database fields to the frontend expected format
    const mappedReviews = result.rows.map(r => ({
      id: r.review_id,
      customer: r.reviewer_name || "Anonymous",
      customerAvatar: (r.reviewer_name || "A")[0].toUpperCase(),
      product: r.product_name,
      productId: r.product_id,
      orderId: r.order_id,
      rating: r.rating,
      comment: r.body,
      date: new Date(r.created_at).toISOString().split('T')[0],
      helpful: 0,
      replied: false,
      replyText: "",
      verified: true
    }));
    
    res.json(mappedReviews);
  } catch (err) {
    console.error("GET /api/seller/reviews error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// End of review section (moved)


// ================= DEBUG =================
app.get("/api/debug/db-inspect", async (req, res) => {
  try {
    const sellers = await pool.query("SELECT id, name, created_at, is_active FROM seller_products ORDER BY created_at DESC LIMIT 5");
    const admins = await pool.query("SELECT id, name, created_at, is_active FROM admin_products ORDER BY created_at DESC LIMIT 5");
    res.json({
      timestamp: new Date().toISOString(),
      seller_products: sellers.rows,
      admin_products: admins.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.url}`,
  });
});

// ================= ERROR =================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Server error occurred",
    error: err.message,
  });
});

// ================= START =================
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
