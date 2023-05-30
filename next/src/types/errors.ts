import { z } from "zod";

const platformErrorSchema = z.object({
  error: z.enum(["OpenAIError"]),
  detail: z.string(),
  code: z.number().optional(),
});

export type PlatformError = z.infer<typeof platformErrorSchema>;

export const isPlatformError = (e: object): e is PlatformError => {
  return platformErrorSchema.safeParse(e).success;
};
