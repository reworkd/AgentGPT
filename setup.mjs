// Import necessary libraries
import inquirer from "inquirer";
import fs, { existsSync, writeFileSync } from 'fs';
import { exec, execSync } from "child_process";
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';




console.log(
  "    ___                    __  __________ ______\n" +
    "   /   | ____ ____  ____  / /_/ ____/ __ /_  __/\n" +
    "  / /| |/ __ `/ _ \\/ __ \\/ __/ / __/ /_/ // /\n" +
    " / ___ / /_/ /  __/ / / / /_/ /_/ / ____// /\n" +
    "/_/  |_\\__, /\\___/_/ /_/\\__ /____/_/    /_/\n" +
    "      /____/                                  "
);




// Initialize dotenv and Prisma
dotenv.config({ path: './.env' });
const prisma = new PrismaClient();

// Promisify exec for async usage
const execAsync = promisify(exec);

// Set up __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to check if the environment has been setup and setup if not
async function setupEnvironment() {
  const setupFlagPath = path.join(__dirname, '.setup_complete');

  // Check if the setup flag file exists
  if (existsSync(setupFlagPath)) {
    console.log('Environment has already been setup. Skipping.');
    console.log();
    return;
  }

  console.log('setting up environment');

  // Install inquirer and dotenv
  await execAsync('npm init -y', { cwd: __dirname });
  await execAsync('npm install inquirer dotenv', { cwd: __dirname });
  console.log('done.');

  console.log('Welcome to AgentGPT! The following questions will help you set up your environment');

  // Write the setup flag file
  writeFileSync(setupFlagPath, 'Setup completed on ' + new Date().toISOString());
}

// Function to check if the application is running and start it if not
async function handleDockerCompose() {
  return new Promise(async (resolve, reject) => {
    let successfulRun = false;
    let retries = 0; // Add a counter for retries

    while (!successfulRun && retries < 5) { // Limit the retries to 5
      retries++;
      try {
        execSync("docker-compose up -d", { stdio: "inherit" });
        successfulRun = true;
        console.log("Docker Compose setup completed successfully.");
        resolve(true);
      } catch (error) {
        console.error("Error running docker-compose up. Please remove or rename the conflicting container and try again.");
        const removeConflict = await inquirer.prompt({
          type: "confirm",
          name: "removeConflictingContainer",
          message: "Would you like to remove the conflicting container?",
          default: true,
        });

        if (removeConflict.removeConflictingContainer) {
          execSync("docker stop agentgpt && docker rm agentgpt", { stdio: "inherit" });
        } else {
          console.log("Please remove the existing container and try again.");
          process.exit(0);
        }
      }
    }

    if (retries >= 5) {
      console.error("Failed to start Docker Compose after 5 attempts.");
      process.exit(1);
    }
  });
}

// Function to check if entered api key is in the correct format
const is_valid_sk_key = (apikey) => {
  const pattern = /^sk-[a-zA-Z0-9]{48}$/;
  return pattern.test(apikey);
};

let nextauth_secret;
// Function to generate a secret for NextAuth
async function generateNextAuthSecret() {
  return new Promise((resolve, reject) => {
    exec("openssl rand -base64 32", (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Function to prompt for configuration
async function promptForConfiguration() {
  let containerExists = false;
  try {
    containerExists = execSync("docker ps -a --format '{{.Names}}' | grep 'agentgpt.*'").toString().trim().startsWith("agentgpt");
  } catch (error) {
    console.error('Error checking for container: ', error);
  }

  const questions = [
    {
      type: "input",
      name: "NEXTAUTH_URL",
      message: "enter NEXTAUTH_URL:",
      default: "http://localhost",
    },
    {
      type: "input",
      name: "PORT",
      message: "enter PORT:",
      default: "3000",
    },
    {
      type: "input",
      name: "openai_api_key",
      message: "enter your openai key (eg: sk...) or press enter to continue with no key:",
      validate: (apikey) => {
        if (is_valid_sk_key(apikey) || apikey === "") {
          return true;
        } else {
          return "\ninvalid api key. please ensure that you have billing set up on your openai account"
        }
          return false;
        },
      },
    {
      type: "list",
      name: "runoption",
      message: "how do you want to run the application?",
      choices: ["docker-compose (recommended)", "docker", "node"],
    },
  ];

  // Add a prompt to remove the existing container if it exists
  if (containerExists) {
    questions.unshift({
      type: "confirm",
      name: "runningContainerPrompt",
      message: "Docker container 'agentgpt' already exists. Do you want to stop and remove it?",
    });
  }

  const response = await inquirer.prompt(questions);
  nextauth_secret = await generateNextAuthSecret();
  console.log(response);
  return response;
}



// Function to create the .env, .env.docker, and docker-compose.yml files
async function createEnv(response) {
  const envcontent = `
# deployment environment:
NODE_ENV=development

# next auth config:
NEXTAUTH-SECRET=${nextauth_secret}
NEXTAUTH_URL=${response.NEXTAUTH_URL}:${response.PORT}

# prisma
DATABASE_URL=file:./db.sqlite

# external apis:
OPENAI_API_KEY=${response.openai_api_key}

DATABASE_URL=file:../db/db.sqlite
`;

  fs.writeFileSync(".env", envcontent)
  fs.writeFileSync(".env.docker", envcontent);
  console.log("config saved to .env and .env.docker");

  const composeContent = `
    version: '3.8'
    services:
      agentgpt_compose:
        build:
          context: .
          args:
            NODE_ENV: development
        image: agentgpt
        container_name: agentgpt_compose
        ports:
          - "${response.PORT}:3000"
        volumes:
          - ./db:/app/db
        environment:
          NODE_ENV: development
    `;

  fs.writeFileSync("docker-compose.yml", composeContent);
  console.log("docker-compose.yml created.");
}



async function main() {
  // create an empty file to store which run option user picks (docker-compose (recommended), docker, node)
  fs.writeFileSync(".runoption", "");
  const config = await promptForConfiguration();
  // save config with createEnv
  try {
    await createEnv(config);
  } catch (error) {
    console.error("Error creating .env files: ", error);
    console.log("Please try again.")
    process.exit(1);
  }


    if (config.runoption === "docker-compose (recommended)") {
      console.log("running docker-compose setup");
      try {
        successfulRun = await handleDockerCompose();
      } catch (error) {
        if (error.message.includes("WARNING: ")) {
          console.warn(error.message);
        } else {
        if (error.message.includes("ERROR: ")) {
          console.error(error.message);
          console.error("Error with Docker Compose setup. Make sure Docker Compose is installed and configured correctly.");
          process.exit(1);
        } 
        }
      }

    } else if (config.runoption === "docker") {
      console.log("running docker setup");
      console.log("running docker build");
      execSync(`docker build --build-arg NODE_ENV=development -t agentgpt .`, { stdio: "inherit" });
      console.log("running docker run");

      try {
        execSync("docker run -p 3000:3000 -d --name agentgpt agentgpt", { stdio: "inherit" });
        successfulRun = true;
      } catch (error) {
        if (error.message.includes("port is already allocated")) {
          console.error("Error running docker run. Port 3000 is already in use. Please free up the port and try again.");
          process.exit(1);
        } else if (error.message.includes("Conflict. The container name")) {
          console.error("Error running docker run. A container with the name 'agentgpt' already exists. Please remove or rename the conflicting container and try again.");
          const removeConflict = await inquirer.prompt({
            type: "confirm",
            name: "removeConflictingContainer",
            message: "Would you like to remove the conflicting container?",
            default: true,
          });
            
          if (removeConflict.removeConflictingContainer) {
            execSync("docker stop agentgpt && docker rm agentgpt", { stdio: "inherit" });
          } else {
            console.log("Please remove the conflicting container and try again.");
            process.exit(0);
          }
        } else {
          console.error("An unknown error occurred while running docker run:", error.message);
          process.exit(1);
        }
      }
      
          
    } else {
      // node setup
      console.log("running node setup");
      console.log("running git clone");
      try {
        execSync("gh repo fork reworkd/AgentGPT && cd AgentGPT && npm install && ./prisma/useSqlite.sh && npx prisma db push && npm run dev", { stdio: "inherit" });
        successfulRun = true;
      } catch (error) {
        console.error('There was an error forking the repo. Please ensure that you have the gh cli installed and that you have logged in with gh auth login')
        return;
      }
    }
}

main();