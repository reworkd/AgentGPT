import inquirer from "inquirer";
import fs from "fs";
import { exec, execSync } from "child_process";
import { error } from "console";

// Import dotenv package
import dotenv from 'dotenv';
// Load .env file explicitly
dotenv.config({ path: './.env' });

import { PrismaClient } from "@prisma/client";
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


async function main() {

 // const apikey = await promptforapikey();

  const questions = [
    {
      type: "input",
      name: "node_env",
      message: "enter node_env (development/production):",
      default: "production",
    },
    {
      type: "input",
      name: "nextauth_url",
      message: "enter nextauth_url:",
      default: "http://localhost",
    },
    {
      type: "input",
      name: "port",
      message: "enter port:",
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

  // generate nextauth_secret and replace $foo
 /*exec("openssl rand -base64 32", (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }a*/

     
    const nextauth_secret = await generateNextAuthSecret();
    //console.log(`generated nextauth_secret: ${nextauth_secret}`)

    const envcontent = `
# deployment environment:
node_env=${answers.node_env}

# next auth config:
# generate a secret with \`openssl rand -base64 32\`, or visit https://generate-secret.vercel.app/
nextauth_secret=${nextauth_secret}
nextauth_url=${answers.nextauth_url}:${answers.port}

# prisma
database_url=file:./db.sqlite

# external apis:
openai_api_key=${answers.openai_api_key}
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
        node_env: ${answers.node_env}
    image: agentgpt
    container_name: agentgpt_compose
    ports:
      - "${answers.port}:3000"
    volumes:
      - ./db:/app/db
    environment:
      node_env: ${answers.node_env}
`;

    fs.writeFileSync("docker-compose.yml", composeContent);
    console.log("docker-compose.yml created.");
  
  // docker-compose setup
  if (answers.runoption === "docker-compose") {
    execSync("docker-compose up -d", { stdio: "inherit" });
  }
  // docker setup
  else if (answers.runoption === "docker") {
    /*execSync(
      "docker build --build-arg node_env=" +
        answers.node_env +
        " -t agentgpt .",
      { stdio: "inherit" }
    );
    /*execSync(
      "docker run -d --name agentgpt -p " +
        answers.port +
        ":3000 -v $(pwd)/db:/app/db agentgpt",
      { stdio: "inherit" }
    );
    execSync("docker build --build-arg node_env=production -t agentgpt . --no-cache --progress=plain")
  }*/
  // node.js setup



  // cant get it to work from the script, too tired to debug== hardcoding it. will fix.
  const scriptPathDocker = './setup.sh --docker';
  exec(scriptPathDocker, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing script: ${error}');
      return;
    }
    console.log('Script output:\n${stdout}');
  });

  } else {
    /*fs.writeFileSync('prisma/schema.prisma', fs.readFileSync('prisma/schema.sqlite.prisma'));
    execSync('touch db.sqlite && prisma generate', { stdio: 'inherit' });
    execSync("npm install", { stdio: "inherit" });
    execSync("npm run dev", { stdio: "inherit" });*/

    // cant get it to work from the script, too tired to debug== hardcoding it. will fix.
    const scriptPathNode = './setup.node.sh';
    exec(scriptPathNode, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing script: ${error}');
        return;
      }
      console.log('Script output:\n${stdout}');
      });
  }
}

main();
