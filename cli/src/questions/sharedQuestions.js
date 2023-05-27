export const RUN_OPTION_QUESTION = {
  type: 'list',
  name: 'runOption',
  choices: [
    { value: "docker-compose", name: "🐳 Docker-compose (Recommended)" },
    { value: "docker", name: "🐋 Docker files" },
    { value: "manual", name: "💪 Manual" },
  ],
  message: 'How will you be running AgentGPT?',
  default: "docker-compose",
}
