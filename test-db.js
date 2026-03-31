const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Testing database connection to:", process.env.DATABASE_URL?.split("@")[1]);
    const res = await pool.query("SELECT NOW()");
    console.log("Connection successful! Server time:", res.rows[0].now);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
