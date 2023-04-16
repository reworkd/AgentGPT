import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../db";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const subscriptionRouter = createTRPCRouter({
  subscribe: protectedProcedure.input(z.any()).mutation(async ({ ctx }) => {
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: "http://localhost:3000",
      mode: "subscription",
      line_items: [
        {
          price: "price_1Mx1luBzaMdLmh5Ro5ZxHC9d",
          quantity: 1,
        },
      ],
      // automatic_tax: { enabled: true },
      metadata: {
        userId: ctx.session?.user?.id,
      },
    });

    await prisma.checkout.create({
      data: {
        id: checkoutSession.id,
        userId: ctx.session?.user?.id,
        createdAt: new Date(),
      },
    });

    return checkoutSession.url;
  }),
});
