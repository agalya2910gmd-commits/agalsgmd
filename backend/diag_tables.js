const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkTables() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables found:", res.rows.map(r => r.table_name));
    
    // Check columns for otp_verifications specifically
    if (res.rows.some(r => r.table_name === 'otp_verifications')) {
        const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'otp_verifications'");
        console.log("otp_verifications columns:", cols.rows.map(r => r.column_name));
    }
    
    if (res.rows.some(r => r.table_name === 'notifications')) {
        const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'notifications'");
        console.log("notifications columns:", cols.rows.map(r => r.column_name));
    }

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTables();
