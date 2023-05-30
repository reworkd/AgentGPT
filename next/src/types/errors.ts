import { z } from "zod";

const platformErrorSchema = z.object({
  error: z.enum([
    "invalid_request",
    "invalid_api_key",
    "engine_not_found",
    "permission_denied",
    "server_error",
    "timeout",
    "too_many_requests",
  ]),
  detail: z.string(),
  code: z.number(),
});

export type PlatformError = z.infer<typeof platformErrorSchema>;

export const isPlatformError = (e: object): e is PlatformError => {
  return platformErrorSchema.safeParse(e).success;
};
