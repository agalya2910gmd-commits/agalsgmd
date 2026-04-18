const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Creating daily_finances table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_finances (
        daily_finance_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        date DATE,
        weekly_finance_id VARCHAR(255),
        monthly_finance_id VARCHAR(255),
        total_revenue DECIMAL(10, 2),
        platform_commission DECIMAL(10, 2),
        net_seller_earnings DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating weekly_finances table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS weekly_finances (
        weekly_finance_id VARCHAR(255) PRIMARY KEY,
        daily_finance_id VARCHAR(255),
        seller_id VARCHAR(255),
        week_number INT,
        year INT,
        total_revenue DECIMAL(10, 2),
        platform_commission DECIMAL(10, 2),
        net_seller_earnings DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating monthly_finances table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS monthly_finances (
        monthly_finance_id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255),
        month_number INT,
        year INT,
        quarterly_finance_id VARCHAR(255),
        total_revenue DECIMAL(10, 2),
        platform_commission DECIMAL(10, 2),
        net_seller_earnings DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating quarterly_finances table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS quarterly_finances (
        quarterly_finance_id VARCHAR(255) PRIMARY KEY,
        monthly_finance_id VARCHAR(255),
        seller_id VARCHAR(255),
        quarter_number INT,
        year INT,
        half_yearly_finance_id VARCHAR(255),
        total_revenue DECIMAL(10, 2),
        platform_commission DECIMAL(10, 2),
        net_seller_earnings DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating annual_finances table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS annual_finances (
        annual_finance_id VARCHAR(255) PRIMARY KEY,
        half_yearly_finance_id VARCHAR(255),
        seller_id VARCHAR(255),
        year INT,
        total_revenue DECIMAL(10, 2),
        platform_commission DECIMAL(10, 2),
        net_seller_earnings DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("All tables successfully created!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating tables:", error);
  } finally {
    client.release();
    pool.end();
  }
}

createTables();
