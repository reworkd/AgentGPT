import { z } from "zod";

export const [
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_THINKING,
  MESSAGE_TYPE_TASK,
  MESSAGE_TYPE_ACTION,
  MESSAGE_TYPE_SYSTEM,
] = [
  "goal" as const,
  "thinking" as const,
  "task" as const,
  "action" as const,
  "system" as const,
];

export const [
  TASK_STATUS_STARTED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
] = ["started" as const, "executing" as const, "completed" as const];

const TaskStatusSchema = z.union([
  z.literal(TASK_STATUS_STARTED),
  z.literal(TASK_STATUS_EXECUTING),
  z.literal(TASK_STATUS_COMPLETED),
  z.literal(""),
]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const messageSchemaBase = z.object({
  id: z.string().optional(),
  value: z.string(),
});

export const taskSchema = z
  .object({
    type: z.literal(MESSAGE_TYPE_TASK),
    status: TaskStatusSchema,
  })
  .merge(messageSchemaBase);

export const nonTaskScehma = z
  .object({
    type: z.union([
      z.literal(MESSAGE_TYPE_GOAL),
      z.literal(MESSAGE_TYPE_THINKING),
      z.literal(MESSAGE_TYPE_TASK),
      z.literal(MESSAGE_TYPE_ACTION),
      z.literal(MESSAGE_TYPE_SYSTEM),
    ]),
    info: z.string().optional(),
  })
  .merge(messageSchemaBase);

export const messageSchema = z.union([taskSchema, nonTaskScehma]);

export type Task = z.infer<typeof taskSchema>;
export type Message = z.infer<typeof messageSchema>;

/* Type Predicates */
export const isTask = (value: unknown): value is Task => {
  try {
    taskSchema.parse(value);
    return true;
  } catch (err) {
    return false;
  }
};
