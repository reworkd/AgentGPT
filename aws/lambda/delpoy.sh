#!/bin/bash
cd "$(dirname "$0")"

npm run build

aws lambda update-function-code \
  --function-name execute-task \
  --zip-file "fileb://dist/index.zip"
