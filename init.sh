#!/bin/bash
#
echo "setting up environment"

# Install inquirer
#npm init -y
npm install inquirer figlet
echo "done."

echo "Welcome to AgentGPT! The following questions will help you set up your environment"
node input.mjs
