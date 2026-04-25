const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function inspect() {
  const client = await pool.connect();
  try {
    const tables = ['finance_transactions', 'weekly_finances', 'monthly_finances', 'annual_finances', 'orders'];
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`${table} count: ${res.rows[0].count}`);
    }
    
    console.log("\nSample Orders:");
    const orders = await client.query("SELECT id, total_amount, created_at, product_id FROM orders LIMIT 5");
    console.log(orders.rows);

    console.log("\nSample Weekly Finances:");
    const weekly = await client.query("SELECT * FROM weekly_finances LIMIT 5");
    console.log(weekly.rows);

    console.log("\nSample Admin Revenue API (simulated):");
    const adminRev = await client.query("SELECT month_number as label, SUM(total_revenue) as value FROM monthly_finances GROUP BY month_number ORDER BY month_number");
    console.log(adminRev.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}
inspect();
