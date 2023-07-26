import type { IconType } from "react-icons";
import {
  FaBolt,
  FaBook,
  FaCodeBranch,
  FaCopy,
  FaFileUpload,
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
  type: z.enum(["string", "array", "enum", "file"]),
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

const CompanyContextAgentBlockDefinition: NodeBlockDefinition = {
  name: "Company Context Agent",
  type: "CompanyContextAgent",
  description: "Retrieve market, industry, and product summary of a specific company",
  image_url: "/tools/web.png",
  icon: FaCopy,
  input_fields: [
    {
      name: "company_name",
      description: "enter name of company",
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

const GenericLLMAgentBlockDefinition: NodeBlockDefinition = {
  name: "Generic LLM Agent",
  type: "GenericLLMAgent",
  description: "OpenAI agent",
  image_url: "/tools/web.png",
  icon: FaCopy,
  input_fields: [
    {
      name: "prompt",
      description: "Enter a prompt",
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

const SummaryAgentBlockDefinition: NodeBlockDefinition = {
  name: "Summary Agent",
  type: "SummaryAgent",
  description: "Summarize or extract key details from text using OpenAI",
  image_url: "/tools/web.png",
  icon: FaCopy,
  input_fields: [
    {
      name: "company_context",
      description: "reference a company's context so we can retrieve relevant info from docs",
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
      description: "Enter text",
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

const DiffPDFBlockDefinition: NodeBlockDefinition = {
  name: "Diff PDF",
  type: "DiffPDF",
  description: "Create a PDF that will display the diff between an original and updated string",
  image_url: "/tools/web.png",
  icon: FaBook,
  input_fields: [
    {
      name: "original",
      description: "The original version of the text",
      type: "string",
    },
    {
      name: "updated",
      description: "The updated version of the text",
      type: "string",
    },
  ],
  output_fields: [
    {
      name: "pdf_url",
      description: "The URL to access the diff PDF.",
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

const APITriggerBlockDefinition: NodeBlockDefinition = {
  name: "APITrigger",
  type: "APITriggerBlock",
  description: "Trigger a workflow through an API call.",
  icon: FaBolt,
  image_url: "/tools/web.png",
  input_fields: [],
  output_fields: [
    {
      name: "message",
      description: "Input string to the API call",
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

const WebInteractionAgentBlockDefinition: NodeBlockDefinition = {
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

const FileUploadBlockDefinition: NodeBlockDefinition = {
  name: "File Upload",
  type: "FileUploadBlock",
  description: "Upload a file",
  icon: FaFileUpload,
  image_url: "/tools/web.png",
  input_fields: [
    {
      name: "file",
      description: "The file to upload",
      type: "file",
    },
  ],
  output_fields: [],
};

export const getNodeBlockDefinitions = (): NodeBlockDefinition[] => {
  return [
    APITriggerBlockDefinition,
    UrlStatusCheckBlockDefinition,
    DiffPDFBlockDefinition,
    SlackWebhookBlockDefinition,
    IfBlockDefinition,
    WebInteractionAgentBlockDefinition,
    ManualTriggerBlockDefinition,
    SummaryAgentBlockDefinition,
    CompanyContextAgentBlockDefinition,
    TextInputWebhookBlockDefinition,
    FileUploadBlockDefinition,
    GenericLLMAgentBlockDefinition
  ];
};

export const getNodeBlockDefinitionFromNode = (node: Node<WorkflowNode>) => {
  return getNodeBlockDefinitions().find((d) => d.type === node.data.block.type);
};
