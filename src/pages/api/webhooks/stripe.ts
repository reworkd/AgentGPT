import { buffer } from "micro";
import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
});

const webhookSecret = env.STRIPE_WEBHOOK_SECRET ?? "";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

function success(res: NextApiResponse) {
  res.status(200).json({ received: true });
}

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"]!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

  if (!event.type.startsWith("customer.subscription")) {
    success(res);
    return;
  }

  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;
  const status = subscription.status;

  // Handle the event
  switch (event.type) {
    case "customer.subscription.trial_will_end":
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    case "customer.subscription.deleted":
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;
    case "customer.subscription.created":
      console.log(`Subscription status is ${status}.`);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const plan = subscription.plan as Stripe.Plan;

      await prisma.subscription.create({
        data: {
          id: subscription.id,
          userId: subscription.metadata.userId,
          planId: plan.id,
          status: subscription.status,
        },
      });
      break;
    case "customer.subscription.updated":
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break;
    default:
      // Unexpected event type
      console.warn(`Unhandled event type ${event.type}.`);
  }

  success(res);
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default cors(webhookHandler as any);
