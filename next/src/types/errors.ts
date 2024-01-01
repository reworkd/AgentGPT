import axios from "axios";
import { z } from "zod";

export const MAX_LOOPS_ERROR = "MaxLoopsError";
const platformErrorSchema = z.object({
  error: z.string(),
  detail: z.string(),
  code: z.number().optional(),
});

export type PlatformError = z.infer<typeof platformErrorSchema>;

export const isPlatformError = (e: unknown): e is PlatformError => {
  return platformErrorSchema.safeParse(e).success;
};

export const isRetryableError = (e: unknown): boolean => {
  if (axios.isAxiosError(e)) {
    if (isPlatformError(e.response?.data)) {
      const error = e.response?.data.error;
      return error !== MAX_LOOPS_ERROR;
    }

    return e.response?.status !== 429;
  }
  return true;
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
