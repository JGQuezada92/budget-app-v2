@echo off
REM Budget App Development Server Startup Script (Batch)
REM This script ensures dependencies are installed and starts the dev server

echo ========================================
echo Budget App v2 - Development Server
echo ========================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

REM Check if node_modules exists
if exist "node_modules\" (
    echo [OK] Dependencies already installed
) else (
    echo [INSTALLING] Dependencies not found. Running npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully
)

echo.
echo ========================================
echo Starting development server...
echo ========================================
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
call npm run dev


