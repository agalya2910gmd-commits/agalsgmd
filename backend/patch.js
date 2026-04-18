const fs = require('fs');

let serverFile = fs.readFileSync('server.js', 'utf8');

// 1. Inject schema exactly where "await client.query("COMMIT");" sits inside initTables
const schemaToInject = `
    // User Profile
    await client.query(\`
      CREATE TABLE IF NOT EXISTS user_profile (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        full_name VARCHAR,
        phone_number VARCHAR,
        email VARCHAR,
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);

    // Delivery Address
    await client.query(\`
      CREATE TABLE IF NOT EXISTS delivery_address (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        full_name VARCHAR,
        phone_number VARCHAR,
        house_name VARCHAR,
        street VARCHAR,
        city VARCHAR,
        state VARCHAR,
        pincode VARCHAR,
        landmark VARCHAR,
        address_type VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);

    // Contact
    await client.query(\`
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR,
        email VARCHAR,
        phone_number VARCHAR,
        subject VARCHAR,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);

    await client.query("COMMIT");
`;
serverFile = serverFile.replace('await client.query("COMMIT");', schemaToInject);

// 2. Inject endpoints before the 404 handler
const endpointsToInject = `
// ================= PROFILE ENDPOINTS =================
app.get("/api/profile/:userId", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user_profile WHERE user_id=$1", [req.params.userId]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

app.put("/api/profile", async (req, res) => {
  const { user_id, full_name, phone_number, email, profile_image } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM user_profile WHERE user_id=$1", [user_id]);
    if (existing.rows.length > 0) {
      const result = await pool.query(
        "UPDATE user_profile SET full_name=$1, phone_number=$2, email=$3, profile_image=$4, updated_at=CURRENT_TIMESTAMP WHERE user_id=$5 RETURNING *",
        [full_name, phone_number, email, profile_image, user_id]
      );
      return res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        "INSERT INTO user_profile (user_id, full_name, phone_number, email, profile_image) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [user_id, full_name, phone_number, email, profile_image]
      );
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

// ================= DELIVERY SETTINGS ENDPOINTS =================
app.get("/api/address/:userId", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM delivery_address WHERE user_id=$1 ORDER BY updated_at DESC", [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

app.post("/api/address", async (req, res) => {
  const { user_id, full_name, phone_number, house_name, street, city, state, pincode, landmark, address_type } = req.body;
  try {
    // Upsert or insert, since UI only edits one block we store historically as multiple, but checkout maps current
    const result = await pool.query(
      "INSERT INTO delivery_address (user_id, full_name, phone_number, house_name, street, city, state, pincode, landmark, address_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [user_id, full_name, phone_number, house_name, street, city, state, pincode, landmark, address_type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

// ================= CONTACT ENDPOINT =================
app.post("/api/contact", async (req, res) => {
  const { user_id, name, email, phone_number, subject, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO contact (user_id, name, email, phone_number, subject, message) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [user_id, name, email, phone_number, subject, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

// ================= 404 =================
`;
serverFile = serverFile.replace('// ================= 404 =================', endpointsToInject);

fs.writeFileSync('server.js', serverFile);
console.log("Patched server.js securely");
