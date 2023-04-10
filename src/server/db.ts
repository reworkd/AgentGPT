import { PrismaClient } from "@prisma/client";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

import { env } from "../env/server.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const globalForChroma = globalThis as unknown as {
  chroma: ChromaClient;
  embeddingFunction: OpenAIEmbeddingFunction;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const chroma =
  globalForChroma.chroma || new ChromaClient(process.env.CHROMA_DATABASE_URL);

export const embeddingFunction =
  globalForChroma.embeddingFunction ||
  new OpenAIEmbeddingFunction(env.OPENAI_API_KEY);
