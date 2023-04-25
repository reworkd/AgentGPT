import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { env } from "../env/server.mjs";

const redisRateLimiter = new Ratelimit({
  redis: new Redis({
    url: env.UPSTASH_REDIS_REST_URL ?? "",
    token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
  }),
  limiter: Ratelimit.slidingWindow(
    env.RATE_LIMITER_REQUESTS_PER_MINUTE ?? 100,
    "60 s"
  ),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const isAllowed = env.UPSTASH_REDIS_REST_TOKEN
  ? async (id: string) => (await redisRateLimiter.limit(id)).success
  : async (_: string) => Promise.resolve(true);
