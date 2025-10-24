@echo off
REM
pushd %~dp0

call npm run build
node dist/interactive.js

popd
pause