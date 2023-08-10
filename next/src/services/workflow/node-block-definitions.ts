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
  type: z.enum(["string", "array", "enum", "file", "oauth", "button"]),
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
  color: z.string().optional(),
});

export type NodeBlockDefinition = z.infer<typeof NodeBlockDefinitionSchema>;

const colorTypes = {
  trigger: "bg-purple-500",
  output: "bg-green-500",
  agent: "bg-blue-500",
};

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
  name: "Slack Message",
  type: "SlackWebhook",
  description: "Sends a message to a slack webhook",
  image_url: "/tools/web.png",
  icon: FaSlack,
  color: colorTypes.output,
  input_fields: [
    {
      name: "url",
      description: "The Slack WebHook URL",
      type: "oauth",
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
  color: colorTypes.agent,
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
  color: colorTypes.agent,
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
  description:
    "Summarize and extract key market insights for specific companies and industries from documents",
  image_url: "/tools/web.png",
  icon: FaCopy,
  color: colorTypes.agent,
  input_fields: [
    {
      name: "chat",
      description: "chat with your PDF",
      type: "button",
    },
    {
      name: "company_context",
      description: "short description on company, market, and their core products",
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

const UploadDocBlockDefinition: NodeBlockDefinition = {
  name: "Upload Doc",
  type: "UploadDoc",
  description: "Securely upload a .docx to Amazon S3",
  image_url: "/tools/web.png",
  icon: FaBook,
  input_fields: [
    {
      name: "text",
      description: "The text to upload",
      type: "string",
    },
  ],
  output_fields: [
    {
      name: "file_url",
      description: "The URL to access the doc",
      type: "string",
    },
  ],
};

const DiffDocBlockDefinition: NodeBlockDefinition = {
  name: "Diff Doc",
  type: "DiffDoc",
  description:
    "Create a document that will display the diff between an original and updated string",
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
      name: "file_url",
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
  color: colorTypes.trigger,
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
  color: colorTypes.trigger,
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
  color: colorTypes.agent,
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

const ContentRefresherAgent: NodeBlockDefinition = {
  name: "Content Refresher Agent",
  type: "ContentRefresherAgent",
  description: "Refresh the content on an existing page",
  image_url: "/tools/web.png",
  icon: FaRobot,
  color: colorTypes.agent,
  input_fields: [
    {
      name: "url",
      description: "The page whose content the agent will refresh",
      type: "string",
    },
    {
      name: "competitors",
      description: "List of comma-separated competitors you don't want to pull content from",
      type: "string",
    },
    {
      name: "keywords",
      description: "List of comma-separated keywords you'd like to pull content from. If you enter less than 3, we'll generate keywords for you.",
      type: "string",
    },
  ],
  output_fields: [
    {
      name: "original_report",
      description: "The original report to be refreshed",
      type: "string",
    },
    {
      name: "refreshed_report",
      description: "The refreshed report with new content added",
      type: "string",
    },
    {
      name: "refreshed_bullet_points",
      description: "Relevant new information not present in source report",
      type: "string",
    },
  ],
};

export const getNodeBlockDefinitions = (): NodeBlockDefinition[] => {
  return [
    ManualTriggerBlockDefinition,
    APITriggerBlockDefinition,
    SlackWebhookBlockDefinition,
    DiffDocBlockDefinition,
    UploadDocBlockDefinition,
    TextInputWebhookBlockDefinition,
    FileUploadBlockDefinition,
    IfBlockDefinition,
    UrlStatusCheckBlockDefinition,
    WebInteractionAgentBlockDefinition,
    ContentRefresherAgent,
    GenericLLMAgentBlockDefinition,
    SummaryAgentBlockDefinition,
    CompanyContextAgentBlockDefinition,
  ];
};

export const getNodeBlockDefinitionFromNode = (node: Node<WorkflowNode>) => {
  return getNodeBlockDefinitions().find((d) => d.type === node.data.block.type);
};
