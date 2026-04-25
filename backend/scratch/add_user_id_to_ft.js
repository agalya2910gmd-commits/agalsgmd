const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'postgres', password: 'postgres123', port: 5432 });

async function migrate() {
    try {
        console.log("--- Adding user_id column to finance_transactions ---");
        await pool.query("ALTER TABLE finance_transactions ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)");
        console.log("Column added successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}
migrate();
