import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "../../db";
import { messageSchema } from "../../../types/message";
import { MESSAGE_TYPE_TASK } from "../../../types/task";

const createAgentParser = z.object({
  name: z.string(),
  goal: z.string(),
});
export type CreateAgentProps = z.infer<typeof createAgentParser>;

const saveAgentParser = z.object({
  id: z.string(),
  tasks: z.array(messageSchema),
});
export type SaveAgentProps = z.infer<typeof saveAgentParser>;

export const agentRouter = createTRPCRouter({
  create: protectedProcedure.input(createAgentParser).mutation(async ({ input, ctx }) => {
    return await prisma.agent.create({
      data: {
        name: input.name,
        goal: input.goal,
        userId: ctx.session?.user?.id,
      },
    });
  }),
  save: protectedProcedure.input(saveAgentParser).mutation(async ({ input, ctx }) => {
    const agent = await prisma.agent.findFirst({
      where: {
        id: input.id,
        userId: ctx.session?.user?.id,
      },
    });

    if (!agent) throw new Error("Agent not found");

    const all = input.tasks.map((e, i) => {
      return prisma.agentTask.create({
        data: {
          agentId: agent.id,
          type: e.type,
          ...(e.type === MESSAGE_TYPE_TASK && { status: e.status }),
          info: e.info,
          value: e.value,
          sort: 0, // TODO: Remove sort
        },
      });
    });

    await Promise.all(all);
    return agent;
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return prisma.agent.findMany({
      where: {
        userId: ctx.session?.user?.id,
        deleteDate: null,
      },
      orderBy: { createDate: "desc" },
      take: 20,
    });
  }),
  findById: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return await prisma.agent.findFirstOrThrow({
      where: { id: input, deleteDate: null },
      include: {
        tasks: {
          orderBy: {
            createDate: "asc",
          },
        },
      },
    });
  }),
  deleteById: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    await prisma.agent.updateMany({
      where: { id: input, userId: ctx.session?.user?.id },
      data: {
        deleteDate: new Date(),
      },
    });
  }),
});
