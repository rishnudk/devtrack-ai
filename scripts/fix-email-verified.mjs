import pg from "pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local properly using dotenv
config({ path: resolve(process.cwd(), ".env.local") });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log("Fixing email_verified column type...");
  await pool.query(`ALTER TABLE users DROP COLUMN IF EXISTS email_verified;`);
  await pool.query(`ALTER TABLE users ADD COLUMN email_verified boolean NOT NULL DEFAULT false;`);
  console.log("✓ Done! email_verified is now a boolean column.");
} catch (err) {
  console.error("Error:", err.message);
} finally {
  await pool.end();
}
