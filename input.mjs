import inquirer from "inquirer";
import fs from "fs";
import { exec, execSync } from "child_process";
import { error } from "console";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { PrismaClient } from "@prisma/client";
import { executionAsyncResource } from "async_hooks";
const prisma = new PrismaClient();



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
      message:
        "enter your openai key (eg: sk...) or press enter to continue with no key:",
      validate: async (apikey) => {
        if (is_valid_sk_key(apikey) || apikey === "") {
          return true;
        } else {
          console.log(
            "\ninvalid api key. please ensure that you have billing set up on your openai account"
          );
          return false;
        }
      },
    },
    {
      type: "list",
      name: "runoption",
      message: "how do you want to run the application?",
      choices: ["docker-compose", "docker", "node"],
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

  fs.writeFileSync("docker-compose.yml", composeContent);
  console.log("docker-compose.yml created.");
}

async function main() {
  // create an empty file to store which run option user picks (docker-compose, docker, node)  
  fs.writeFileSync(".runoption", "");
  const answers = await promptForConfiguration();
   
  // check if setup has already been run
//  if (fs.existsSync(".env.docker")) {
//    console.log("setup has already been run. running docker-compose up -d");
//    execSync("docker-compose up -d", { stdio: "inherit" });
//    return;
//  }
  //check if a docker container has the name agentgpt already
  

  // docker-compose setup
  if (answers.runoption === "docker-compose") {
    execSync("docker-compose up -d", { stdio: "inherit" });
  }
  // docker setup
  else if (answers.runoption === "docker") {
    console.log("running docker setup");
    //await createEnvDockerFile(answers);
    console.log("running docker build");
    //hardcoding development for now
    execSync(`docker build --build-arg NODE_ENV=development -t agentgpt .`, { stdio: "inherit" });
    console.log("running docker run");
    execSync("docker run -p 3000:3000 -d --name agentgpt agentgpt", {
      stdio: "inherit",
    });

  } else {
    // node setup
    console.log("running node setup");
    console.log("running git clone");
    try {
      execSync("gh repo fork reworkd/AgentGPT && cd AgentGPT && npm install && ./prisma/useSqlite.sh && npx prisma db push && npm run dev", { stdio: "inherit" });
    } catch (error) {
      console.error('There was an error forking the repo. Please ensure that you have the gh cli installed and that you have logged in with gh auth login')
      return;
    }
    /*execSync("cd AgentGPT", { stdio: "inherit" });
   // execSync('cd "$(dirname "$0")" || exit', { stdio: "inherit" });
    console.log("running npm install");
    execSync("npm install", { stdio: "inherit" });
    execSync('cd AgentGPT && ./prisma/useSqlite.sh', { stdio: "inherit" });
    execSync('npx prisma db push', { stdio: "inherit" });
    execSync("npm run dev", { stdio: "inherit" });*/
  }
}

main();
