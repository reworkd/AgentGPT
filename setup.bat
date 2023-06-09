@echo off
setlocal

rem  The CLI will take care of setting up the ENV variables
cd cli || exit /b 1
call npm install
npm run start
