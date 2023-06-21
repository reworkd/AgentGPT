import { z } from "zod";
import { taskSchema } from "./task";

/* Message & Task Type */
export const [MESSAGE_TYPE_GOAL, MESSAGE_TYPE_ACTION, MESSAGE_TYPE_SYSTEM, MESSAGE_TYPE_ERROR] = [
  "goal" as const,
  "action" as const,
  "system" as const,
  "error" as const,
];

const messageSchemaBase = z.object({
  id: z.string().optional(),
  value: z.string(),
  info: z.string().optional().nullable(),
});

export const nonTaskScehma = z
  .object({
    type: z.union([
      z.literal(MESSAGE_TYPE_GOAL),
      z.literal(MESSAGE_TYPE_ACTION),
      z.literal(MESSAGE_TYPE_SYSTEM),
      z.literal(MESSAGE_TYPE_ERROR),
    ]),
  })
  .merge(messageSchemaBase);

export const messageSchema = z.union([taskSchema, nonTaskScehma]);

export type Message = z.infer<typeof messageSchema>;

/*
 * Ideal message type
 * {
 *  icon: IconType,
 *  title: string,
 *  subtitle: string, // Optional
 *  value: string, // Markdown formatted value
 *  color: string, // Classname used for the border
 * }
 */
