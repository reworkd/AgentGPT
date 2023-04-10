import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { startGoalAgent } from "../../../utils/chain";

export const chainRouter = createTRPCRouter({
  startAgent: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      // const completion = (await startGoalAgent(input.prompt)) as {
      //   text: string;
      // };
      //
      // return { tasks: JSON.parse(completion.text) as string[] };
    }),
});
