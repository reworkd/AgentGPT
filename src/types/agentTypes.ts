import { z } from "zod";

/* Message & Task Type */
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
  TASK_STATUS_FINAL,
] = [
  "started" as const,
  "executing" as const,
  "completed" as const,
  "final" as const,
];

const TaskStatusSchema = z.union([
  z.literal(TASK_STATUS_STARTED),
  z.literal(TASK_STATUS_EXECUTING),
  z.literal(TASK_STATUS_COMPLETED),
  z.literal(TASK_STATUS_FINAL),
  z.literal(""),
]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const messageSchemaBase = z.object({
  value: z.string(),
  info: z.string().optional().nullable(),
});

export const taskSchema = z
  .object({
    taskId: z.string().optional(),
    type: z.literal(MESSAGE_TYPE_TASK),
    status: TaskStatusSchema,
  })
  .merge(messageSchemaBase);

export const nonTaskScehma = z
  .object({
    type: z.union([
      z.literal(MESSAGE_TYPE_GOAL),
      z.literal(MESSAGE_TYPE_THINKING),
      z.literal(MESSAGE_TYPE_ACTION),
      z.literal(MESSAGE_TYPE_SYSTEM),
    ]),
  })
  .merge(messageSchemaBase);

export const messageSchema = z.union([taskSchema, nonTaskScehma]);

export type Task = z.infer<typeof taskSchema>;
export type Message = z.infer<typeof messageSchema>;

/* Agent Type */
// Agent Mode
export const [AUTOMATIC_MODE, PAUSE_MODE] = [
  "Automatic Mode" as const,
  "Pause Mode" as const,
];
export type AgentMode = typeof AUTOMATIC_MODE | typeof PAUSE_MODE;

// Agent Playback Control
export const [AGENT_PLAY, AGENT_PAUSE] = ["Play" as const, "Pause" as const];
export type AgentPlaybackControl = typeof AGENT_PLAY | typeof AGENT_PAUSE;

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
export const getTaskStatus = (value: unknown): string | undefined => {
  if (!isTask(value)) {
    return;
  }

  return value.status;
};

export const isAction = (value: unknown): boolean => {
  return isTask(value) && value.status === TASK_STATUS_COMPLETED;
};
