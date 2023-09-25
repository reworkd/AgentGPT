import { agentRouter } from "./routers/agentRouter";
import { linkMetaRouter } from "./routers/linkMetaRouter";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  agent: agentRouter,
  linkMeta: linkMetaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
