import inquirer from "inquirer";
import dotenv from 'dotenv';
import { isValidSkKey, printTitle } from "./helpers.js";
import { doesEnvFileExist, generateEnv, testEnvFile } from "./envGenerator.js";

printTitle();

const questions = [
  {
    type: 'list',
    name: 'runOption',
    choices: ["docker-compose", "manually", "docker"],
    message: 'How will you be running AgentGPT',
    default: "docker-compose",
  },
  {
    type: "input",
    name: "OpenAIApiKey",
    message: "Enter your openai key (eg: sk...) or press enter to continue with no key:",
    validate: (apikey) => {
      if (isValidSkKey(apikey) || apikey === "") {
        return true;
      } else {
        return "\nInvalid api key. Please try again.";
      }
    },
  },
  {
    type: 'input',
    name: 'serpApiKey',
    message: 'What is your SERP API key (https://serper.dev/)? Leave empty to disable web search.',
  },
  {
    type: 'input',
    name: 'replicateApiKey',
    message: 'What is your Replicate API key (https://replicate.com/)? Leave empty to just use DALL-E for image generation.',
  },
];


if (doesEnvFileExist()) {
  console.log("Existing ./next/env file found. Validating...")
  testEnvFile()
} else {
  inquirer.prompt(questions).then((answers) => {
    dotenv.config({ path: './.env' });
    generateEnv(answers);
  });
}

