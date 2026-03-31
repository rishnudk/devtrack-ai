import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("Connection successful!", result.rows);
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

testConnection();
