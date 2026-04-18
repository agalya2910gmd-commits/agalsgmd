const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkCollisions() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT id FROM customers");
    const counts = {};
    const details = {};
    
    res.rows.forEach(r => {
      const num = parseInt(r.id.replace(/\D/g, ''), 10);
      if (isNaN(num)) return;
      
      const target = "CUS" + String(num).padStart(3, "0");
      counts[target] = (counts[target] || 0) + 1;
      if (!details[target]) details[target] = [];
      details[target].push(r.id);
    });

    const duplicates = Object.entries(counts).filter(e => e[1] > 1);
    if (duplicates.length > 0) {
      console.log("⚠️ Potential collisions found:");
      duplicates.forEach(([target, count]) => {
        console.log(`- ${target} would be created from: [${details[target].join(', ')}]`);
      });
    } else {
      console.log("✅ No collisions detected. All IDs map to unique CUSxxx values.");
    }

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkCollisions();
