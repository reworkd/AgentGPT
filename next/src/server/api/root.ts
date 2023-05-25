import { createTRPCRouter } from "./trpc";
import { agentRouter } from "./routers/agentRouter";
import { toolsRouter } from "./routers/toolsRouter";

export const appRouter = createTRPCRouter({
  agent: agentRouter,
  tools: toolsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
