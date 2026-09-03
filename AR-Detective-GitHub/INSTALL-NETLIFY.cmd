@echo off
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 22 LTS or newer from https://nodejs.org/
  pause
  exit /b 1
)
call npm install
if errorlevel 1 goto failed
call npm run build
if errorlevel 1 goto failed
call npm test
if errorlevel 1 goto failed
call npx netlify login
if errorlevel 1 goto failed
call npx netlify deploy --build --prod
if errorlevel 1 goto failed
echo Deployment complete. Follow the Thai setup guide to enable Identity and invite the teacher.
pause
exit /b 0
:failed
echo Setup stopped. Please read the error above or send it to the person who prepared this game.
pause
exit /b 1
