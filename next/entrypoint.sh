#!/usr/bin/env sh

cd /next
dos2unix wait-for-db.sh

# copy .env file if not exists
[ ! -f .env ] && [ -f .env.example ] && cp .env.example .env
cp .env .env.temp
dos2unix .env.temp
cat .env.temp > .env
rm .env.temp

source .env

# Ensure DB is available before running Prisma commands
./wait-for-db.sh agentgpt_db 3307

# Run Prisma commands
if [[ ! -f "/app/prisma/${DATABASE_URL:5}" ]]; then
  npx prisma migrate deploy --name init
  npx prisma db push
fi

# Generate Prisma client
npx prisma generate

# run cmd
exec "$@"
