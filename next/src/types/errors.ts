import { z } from "zod";

const platformErrorSchema = z.object({
  error: z.string(),
  detail: z.string(),
  code: z.number().optional(),
});

export type PlatformError = z.infer<typeof platformErrorSchema>;

export const isPlatformError = (e: object): e is PlatformError => {
  return platformErrorSchema.safeParse(e).success;
};

// Backend returns a value error when the user's input is invalid.
const valueErrorDetailSchema = z.object({
  loc: z.array(z.string()),
  msg: z.string(),
  type: z.string(),
});

const valueErrorSchema = z.object({
  detail: z.array(valueErrorDetailSchema),
});

export type ValueError = z.infer<typeof valueErrorSchema>;

export const isValueError = (e: object): e is ValueError => {
  return valueErrorSchema.safeParse(e).success;
};
