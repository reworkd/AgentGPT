import crypto from "crypto";

export const generateEnv = (envValues) => {
  let isDockerCompose = envValues.runOption === "docker-compose";
  let dbPort = isDockerCompose ? 3307 : 3306;
  let platformUrl = isDockerCompose ? "http://host.docker.internal:8000" : "http://localhost:8000";
  const websearchEnabled = envValues.serpApiKey !== null && envValues.serpApiKey !== "";

  console.log(envValues)
  console.log(platformUrl, websearchEnabled);
  const envDefinition = {
    "Deployment Environment": {
      NODE_ENV: "development"
    },
    "NextJS": {
      NEXT_PUBLIC_BACKEND_URL: "http://localhost:8000",
      PLATFORM_URL: platformUrl,
      NEXT_PUBLIC_FORCE_AUTH: false
    },
    "Websearch": {
      NEXT_PUBLIC_WEB_SEARCH_ENABLED: websearchEnabled,
    },
    "Next Auth config": {
      NEXTAUTH_SECRET: generateAuthSecret(),
      NEXTAUTH_URL: "http://localhost:3000"
    },
    "Auth providers (Use if you want to get out of development mode sign-in)": {
      GOOGLE_CLIENT_ID: "***",
      GOOGLE_CLIENT_SECRET: "***",
      GITHUB_CLIENT_ID: "***",
      GITHUB_CLIENT_SECRET: "***",
      DISCORD_CLIENT_SECRET: "***",
      DISCORD_CLIENT_ID: "***"
    },
    "Backend": {
      REWORKD_PLATFORM_FF_MOCK_MODE_ENABLED: false,
      REWORKD_PLATFORM_OPENAI_API_KEY: envValues.OpenAIApiKey || "<change me>",
      REWORKD_PLATFORM_FRONTEND_URL: "http://localhost:3000",
      REWORKD_PLATFORM_RELOAD: true,
      REWORKD_PLATFORM_OPENAI_API_BASE: "https://api.openai.com/v1",
      REWORKD_PLATFORM_SERP_API_KEY: envValues.serpApiKey || "<change me>",
      REWORKD_PLATFORM_REPLICATE_API_KEY: envValues.replicateApiKey || "<change me>",
    },
    "Database (Backend)": {
      REWORKD_PLATFORM_DATABASE_USER: "reworkd_platform",
      REWORKD_PLATFORM_DATABASE_PASSWORD: "reworkd_platform",
      REWORKD_PLATFORM_DATABASE_HOST: "db",
      REWORKD_PLATFORM_DATABASE_PORT: dbPort,
      REWORKD_PLATFORM_DATABASE_NAME: "reworkd_platform",
      REWORKD_PLATFORM_DATABASE_URL: "mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}",
    },
    "Database (Frontend)": {
      DATABASE_USER: "reworkd_platform",
      DATABASE_PASSWORD: "reworkd_platform",
      DATABASE_HOST: "db",
      DATABASE_PORT: dbPort,
      DATABASE_NAME: "reworkd_platform",
      DATABASE_URL: "mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
    },
  };

  console.log(generateEnvText(envDefinition));
}

function generateEnvText(config) {
  let configFile = '';

  Object.entries(config).forEach(([section, variables]) => {
    configFile += `# ${ section }:\n`;
    Object.entries(variables).forEach(([key, value]) => {
      configFile += `${ key }=${ value }\n`;
    });
    configFile += '\n';
  });

  return configFile.trim();
}

const generateAuthSecret = () => {
  const length = 32;
  const buffer = crypto.randomBytes(length);
  return buffer.toString('base64');
}
