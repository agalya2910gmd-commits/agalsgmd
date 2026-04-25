const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

async function run() {
  try {
    console.log("Starting backfill...");
    
    // Backfill bank_account
    const bankRes = await pool.query(`
      INSERT INTO bank_account (bank_account_id, owner_id, owner_type, account_number, ifsc_code, is_primary)
      SELECT 'BNK-' || id, id, 'seller', bank_account, ifsc_code, true
      FROM sellers 
      WHERE bank_account IS NOT NULL
      ON CONFLICT DO NOTHING
    `);
    console.log(`Bank accounts backfilled: ${bankRes.rowCount}`);

    // Create a dummy session for the current admin if exists
    const adminRes = await pool.query("SELECT id FROM admins LIMIT 1");
    if (adminRes.rows.length > 0) {
      const adminId = adminRes.rows[0].id;
      const sessionId = "SESS-INIT-" + Date.now();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await pool.query(`
        INSERT INTO auth_sessions (session_id, user_type, user_ref_id, expires_at)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [sessionId, 'admin', adminId, expiresAt]);
      console.log("Initial admin session created.");
    }

    console.log("Backfill complete.");
  } catch (err) {
    console.error("Backfill error:", err);
  } finally {
    await pool.end();
  }
}

run();
