import inquirer from 'inquirer';
import fs from 'fs';
import { exec, execSync } from 'child_process';
import figlet from 'figlet';

console.log(
  '    ___                    __  __________ ______\n' +
  '   /   | ____ ____  ____  / /_/ ____/ __ /_  __/\n' +
  '  / /| |/ __ `/ _ \\/ __ \\/ __/ / __/ /_/ // /\n' +
  ' / ___ / /_/ /  __/ / / / /_/ /_/ / ____// /\n' +
  '/_/  |_\\__, /\\___/_/ /_/\\__ /____/_/    /_/\n' +
  '      /____/                                  '
);





const is_valid_sk_key = (apiKey) => {
  const pattern = /^sk-[a-zA-Z0-9]{48}$/;
  return pattern.test(apiKey);
};

async function promptForApiKey() {
  const apiKeyQuestion = {
    type: 'input',
    name: 'OPENAI_API_KEY',
    message: 'Enter your OpenAI Key (eg: sk...) or press enter to continue with no key:',
    validate: (apiKey) => {
      if (is_valid_sk_key(apiKey) || apiKey === '') {
        return true;
      } else {
        console.log('\nInvalid API key. Please ensure that you have billing set up on your OpenAI account');
        return await promptForApiKey(); //recursive call to prompt user again
      }
    },
  };

  const { OPENAI_API_KEY } = await inquirer.prompt(apiKeyQuestion);
  return OPENAI_API_KEY;
};
  if (!is_valid_sk_key(OPENAI_API_KEY) && OPENAI_API_KEY !== '') {
    console.log('Invalid API Key, Please try again.');
    return promptForApiKey();
  } else {
    return OPENAI_API_KEY;
  }
}

/*const generateFigletText = (text) => {
  return new Promise((resolve, reject) => {
    figlet(text, font, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}; */

async function main() {
/*  try {
    const bannerText = await generateFigletText('Config Generator', 'Doom'); // Pass the desired font as the second argument
    console.log(bannerText);
  } catch (err) {
    console.error('Error generating banner text');
  } */

  const questions = [
    {
      type: 'input',
      name: 'NODE_ENV',
      message: 'Enter NODE_ENV (development/production):',
      default: 'production',
    },
    {
      type: 'input',
      name: 'NEXTAUTH_URL',
      message: 'Enter NEXTAUTH_URL:',
      default: 'http://localhost',
    },
    {
      type: 'input',
      name: 'PORT',
      message: 'Enter PORT:',
      default: '3000',
    },
    {
      type: 'input',
      name: 'OPENAI_API_KEY',
      message: 'Enter your OpenAI Key (eg: sk...) or press enter to continue with no key:',
      validate: (apiKey) => {
        if (is_valid_sk_key(apiKey) || apiKey === '') {
          return true;
        } else {
          return 'Invalid API key. Please ensure that you have billing set up on your OpenAI account';
        }
      },
    },
    {
      type: 'list',
      name: 'runOption',
      message: 'How do you want to run the application?',
      choices: ['docker-compose', 'docker', 'node'],
    },
  ];

  const answers = await inquirer.prompt(questions);

  // Generate NEXTAUTH_SECRET and replace $FOO
  exec('openssl rand -base64 32', (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    const NEXTAUTH_SECRET = stdout.trim();
    console.log(`Generated NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}`);

    const envContent = `
# Deployment Environment:
NODE_ENV=${answers.NODE_ENV}

# Next Auth config:
# Generate a secret with \`openssl rand -base64 32\`, or visit https://generate-secret.vercel.app/
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=${answers.NEXTAUTH_URL}:${answers.PORT}

# Prisma
DATABASE_URL=file:./db.sqlite

# External APIs:
OPENAI_API_KEY=${answers.OPENAI_API_KEY}
`;

    fs.writeFileSync('.env.test.docker', envContent);
    console.log('Config saved to .env.test.docker');

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
    ports:
      - "${answers.PORT}:3000"
    volumes:
      - ./db:/app/db
    environment:
      NODE_ENV: ${answers.NODE_ENV}
`;

    fs.writeFileSync('docker-compose-test.yml', composeContent);
    console.log('docker-compose-test.yml created.');
  });
  // Docker-compose setup
  if (answers.runOption === 'docker-compose') {
    execSync('docker-compose up -d', { stdio: 'inherit' });
  }
  // Docker setup
  else if (answers.runOption === 'docker') {
    execSync('docker build --build-arg NODE_ENV=' + answers.NODE_ENV + ' -t agentgpt .', {stdio: 'inherit' });
    execSync(
      'docker run -d --name agentgpt -p ' + answers.PORT + ':3000 -v $(pwd)/db:/app/db agentgpt',
      { stdio: 'inherit' },
    );
  }
  // Node.js setup
  else {
    execSync('./prisma/useSqlite.sh', { stdio: 'inherit' });
    execSync('npm install', { stdio: 'inherit' });
    execSync('npm run dev', { stdio: 'inherit' });
  }
}

main();

