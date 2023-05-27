import inquirer from "inquirer";
import dotenv from "dotenv";
import { printTitle } from "./helpers.js";
import { doesEnvFileExist, generateEnv, testEnvFile } from "./envGenerator.js";
import { newEnvQuestions } from "./questions/newEnvQuestions.js";
import { existingEnvQuestions } from "./questions/existingEnvQuestions.js";

const handleExistingEnv = () => {
  console.log("Existing ./next/env file found. Validating...");
  testEnvFile();
  inquirer.prompt(existingEnvQuestions).then((answers) => {
    handleRunOption(answers.runOption);
  });
}

const handleNewEnv = () => {
  inquirer.prompt(newEnvQuestions).then((answers) => {
    dotenv.config({ path: "./.env" });
    generateEnv(answers);
    console.log("\nEnv files successfully created!");
    handleRunOption(answers.runOption);
  });
}

const handleRunOption = (runOption) => {
  if (runOption === "docker-compose") {
    console.log("Please run `docker-compose up --build` in the terminal.");
  }

  if (runOption === "docker") {
    console.log(
      "Please go into the ./next and ./platform folders and run the dockerfiles."
    );
    console.log(
      "Please use or update the MySQL database configuration in the env file."
    );
  }

  if (runOption === 'manual') {
    console.log("Please go into the ./next folder and run `npm install && npm run dev`.");
    console.log("Please also go into the ./platform folder and run `poetry install && poetry run python -m reworkd_platform`.");
    console.log("Please use or update the MySQL database configuration in the env file(s).");
  }
}


printTitle();

if (doesEnvFileExist()) {
  handleExistingEnv();
} else {
  handleNewEnv();
}
