#!/bin/bash
cd "$(dirname "$0")" || exit 1

# The CLI will take care of setting up the ENV variables
cd ./cli || exit 1
npm install
npm run start
