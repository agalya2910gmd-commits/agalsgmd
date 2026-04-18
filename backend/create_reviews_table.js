const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function createReviewsTable() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        review_id   SERIAL PRIMARY KEY,
        product_id  INTEGER NOT NULL,
        customer_id INTEGER,
        order_id    INTEGER,
        rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title       VARCHAR(255),
        body        TEXT,
        reviewer_name VARCHAR(255),
        is_approved BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query("COMMIT");
    console.log("✅ reviews table created successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating reviews table:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createReviewsTable();
