const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function checkProducts() {
  try {
    const sellers = await pool.query("SELECT COUNT(*) FROM seller_products");
    const admins = await pool.query("SELECT COUNT(*) FROM admin_products");
    console.log(`Seller Products Count: ${sellers.rows[0].count}`);
    console.log(`Admin Products Count: ${admins.rows[0].count}`);
    
    console.log("\n--- Last 3 Admin Products ---");
    const lastAdmin = await pool.query("SELECT id, name, seller_id, category, subcategory, created_at FROM admin_products ORDER BY created_at DESC LIMIT 3");
    console.log(JSON.stringify(lastAdmin.rows, null, 2));

    console.log("\n--- Table Schemas ---");
    const schema = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('admin_products', 'seller_products')
      ORDER BY table_name, column_name
    `);
    
    const tables = {};
    schema.rows.forEach(r => {
      if (!tables[r.table_name]) tables[r.table_name] = [];
      tables[r.table_name].push(`${r.column_name} (${r.data_type})`);
    });
    console.log(JSON.stringify(tables, null, 2));

  } catch (err) {
    console.error("Query error:", err);
  } finally {
    await pool.end();
  }
}

checkProducts();
