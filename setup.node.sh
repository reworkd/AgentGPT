#!/bin/bash

# Force node env to dev
sed '/node_env=/s/-.*/=development/' .env

npm install

./prisma/useSqlite.sh

npx prisma db push
rpm run dev
