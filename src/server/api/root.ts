import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { chainRouter } from "./routers/chain";
import { settingsRouter } from "./routers/settings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  chain: chainRouter,
  settings: settingsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
