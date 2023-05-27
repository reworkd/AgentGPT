export const RUN_OPTION_QUESTION = {
  type: 'list',
  name: 'runOption',
  choices: ["docker-compose", "docker", "manual"],
  message: 'How will you be running AgentGPT?',
  default: "docker-compose",
}
