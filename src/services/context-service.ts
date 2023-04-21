import { OpenAIEmbeddingFunction } from "chromadb";
import { env } from "../env/server.mjs";
import { chroma } from "../server/db";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from "uuid";

interface ContextProps {
  id: string;
  task: string;
  result?: string;
}

interface ContextResult {
  ids: string[];
  embeddings: number[][] | undefined;
  documents: string[];
  metadatas: object[];
  distances: number[];
}

const embeddingFunction = new OpenAIEmbeddingFunction(env.OPENAI_API_KEY)
  .generate as CallableFunction;

const formatContext = (ctx: ContextProps) => {
  return `Task: ${ctx.task}${ctx.result ? "\nResult: ${ctx.result}" : ""}`;
};

export const getContext = async (ctx: ContextProps) => {
  const collection = await chroma.getCollection("test", embeddingFunction);
  const vector = await embeddingFunction([formatContext(ctx)]);
  const results = (await collection.query(vector, 5)) as ContextResult;

  return results.ids.map((id, i) => {
    return {
      id,
      document: results.documents[i],
      metadata: results.metadatas[i],
      distance: results.distances[i],
    };
  });
};

export const saveContext = async (ctx: ContextProps) => {
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([formatContext(ctx)]);

  const collection = await chroma.getCollection("test", embeddingFunction);
  await collection.add(
    docs.map(() => uuidv4()),
    undefined,
    undefined,
    // docs.map(() => {}),
    docs.map((doc) => doc.pageContent)
  );
};
