import { z } from "zod";

export const MESSAGE_TYPE_TASK = "task";
const messageSchemaBase = z.object({
  id: z.string().optional(),
  value: z.string(),
  info: z.string().optional().nullable(),
});

export const [
  TASK_STATUS_STARTED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
] = ["started" as const, "executing" as const, "completed" as const, "final" as const];

export const TaskStatusSchema = z.union([
  z.literal(TASK_STATUS_STARTED),
  z.literal(TASK_STATUS_EXECUTING),
  z.literal(TASK_STATUS_COMPLETED),
  z.literal(TASK_STATUS_FINAL),
  z.literal(""),
]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const taskSchema = z
  .object({
    taskId: z.string().optional(),
    type: z.literal(MESSAGE_TYPE_TASK),
    status: TaskStatusSchema,
    result: z.string().optional(),
  })
  .merge(messageSchemaBase);

export type Task = z.infer<typeof taskSchema>;

/* Type Predicates */
export const isTask = (value: unknown): value is Task => {
  try {
    taskSchema.parse(value);
    return true;
  } catch (err) {
    return false;
  }
};

/* Helper Functions */
export const getTaskStatus = (value: unknown): TaskStatus | undefined => {
  if (!isTask(value)) {
    return;
  }

  return value.status;
};

export const isAction = (value: unknown): boolean => {
  return isTask(value) && value.status === TASK_STATUS_COMPLETED;
};
