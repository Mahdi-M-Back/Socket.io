import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DB_URL: z.string().min(1, "DB_URL is required"),
  CORS_ORIGINS: z.string().min(1, "CORS_ORIGINS is required (comma-separated)"),
  JWT_SECRET_ACCESS: z.string().min(32, "JWT_SECRET_ACCESS must be at least 32 characters"),
  JWT_SECRET_ACCESS_EXPIRES_IN: z.string().min(1),
  JWT_SECRET_REFRESH: z.string().min(32, "JWT_SECRET_REFRESH must be at least 32 characters"),
  JWT_SECRET_REFRESH_EXPIRES_IN: z.string().min(1),
});

let env;
try {
  env = envSchema.parse(process.env);
} catch (err) {
  console.error("Invalid or missing environment variables:");
  console.error(err.issues ?? err);
  process.exit(1);
}

export default env;
