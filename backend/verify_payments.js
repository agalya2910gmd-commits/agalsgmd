const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function verifyTable() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'payments';
    `);
    
    if (res.rows.length > 0) {
      console.log("✅ Payments table found with following columns:");
      console.table(res.rows);
    } else {
      console.log("❌ Payments table not found.");
    }
  } catch (err) {
    console.error("Error verifying table:", err);
  } finally {
    await pool.end();
  }
}

verifyTable();
