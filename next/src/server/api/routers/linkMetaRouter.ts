import { z } from "zod";

import extractMetadata from "../../../utils/extractMetadata";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const linkMetaRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return await extractMetadata(input);
  }),
});
