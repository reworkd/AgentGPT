#!/bin/bash
#
echo "setting up environment"

# Install inquirer
npm init -y
npm install inquirer dotenv
echo "done."

echo "Welcome to AgentGPT! The following questions will help you set up your environment"
node setup.mjs
