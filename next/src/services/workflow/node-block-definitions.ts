import { z } from "zod";

export const NodeBlockDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  image_url: z.string(),
});

export type NodeBlockDefinition = z.infer<typeof NodeBlockDefinitionSchema>;

const UrlStatusCheckBlockDefinition: NodeBlockDefinition = {
  name: "URL Status Check",
  type: "UrlStatusCheck",
  description: "Check the status of a URL",
  image_url: "/tools/web.png",
};

const SlackWebhookBlockDefinition: NodeBlockDefinition = {
  name: "Slack Message Webhook",
  type: "SlackWebhook",
  description: "Sends a message to a slack webhook",
  image_url: "/tools/web.png",
};

export const getNodeBlockDefinitions = () => {
  return [UrlStatusCheckBlockDefinition, SlackWebhookBlockDefinition];
};
