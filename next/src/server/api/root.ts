import { createTRPCRouter } from "./trpc";
import { agentRouter } from "./routers/agentRouter";

export const appRouter = createTRPCRouter({
  agent: agentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
