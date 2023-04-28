import inquirer from "inquirer";
import fs from "fs";
import { exec, execSync, spawn } from "child_process";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function handleDockerCompose() {
  return new Promise(async (resolve, reject) => {
    let successfulRun = false;

    while (!successfulRun) {
      const dockerCompose = spawn("docker-compose", ["up", "-d"]);

      dockerCompose.stderr.on("data", async (data) => {
        const portErrorMessage = "Bind for 0.0.0.0:3000 failed: port is already allocated";

        if (data.includes(portErrorMessage)) {
          console.log(
            "It looks like that port is already in use by something else, please try a different port."
          );

          const changePort = await inquirer.prompt({
            type: "confirm",
            name: "changePort",
            message: "Would you like to try a different port?",
            default: true,
          });

          if (changePort.changePort) {
            const newPort = await inquirer.prompt({
              type: "input",
              name: "newPort",
              message: "Enter PORT:",
              default: "3101",
            });
          }
        }
      });

      dockerCompose.on("error", (error) => {
        reject(error);
      });

      dockerCompose.on("close", async (code) => {
        if (code === 0) {
          successfulRun = true;
          console.log("Docker Compose setup completed successfully.");
          resolve(true);
        } else {
          console.error(
            "Error running docker-compose up. Please remove or rename the conflicting container and try again."
          );
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
      });
    }
  });
}


console.log(
  "    ___                    __  __________ ______\n" +
    "   /   | ____ ____  ____  / /_/ ____/ __ /_  __/\n" +
    "  / /| |/ __ `/ _ \\/ __ \\/ __/ / __/ /_/ // /\n" +
    " / ___ / /_/ /  __/ / / / /_/ /_/ / ____// /\n" +
    "/_/  |_\\__, /\\___/_/ /_/\\__ /____/_/    /_/\n" +
    "      /____/                                  "
);

const is_valid_sk_key = (apikey) => {
  const pattern = /^sk-[a-zA-Z0-9]{48}$/;
  return pattern.test(apikey);
};

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

async function promptForConfiguration() {
  const questions = [
 //   {
 //     type: "input",
 //     name: "NODE_ENV",
 //     message: "enter NODE_ENV (development/production):",
 //     default: "production",
 //   },
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
        };
          return false;
        },
      },
        {
          type: "confirm",
          name: "runningContainerPrompt",
          message: "Docker container 'agentgpt' already exists. Do you want to stop and remove it?",
          when: async() => {
            try {
              const containerExists = execSync("docker ps -a -f name=agentgpt --format '{{.Names}}'").toString().trim() === "agentgpt";
              return containerExists;
            } catch (error) {
              return false;
          }
      },
    },
    {
      type: "list",
      name: "runoption",
      message: "how do you want to run the application?",
      choices: ["docker-compose (recommended)", "docker", "node"],
    },
  ]; 
  const answers = await inquirer.prompt(questions);
  const nextauth_secret = await generateNextAuthSecret();
  return answers;
}

async function createEnvDockerFile(answers) {
  const envcontent = `
# deployment environment:
//forcing to development for now
NODE_ENV=development

# next auth config:
# generate a secret with \`openssl rand -base64 32\`, or visit https://generate-secret.vercel.app/
NEXTAUTH-SECRET=${nextauth_secret}
NEXTAUTH_URL=${answers.nextauth_url}:${answers.PORT}

# prisma
DATABASE_URL=file:./db.sqlite

# external apis:
OPENAI_API_KEY=${answers.openai_api_key}

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
            NODE_ENV: ${answers.NODE_ENV}
        image: agentgpt
        container_name: agentgpt_compose
        PORTs:
          - "${answers.PORT}:3000"
        volumes:
          - ./db:/app/db
        environment:
          NODE_ENV: ${answers.NODE_ENV}
    `;

  fs.writeFileSync("docker-compose (recommended).yml", composeContent);
  console.log("docker-compose (recommended).yml created.");
}
async function main() {
  // create an empty file to store which run option user picks (docker-compose (recommended), docker, node)
  fs.writeFileSync(".runoption", "");
  const answers = await promptForConfiguration();

  let successfulRun = false;

  while (!successfulRun) {
    if (answers.hasOwnProperty("runningContainerPrompt") && answers.runningContainerPrompt) {
      execSync("docker stop agentgpt && docker rm agentgpt", { stdio: "inherit" });
    } else if (answers.hasOwnProperty("runningContainerPrompt") && !answers.runningContainerPrompt) {
      console.log("Please remove the existing container and try again.");
      process.exit(0);
    }

    if (answers.runoption === "docker-compose (recommended)") {
      console.log("running docker-compose setup");
      try {
        successfulRun = await handleDockerCompose();
      } catch (error) {
        console.error("Error with Docker Compose setup. Make sure Docker Compose is installed and configured correctly.");
        process.exit(1);
      }
    } else if (answers.runoption === "docker") {
      console.log("running docker setup");

      console.log("running docker build");
      execSync(`docker build --build-arg NODE_ENV=development -t agentgpt .`, { stdio: "inherit" });

      console.log("running docker run");
      try {
        execSync("docker run -p 3000:3000 -d --name agentgpt agentgpt", { stdio: "inherit" });
        successfulRun = true;
      } catch (error) {
        console.error("Error running docker run. Please remove or rename the conflicting container and try again.");
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
};


main();
