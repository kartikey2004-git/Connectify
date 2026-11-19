import { PrismaClient } from "./generated/prisma/client";

// Reuse one client across Next.js dev hot-reloads; a new client per reload would
// exhaust the database's connection limit.
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
