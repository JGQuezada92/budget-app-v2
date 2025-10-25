# Budget App Development Server Startup Script
# This script ensures dependencies are installed and starts the dev server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Budget App v2 - Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Current directory: $ScriptDir" -ForegroundColor Yellow
Write-Host ""

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "[INSTALLING] Dependencies not found. Running npm install..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev


