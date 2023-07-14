import { z } from "zod";

const InputFieldSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["string"]),
});

export const NodeBlockDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  image_url: z.string(),
  input_fields: z.array(InputFieldSchema),
});

export type NodeBlockDefinition = z.infer<typeof NodeBlockDefinitionSchema>;

const UrlStatusCheckBlockDefinition: NodeBlockDefinition = {
  name: "URL Status Check",
  type: "UrlStatusCheck",
  description: "Check the status of a URL",
  image_url: "/tools/web.png",
  input_fields: [
    {
      name: "url",
      description: "The URL to check",
      type: "string",
    },
  ],
};

const SlackWebhookBlockDefinition: NodeBlockDefinition = {
  name: "Slack Message Webhook",
  type: "SlackWebhook",
  description: "Sends a message to a slack webhook",
  image_url: "/tools/web.png",
  input_fields: [
    {
      name: "url",
      description: "The Slack WebHook URL",
      type: "string",
    },
    {
      name: "message",
      description: "The message to send",
      type: "string",
    },
  ],
};

export const getNodeBlockDefinitions = () => {
  return [UrlStatusCheckBlockDefinition, SlackWebhookBlockDefinition];
};
