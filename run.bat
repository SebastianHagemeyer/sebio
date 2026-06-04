@echo off
REM ============================================================
REM  SEBIO - build and serve the site locally with live reload.
REM  Double-click this file, or run it from a terminal.
REM ============================================================
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js / npm was not found on your PATH.
  echo Install Node.js ^(LTS^) from https://nodejs.org and try again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies ^(first run only^)...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed - see the messages above.
    pause
    exit /b 1
  )
)

echo.
echo ============================================================
echo  Starting the SEBIO dev server...
echo  Open  http://localhost:8080  in your browser.
echo  Press Ctrl+C in this window to stop.
echo ============================================================
echo.
call npm start
