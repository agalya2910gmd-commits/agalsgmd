const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function runSQL() {
  try {
    await pool.query("DROP TABLE IF EXISTS user_profile;");
    await pool.query("DROP TABLE IF EXISTS delivery_address;");
    await pool.query("DROP TABLE IF EXISTS contact;"); // Dropping the old layout so we can install the super-contact cleanly
    
    // Create the mandatory contact table structure natively so it definitely takes effect.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
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
    `);
    console.log("Successfully dropped user_profile and delivery_address and created mega-contact table.");
  } catch(e) {
    console.error("SQL Drop Error:", e);
  } finally {
    await pool.end();
  }
}
runSQL();

// Now patch server.js
let serverFile = fs.readFileSync('server.js', 'utf8');

// Strip out User Profile from initTables
serverFile = serverFile.replace(/\/\/ User Profile[\s\S]*?(?=\/\/ Delivery Address)/, '');
// Strip out Delivery Address from initTables
serverFile = serverFile.replace(/\/\/ Delivery Address[\s\S]*?(?=\/\/ Contact)/, '');

// Strip out existing Contact and replace with new schema
const newContactSchema = `
    // Contact Unified Table
    await client.query(\`
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
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
    \`);
`;

serverFile = serverFile.replace(/\/\/ Contact[\s\S]*?await client\.query\("COMMIT"\);/, newContactSchema + '\n    await client.query("COMMIT");');

// Strip out all profile, address, and old contact endpoints to replace securely.
// In patch.js, we injected endpoints right before // ================= 404 =================
// Let's replace everything from // ================= PROFILE ENDPOINTS ================= up to // ================= 404 =================
const unifiedEndpoints = `
// ================= UNIFIED CONTACT ENDPOINTS =================
app.get("/api/contact/:userId", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contact WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1", [req.params.userId]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

app.put("/api/contact", async (req, res) => {
  const { user_id, full_name, phone_number, email, house_name, street, city, state, pincode, landmark, address_type, subject, message } = req.body;
  
  if (!user_id) return res.status(400).json({message: "Missing user_id"});

  try {
    const existing = await pool.query("SELECT * FROM contact WHERE user_id=$1 ORDER BY id DESC LIMIT 1", [user_id]);
    
    if (existing.rows.length > 0) {
      const old = existing.rows[0];
      const result = await pool.query(
        \`UPDATE contact SET 
            full_name=$1, phone_number=$2, email=$3, 
            house_name=$4, street=$5, city=$6, state=$7, pincode=$8, landmark=$9, address_type=$10,
            subject=$11, message=$12,
            updated_at=CURRENT_TIMESTAMP 
         WHERE id=$13 RETURNING *\`,
        [
          full_name || old.full_name, phone_number || old.phone_number, email || old.email,
          house_name || old.house_name, street || old.street, city || old.city, state || old.state, pincode || old.pincode, landmark || old.landmark, address_type || old.address_type,
          subject || old.subject, message || old.message,
          old.id
        ]
      );
      return res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        \`INSERT INTO contact 
          (user_id, full_name, phone_number, email, house_name, street, city, state, pincode, landmark, address_type, subject, message) 
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *\`,
        [user_id, full_name, phone_number, email, house_name, street, city, state, pincode, landmark, address_type, subject, message]
      );
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

`;

serverFile = serverFile.replace(/\/\/ ================= PROFILE ENDPOINTS =================[\s\S]*?(?=\/\/ ================= 404 =================)/, unifiedEndpoints);

fs.writeFileSync('server.js', serverFile);
console.log("server.js completely refactored to Unified Contact Table Schema successfully.");
