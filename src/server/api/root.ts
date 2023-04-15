import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { chainRouter } from "./routers/chain";
import { agentRouter } from "./routers/agentRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  chain: chainRouter,
  agent: agentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
