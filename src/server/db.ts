import { PrismaClient } from "@prisma/client";
import { ChromaClient } from "chromadb";

import { env } from "../env/server.mjs";

const global = globalThis as unknown as {
  prisma: PrismaClient;
  chroma: ChromaClient;
};

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export const chroma = global.chroma || new ChromaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.chroma = chroma;
}
