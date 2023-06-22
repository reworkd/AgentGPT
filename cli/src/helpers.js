import chalk from "chalk";
import figlet from "figlet";

export const printTitle = () => {
  console.log(
    chalk.red(
      figlet.textSync("AgentGPT", {
        horizontalLayout: "full",
        font: "ANSI Shadow",
      })
    )
  );
  console.log(
    "Welcome to the AgentGPT CLI! This CLI will generate the required .env files."
  );
  console.log(
    "Copies of the generated envs will be created in `./next/.env` and `./platform/.env`.\n"
  );
};

// Function to check if entered api key is in the correct format
export const isValidSkKey = (apikey) => {
  const pattern = /^sk-[a-zA-Z0-9]{48}$/;
  return pattern.test(apikey);
};
