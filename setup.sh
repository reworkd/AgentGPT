#!/bin/bash

set -euo pipefail

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Create the "db" directory if it doesn't exist and set its permissions
mkdir -p ./db
chmod 700 ./db

# Function to check if an OpenAI API key is valid
is_valid_sk_key() {
  local api_key=$1
  local pattern="^sk-[a-zA-Z0-9]{48}$"
  [[ $api_key =~ $pattern ]]
}

# Prompt the user to enter an OpenAI API key
read -p "Enter your OpenAI Key (eg: sk...) or press enter to continue with no key: " OPENAI_API_KEY

# Check if the key is valid
if [[ -n $OPENAI_API_KEY ]] && ! is_valid_sk_key "$OPENAI_API_KEY"; then
  echo "Invalid API key. Please ensure that you have billing set up on your OpenAI account"
  exit 1
fi

# Generate a random string for the NEXTAUTH_SECRET environment variable
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Set the environment variables based on the current option or environment
case $1 in
  "--docker")
    ENV="NODE_ENV=development\n\
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n\
    NEXTAUTH_URL=http://localhost:3000\n\
    OPENAI_API_KEY=$OPENAI_API_KEY\n\
    DATABASE_URL=file:../db/db.sqlite\n"
    printf "$ENV" > .env.docker
    source .env.docker
    docker build --build-arg NODE_ENV=$NODE_ENV -t agentgpt .
    docker run -d --name agentgpt -p 3000:3000 -v $(pwd)/db:/app/db agentgpt
    ;;
  "--docker-compose")
    ENV="NODE_ENV=development\n\
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n\
    NEXTAUTH_URL=http://localhost:3000\n\
    OPENAI_API_KEY=$OPENAI_API_KEY\n\
    DATABASE_URL=file:../db/db.sqlite\n"
    printf "$ENV" > .env
    docker-compose up -d --remove-orphans
    ;;
  *)
    ENV="NODE_ENV=development\n\
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n\
    NEXTAUTH_URL=http://localhost:3000\n\
    OPENAI_API_KEY=$OPENAI_API_KEY\n\
    DATABASE_URL=file:../db/db.sqlite\n"
    printf "$ENV" > .env
    ./prisma/useSqlite.sh
    npm install
    npm run dev
    ;;
esac
