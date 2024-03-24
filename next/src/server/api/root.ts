import { agentRouter } from "./routers/agentRouter";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  agent: agentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
