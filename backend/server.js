const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// ================= FORCE JSON =================
app.use("/api", (req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  res.setHeader("Content-Type", "application/json");
  next();
});

// ================= DB =================
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
  max: 20, // Limit maximum connections to 20
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Fail if connection takes longer than 2 seconds
});

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
    await client.query("BEGIN");

    // Cart Table
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
      )
    `);

    // Wishlist Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image TEXT,
        price NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders Table
    await client.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact Unified Table
    await client.query(`
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
      )
    `);

    // Payments Table
    await client.query(`
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
      )
    `);

    // Reviews Table
    await client.query(`
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
      )
    `);

    // OTP Verifications Table
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
      )
    `);

    // Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id SERIAL PRIMARY KEY,
        customer_id VARCHAR(255),
        seller_id VARCHAR(255),
        order_id INTEGER,
        type VARCHAR(50),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Product Images Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        image_id SERIAL PRIMARY KEY,
        product_id VARCHAR(255),
        image_url TEXT,
        alt_text VARCHAR(255),
        is_primary BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        parent_category_id INTEGER,
        name VARCHAR(255),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Deliveries Table
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
      )
    `);

    // Shiprocket Table
    await client.query(`
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
      )
    `);

    // Seller Payouts Table
    await client.query(`
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
      )
    `);

    // Coupons Table
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
      )
    `);

    // Order Coupons Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_coupons (
        order_coupon_id SERIAL PRIMARY KEY,
        order_id INTEGER,
        coupon_id INTEGER,
        discount_amount NUMERIC(12, 2) NOT NULL
      )
    `);

    // Wishlist Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wishlist_items (
        wishlist_item_id SERIAL PRIMARY KEY,
        wishlist_id INTEGER,
        product_id VARCHAR(255),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query("COMMIT");

    // Ensure customers table has new fields
    await client.query(`
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS dob DATE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
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

    console.log(
      "✅ All tables ensured: customers (extended), cart, wishlist, orders, contact, payments, reviews",
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating tables:", err);
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

        return res.json({
          message: `${check.role} login successful`,
          user: {
            ...user,
            role: check.role,
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
    name, price, description, seller_id, category, subcategory, stock,
    parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
    weight, length, breadth, height, brand, image_url,
    variant_name, variant_value, is_variant, is_active
  } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || image_url);

  if (!name || !price || !seller_id) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Generate next PRDTxxx product ID
    const lastProd = await client.query(
      "SELECT id FROM seller_products WHERE id ~ '^PRDT[0-9]+$' ORDER BY length(id) DESC, id DESC LIMIT 1"
    );
    
    let nextProductId = "PRDT001";
    if (lastProd.rows.length > 0) {
      const lastId = lastProd.rows[0].id;
      const numPart = parseInt(lastId.replace(/\D/g, ''), 10);
      nextProductId = "PRDT" + String(numPart + 1).padStart(3, "0");
    } else {
      // Fallback for any legacy numeric IDs
      const lastEntry = await client.query("SELECT id FROM seller_products ORDER BY length(id) DESC, id DESC LIMIT 1");
      if (lastEntry.rows.length > 0) {
        const rawId = lastEntry.rows[0].id;
        const numPart = parseInt(String(rawId).replace(/\D/g, '') || "0", 10);
        nextProductId = "PRDT" + String(numPart + 1).padStart(3, "0");
      }
    }

    const sellerResult = await client.query(
      `INSERT INTO seller_products 
      (id, name, price, description, image, seller_id, category, subcategory, stock,
       parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
       weight, length, breadth, height, brand, image_url,
       variant_name, variant_value, is_variant, is_active) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING *`,
      [
        nextProductId,
        name,
        parseFloat(price),
        description,
        imagePath,
        seller_id,
        category,
        subcategory,
        parseInt(stock) || 0,
        parseInt(parent_product_id) || null,
        parseInt(category_id) || null,
        parseInt(review_id) || null,
        sku || null,
        parseFloat(mrp) || null,
        parseInt(stock_quantity) || (parseInt(stock) || 0),
        parseFloat(weight) || null,
        parseFloat(length) || null,
        parseFloat(breadth) || null,
        parseFloat(height) || null,
        brand || null,
        image_url || null,
        variant_name || null,
        variant_value || null,
        is_variant === 'true' || is_variant === true,
        is_active === 'false' || is_active === false ? false : true
      ],
    );

    const product = sellerResult.rows[0];

    await client.query(
      `INSERT INTO admin_products
      (id, name, price, description, image, seller_id, category, subcategory, stock,
       parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
       weight, length, breadth, height, brand, image_url,
       variant_name, variant_value, is_variant, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)`,
      [
        product.id,
        name,
        parseFloat(price),
        description,
        imagePath,
        seller_id,
        category,
        subcategory,
        parseInt(stock) || 0,
        parseInt(parent_product_id) || null,
        parseInt(category_id) || null,
        parseInt(review_id) || null,
        sku || null,
        parseFloat(mrp) || null,
        parseInt(stock_quantity) || (parseInt(stock) || 0),
        parseFloat(weight) || null,
        parseFloat(length) || null,
        parseFloat(breadth) || null,
        parseFloat(height) || null,
        brand || null,
        image_url || null,
        variant_name || null,
        variant_value || null,
        is_variant === 'true' || is_variant === true,
        is_active === 'false' || is_active === false ? false : true
      ],
    );

    await client.query("COMMIT");

    // After commit, ensure the primary image is in the product_images table if it's missing
    try {
      if (imagePath) {
        await pool.query(
          "INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
          [product.id, imagePath, true]
        );
      }
      
      // Also handle additional images if string provided in category/description as fallback or if added in frontend later
      if (req.body.additional_images && typeof req.body.additional_images === 'string') {
        const urls = req.body.additional_images.split(',').map(u => u.trim());
        for (const url of urls) {
          if (url && url !== imagePath) {
            await pool.query(
              "INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
              [product.id, url, false]
            );
          }
        }
      }
    } catch (imgErr) {
      console.error("Error storing additional images:", imgErr);
      // Don't fail the whole request because images are metadata
    }

    return res.json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Add product error:", error);
    return res.status(500).json({
      message: "Server error while adding product",
    });
  } finally {
    client.release();
  }
});

// ================= GET PRODUCTS =================
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM admin_products ORDER BY created_at DESC",
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Fetch products error:", error);
    return res.status(500).json({
      message: "Server error while fetching products",
    });
  }
});

// ================= UPDATE PRODUCT =================
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { 
    name, price, description, category, subcategory, stock,
    parent_product_id, category_id, review_id, sku, mrp, stock_quantity,
    weight, length, breadth, height, brand, image_url,
    variant_name, variant_value, is_variant, is_active
  } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || image_url);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const params = [
      name,
      parseFloat(price),
      description,
      category,
      subcategory,
      parseInt(stock) || 0,
      imagePath,
      parseInt(parent_product_id) || null,
      parseInt(category_id) || null,
      parseInt(review_id) || null,
      sku || null,
      parseFloat(mrp) || null,
      parseInt(stock_quantity) || (parseInt(stock) || 0),
      parseFloat(weight) || null,
      parseFloat(length) || null,
      parseFloat(breadth) || null,
      parseFloat(height) || null,
      brand || null,
      image_url || null,
      variant_name || null,
      variant_value || null,
      is_variant === 'true' || is_variant === true,
      is_active === 'false' || is_active === false ? false : true,
      id
    ];

    const result = await client.query(
      `UPDATE seller_products
       SET name=$1, price=$2, description=$3, category=$4,
           subcategory=$5, stock=$6, image=COALESCE($7,image),
           parent_product_id=$8, category_id=$9, review_id=$10,
           sku=$11, mrp=$12, stock_quantity=$13, weight=$14,
           length=$15, breadth=$16, height=$17, brand=$18,
           image_url=$19, variant_name=$20, variant_value=$21,
           is_variant=$22, is_active=$23, updated_at=CURRENT_TIMESTAMP
       WHERE id=$24 RETURNING *`,
      params,
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await client.query(
      `UPDATE admin_products
       SET name=$1, price=$2, description=$3, category=$4,
           subcategory=$5, stock=$6, image=COALESCE($7,image),
           parent_product_id=$8, category_id=$9, review_id=$10,
           sku=$11, mrp=$12, stock_quantity=$13, weight=$14,
           length=$15, breadth=$16, height=$17, brand=$18,
           image_url=$19, variant_name=$20, variant_value=$21,
           is_variant=$22, is_active=$23, updated_at=CURRENT_TIMESTAMP
       WHERE id=$24`,
      params,
    );

    await client.query("COMMIT");

    return res.json({
      message: "Product updated successfully",
      product: result.rows[0],
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
      
      sendCartNotification({
        customerEmail: targetEmail,
        customerName: targetName,
        productName: product_name || "Product",
        price: cleanPrice || 0,
        quantity: quantity || 1
      });
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
      
      sendCartNotification({
        customerEmail: targetEmail,
        customerName: targetName,
        productName: product_name || "Product",
        price: cleanPrice || 0,
        quantity: quantity || 1
      });
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
  const { user_id, items, shipping_address, payment_method, total_amount } =
    req.body;
  if (!user_id || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid order payload" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Fetch user info for notifications early to avoid released client issues
    const userRes = await client.query("SELECT name, email FROM customers WHERE id = $1", [user_id]);
    const contactRes = await client.query("SELECT phone_number FROM contact WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1", [user_id]);

    let firstOrderId = null;

    for (const item of items) {
      const pid = item.id || item.product_id || item._id;
      const name = item.product_name || item.name || "Unknown Product";
      const image =
        item.product_image || item.image || (item.images ? item.images[0] : "");
      const qty = parseInt(item.quantity || 1, 10);

      let numericPrice = 0;
      if (typeof item.price === "number") {
        numericPrice = item.price;
      } else if (typeof item.price === "string") {
        numericPrice = parseFloat(item.price.replace(/[₹,$\s]/g, ""));
      }

      let numericTotal = 0;
      if (typeof total_amount === "number") {
        numericTotal = total_amount;
      } else if (typeof total_amount === "string") {
        numericTotal = parseFloat(total_amount.replace(/[₹,$\s]/g, ""));
      }

      const orderResult = await client.query(
        `INSERT INTO orders 
        (user_id, product_id, product_name, product_image, price, quantity, total_amount, shipping_address, payment_method) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
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
        ],
      );
      
      if (!firstOrderId) firstOrderId = orderResult.rows[0].id;

      // Also record payment for this item
      await client.query(
        `INSERT INTO payments 
        (order_id, customer_id, payment_method, amount, payment_status) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
          orderResult.rows[0].id || null,
          user_id || null,
          payment_method || null,
          (numericPrice || 0) * (qty || 1),
          'Success'
        ]
      );
    }

    await client.query("DELETE FROM cart WHERE user_id=$1", [user_id]);

    // Service Hook: Map & Calculate Checkout Dynamic Coupons Independently
    if (firstOrderId) {
      const { processOrderCoupons } = require('./coupon_service');
      await processOrderCoupons(client, items, total_amount, firstOrderId, user_id);
    }

    await client.query("COMMIT");
    
    // Background Notification Task (Email & SMS) - Non-blocking
    const { sendOrderConfirmation } = require('./notification_service');
    
    // Process notification after successful commit
    const customerName = userRes.rows[0]?.name || "Customer";
    let customerEmail = req.body.email || userRes.rows[0]?.email;
    const customerPhone = req.body.phone || contactRes.rows[0]?.phone_number;

    // Force fallback if dummy profile has no valid email so the test system still triggers BCC delivery
    if (!customerEmail || typeof customerEmail !== 'string' || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))) {
      customerEmail = "agalyasrimurugan2000@gmail.com";
    }

    // 1 & 4) VALIDATION: Check email format and ensure it's not null/undefined
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerEmail && typeof customerEmail === 'string' && emailRegex.test(customerEmail)) {
      console.log(`[Order Processing] Valid email verified for order ORD-${firstOrderId}: ${customerEmail}`);
      
      // 3 & 5) EMAIL TRIGGER & ERROR HANDLING
      try {
        await sendOrderConfirmation({
          orderNumber: `ORD-${firstOrderId}`,
          customerEmail: customerEmail, // 2) PASS CORRECT EMAIL
          customerPhone,
          customerName,
          items,
          total: parseFloat(total_amount),
          shippingAddress: shipping_address
        });
        console.log(`[Order Processing] Order confirmation sent successfully to ${customerEmail}`);
      } catch (err) {
        console.error(`[Order Processing] ERROR sending order confirmation email to ${customerEmail}:`, err);
        // Do NOT break order flow if email fails
      }
    } else {
      console.log(`[Order Processing] Skipped sending confirmation email. Invalid or missing email address: ${customerEmail}`);
    }

    res.json({ message: "Order placed successfully" });
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

// End of review section (moved)

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
