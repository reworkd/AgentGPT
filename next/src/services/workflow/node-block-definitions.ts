import type { IconType } from "react-icons";
import {
  FaCodeBranch,
  FaCopy,
  FaGlobeAmericas,
  FaPlay,
  FaRobot,
  FaSlack,
  FaTerminal,
} from "react-icons/fa";
import type { Node } from "reactflow";
import { z } from "zod";

import type { WorkflowNode } from "../../types/workflow";

const IOFieldSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["string", "array", "enum"]),
  items: z.object({ type: z.string() }).optional(),
  enum: z.array(z.string()).optional(),
});

export type IOField = z.infer<typeof IOFieldSchema>;

export const NodeBlockDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  image_url: z.string(),
  input_fields: z.array(IOFieldSchema),
  output_fields: z.array(IOFieldSchema),
  icon: z.custom<IconType>(),
});

export type NodeBlockDefinition = z.infer<typeof NodeBlockDefinitionSchema>;

const UrlStatusCheckBlockDefinition: NodeBlockDefinition = {
  name: "URL Status Check",
  type: "UrlStatusCheck",
  description: "Check if a website exists",
  image_url: "/tools/web.png",
  icon: FaGlobeAmericas,
  input_fields: [
    {
      name: "url",
      description: "The URL to check",
      type: "string",
    },
  ],
  output_fields: [
    {
      name: "url",
      description: "The URL to check",
      type: "string",
    },
    {
      name: "code",
      description: "The HTTP status code",
      type: "string",
    },
  ],
};

const SlackWebhookBlockDefinition: NodeBlockDefinition = {
  name: "Slack Message Webhook",
  type: "SlackWebhook",
  description: "Sends a message to a slack webhook",
  image_url: "/tools/web.png",
  icon: FaSlack,
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
  output_fields: [
    {
      name: "message",
      description: "The message that was sent",
      type: "string",
    },
  ],
};

const SummaryWebhookBlockDefinition: NodeBlockDefinition = {
  name: "Summary Agent",
  type: "SummaryWebhook",
  description: "Summarize or extract key details from text using OpenAI",
  image_url: "/tools/web.png",
  icon: FaCopy,
  input_fields: [
    {
      name: "prompt",
      description: "What do you want to do with the text?",
      type: "string",
    },
    {
      name: "filename1",
      description: "reference a file that you want to summarize",
      type: "string",
    },
    {
      name: "filename2",
      description: "reference a file that you want to summarize",
      type: "string",
    },
  ],
  output_fields: [
    {
      name: "result",
      description: "The result was built.",
      type: "string",
    },
  ],
};

const TextInputWebhookBlockDefinition: NodeBlockDefinition = {
  name: "Text Input",
  type: "TextInputWebhook",
  description: "",
  image_url: "/tools/web.png",
  icon: FaTerminal,
  input_fields: [
    {
      name: "text",
      description: "What text would you like to extract information from?",
      type: "string",
    },
  ],
  output_fields: [
    {
      name: "result",
      description: "The result was built.",
      type: "string",
    },
  ],
};

const IfBlockDefinition: NodeBlockDefinition = {
  name: "If Condition",
  type: "IfCondition",
  description: "Conditionally take a path",
  image_url: "/tools/web.png",
  icon: FaCodeBranch,
  input_fields: [
    {
      name: "value_one",
      type: "string",
    },
    {
      name: "operator",
      description: "The type of equality to check for",
      type: "string",
      enum: ["==", "!="],
    },
    {
      name: "value_two",
      type: "string",
    },
  ],
  output_fields: [
    {
      name: "result",
      description: "The result of the condition",
      type: "string",
    },
  ],
};

const ManualTriggerBlockDefinition: NodeBlockDefinition = {
  name: "Manual Trigger",
  type: "ManualTriggerBlock",
  description: "Trigger a block manually",
  icon: FaPlay,
  image_url: "/tools/web.png",
  input_fields: [],
  output_fields: [],
};

const WebInteractionAgent: NodeBlockDefinition = {
  name: "Web Interaction Agent",
  type: "WebInteractionAgent",
  description: "Dynamically interact with a website",
  image_url: "/tools/web.png",
  icon: FaRobot,
  input_fields: [
    {
      name: "url",
      description: "The website the agent will interact with",
      type: "string",
    },
    {
      name: "goals",
      description: "The actions the agent should take on the site",
      type: "string",
    },
  ],
  output_fields: [],
};

export const getNodeBlockDefinitions = (): NodeBlockDefinition[] => {
  return [
    UrlStatusCheckBlockDefinition,
    SlackWebhookBlockDefinition,
    IfBlockDefinition,
    WebInteractionAgent,
    ManualTriggerBlockDefinition,
    SummaryWebhookBlockDefinition,
    TextInputWebhookBlockDefinition,
  ];
};

export const getNodeBlockDefinitionFromNode = (node: Node<WorkflowNode>) => {
  return getNodeBlockDefinitions().find((d) => d.type === node.data.block.type);
};
