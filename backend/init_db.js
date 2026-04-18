const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function initDB() {
  try {
    console.log("Initializing database...");

    // Create Sellers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("- Sellers table ready");

    // Create Customers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("- Customers table ready");

    // Create Admins Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("- Admins table ready");

    // Create Seller Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seller_products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image TEXT,
        seller_id INT REFERENCES sellers(id),
        category VARCHAR(100),
        subcategory VARCHAR(100),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Ensure image column is TEXT if it already exists as VARCHAR
    await pool.query("ALTER TABLE seller_products ALTER COLUMN image TYPE TEXT;");
    console.log("- Seller Products table ready (image column ensured as TEXT)");
    
    // Create Admin Products Table (Mirrors seller_products precisely include IDs)
    await pool.query(`
      DROP TABLE IF EXISTS admin_products;
      CREATE TABLE admin_products (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image TEXT,
        seller_id INT REFERENCES sellers(id),
        category VARCHAR(100),
        subcategory VARCHAR(100),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("- Admin Products table ready (Synced IDs, image as TEXT)");

    // Copy ALL products including IDs to ensure perfect sync
    await pool.query(`
      INSERT INTO admin_products (id, name, price, description, image, seller_id, category, subcategory, stock, created_at)
      SELECT id, name, price, description, image, seller_id, category, subcategory, stock, created_at FROM seller_products
      ON CONFLICT (id) DO NOTHING
    `);
    console.log("- Synced all existing seller products with matching IDs");

    // Optional: Add a default admin if it doesn't exist
    const adminEmail = "admin@example.com";
    const adminCheck = await pool.query("SELECT * FROM admins WHERE email = $1", [adminEmail]);
    if (adminCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)",
        ["Admin", adminEmail, "admin123"]
      );
      console.log("- Static Admin account created (email: admin@example.com, pass: admin123)");
    }

    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await pool.end();
  }
}

initDB();
