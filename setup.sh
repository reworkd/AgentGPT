#!/bin/bash
cd "$(dirname "$0")" || exit

echo -n "Enter your OpenAI Key (eg: sk...): "
read OPENAI_API_KEY

# set the environment variable NEXTAUTH_SECRET and OPENAI_API_KEY
NEXTAUTH_SECRET=$(openssl rand -base64 32)

printf "NODE_ENV=development\n\
NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n\
NEXTAUTH_URL=http://localhost:3000\n\
OPENAI_API_KEY=$OPENAI_API_KEY\n\
DATABASE_URL=file:../db/db.sqlite\n" > .env.docker

# Build docker image
docker build -t agentgpt .

# Create db dir for db.sqlite
mkdir -p $(pwd)/db

# Run docker
docker run -d --name agentgpt -p 3000:3000 -v $(pwd)/db:/app/db agentgpt
