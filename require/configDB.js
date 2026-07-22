import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export async function connectToDB() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected.");
  } catch (error) {
    throw new Error("Failed to initialize database connection.", {
      cause: error,
    });
  }
}

export default pool;
