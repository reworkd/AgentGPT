#!/bin/bash
cd "$(dirname "$0")" || exit

echo -n "Enter your OpenAI Key (eg: sk...): "
read OPENAI_API_KEY
echo -n "Enter your custom base url (press enter for default): "
read API_BASE_URL

NEXTAUTH_SECRET=$(openssl rand -base64 32)

ENV="NODE_ENV=development\n\
NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n\
NEXTAUTH_URL=http://localhost:3000\n\
OPENAI_API_KEY=$OPENAI_API_KEY\n\
DATABASE_URL=file:../db/db.sqlite\n
API_BASE_URL=$API_BASE_URL\n"

printf $ENV > .env

if [ "$1" = "--docker" ]; then
  printf $ENV > .env.docker
  docker build -t agentgpt .
  docker run -d --name agentgpt -p 3000:3000 -v $(pwd)/db:/app/db agentgpt
else
  printf $ENV > .env
  ./prisma/useSqlite.sh
  npm install
  npm run dev
fi