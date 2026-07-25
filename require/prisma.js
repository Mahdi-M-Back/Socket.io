import { PrismaClient } from "./../generated/prisma";
import logger from "./logger.js";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "production"
      ? [{ emit: "event", level: "error" }]
      : [
          { emit: "event", level: "error" },
          { emit: "event", level: "warn" },
        ],
});

prisma.$on("error", (e) => {
  logger.error({ prisma: e }, "Prisma client error");
});
prisma.$on("warn", (e) => {
  logger.warn({ prisma: e }, "Prisma client warning");
});

export async function connectToDB() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connected.");
  } catch (error) {
    throw new Error("Failed to initialize database connection.", {
      cause: error,
    });
  }
}

export default prisma;
