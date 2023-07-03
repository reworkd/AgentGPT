import { isValidKey } from "../helpers.js";
import { RUN_OPTION_QUESTION } from "./sharedQuestions.js";

export const newEnvQuestions = [
  RUN_OPTION_QUESTION,
  {
    type: "input",
    name: "OpenAIApiKey",
    message:
      "Enter your openai key (eg: sk...) or press enter to continue with no key:",
    validate: (apikey) => {
      return isValidKey(apikey, /^sk-[a-zA-Z0-9]{48}$/)
    },
  },
  {
    type: "input",
    name: "serpApiKey",
    message:
      "What is your SERP API key (https://serper.dev/)? Leave empty to disable web search.",
    validate: (apikey) => {
      return isValidKey(apikey, /^[a-zA-Z0-9]{40}$/)
    },
  },
  {
    type: "input",
    name: "replicateApiKey",
    message:
      "What is your Replicate API key (https://replicate.com/)? Leave empty to just use DALL-E for image generation.",
    validate: (apikey) => {
      return isValidKey(apikey, /^r8-[a-zA-Z0-9]{37}$/)
    },
  },
];
