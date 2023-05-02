// @ts-check
import { z } from "zod";

const requiredForProduction = () =>
  process.env.NODE_ENV === "production"
    ? z.string().min(1).trim()
    : z.string().min(1).trim().optional();

const requiredAuthEnabledForProduction = () => {
  return process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_FF_AUTH_ENABLED === "true"
    ? z.string().min(1).trim()
    : z.string().min(1).trim().optional();
};

function stringToBoolean() {
  return z.preprocess((str) => str === "true", z.boolean());
}

function stringToNumber() {
  return z.preprocess((str) => Number(str), z.number());
}

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: requiredForProduction(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url()
  ),
  OPENAI_API_KEY: z.string(),

  GOOGLE_CLIENT_ID: requiredAuthEnabledForProduction(),
  GOOGLE_CLIENT_SECRET: requiredAuthEnabledForProduction(),
  GITHUB_CLIENT_ID: requiredAuthEnabledForProduction(),
  GITHUB_CLIENT_SECRET: requiredAuthEnabledForProduction(),
  DISCORD_CLIENT_ID: requiredAuthEnabledForProduction(),
  DISCORD_CLIENT_SECRET: requiredAuthEnabledForProduction(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_SUBSCRIPTION_PRICE_ID: z.string().optional(),

  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RATE_LIMITER_REQUESTS_PER_MINUTE: stringToNumber().optional()
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * middleware, so you have to do it manually here.
 * @type {{ [k in keyof z.input<typeof serverSchema>]: string | undefined }}
 */
export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_SUBSCRIPTION_PRICE_ID: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,

  // Rate limiter
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  RATE_LIMITER_REQUESTS_PER_MINUTE: process.env.RATE_LIMITER_REQUESTS_PER_MINUTE
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_VERCEL_ENV: z.enum(["production", "preview", "development"]),
  NEXT_PUBLIC_STRIPE_DONATION_ENABLED: z
    .string()
    .transform((str) => str === "true")
    .optional(),
  NEXT_PUBLIC_FF_AUTH_ENABLED: stringToBoolean(),
  NEXT_PUBLIC_WEB_SEARCH_ENABLED: stringToBoolean(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_FF_SUB_ENABLED: stringToBoolean(),
  NEXT_PUBLIC_FF_MOCK_MODE_ENABLED: stringToBoolean(),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional()
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.input<typeof clientSchema>]: string | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  NEXT_PUBLIC_STRIPE_DONATION_ENABLED:
  process.env.NEXT_PUBLIC_STRIPE_DONATION_ENABLED,
  NEXT_PUBLIC_FF_AUTH_ENABLED: process.env.NEXT_PUBLIC_FF_AUTH_ENABLED,
  NEXT_PUBLIC_WEB_SEARCH_ENABLED: process.env.NEXT_PUBLIC_WEB_SEARCH_ENABLED,
  NEXT_PUBLIC_VERCEL_URL:
    process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_FF_SUB_ENABLED: process.env.NEXT_PUBLIC_FF_SUB_ENABLED,
  NEXT_PUBLIC_FF_MOCK_MODE_ENABLED:
  process.env.NEXT_PUBLIC_FF_MOCK_MODE_ENABLED
};
