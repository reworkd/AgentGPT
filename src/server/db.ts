import { PrismaClient } from "@prisma/client";

import { env } from "../env/server.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.ENVIRONMENT === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.ENVIRONMENT !== "production") globalForPrisma.prisma = prisma;
