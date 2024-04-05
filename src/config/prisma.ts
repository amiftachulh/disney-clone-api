import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "dev" ? ["query", "info", "warn"] : ["info", "warn"],
});

export default prisma;
