# Budget App Configuration Checker
# Validates that all required setup is complete

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Budget App Configuration Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Navigate to script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Checking project setup..." -ForegroundColor Yellow
Write-Host ""

# Check 1: Node modules
Write-Host "[1/5] Checking dependencies..." -NoNewline
if (Test-Path "node_modules") {
    Write-Host " ✅ PASS" -ForegroundColor Green
} else {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    Write-Host "      Dependencies not installed. Run: npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check 2: .env.local exists
Write-Host "[2/5] Checking .env.local file..." -NoNewline
if (Test-Path ".env.local") {
    Write-Host " ✅ PASS" -ForegroundColor Green
} else {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    Write-Host "      .env.local file not found. Copy .env.example to .env.local" -ForegroundColor Yellow
    $allGood = $false
}

# Check 3: API key configured
Write-Host "[3/5] Checking Anthropic API key..." -NoNewline
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "ANTHROPIC_API_KEY=sk-ant-") {
        Write-Host " ✅ PASS" -ForegroundColor Green
    } elseif ($envContent -match "ANTHROPIC_API_KEY=your-actual-api-key-here") {
        Write-Host " ⚠️  WARNING" -ForegroundColor Yellow
        Write-Host "      API key placeholder detected. Replace with real key from:" -ForegroundColor Yellow
        Write-Host "      https://console.anthropic.com/" -ForegroundColor Yellow
        $allGood = $false
    } else {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "      API key not configured in .env.local" -ForegroundColor Yellow
        $allGood = $false
    }
} else {
    Write-Host " ⏭️  SKIP" -ForegroundColor Gray
    Write-Host "      .env.local not found" -ForegroundColor Gray
}

# Check 4: Project structure
Write-Host "[4/5] Checking project structure..." -NoNewline
$requiredDirs = @("src", "src\app", "src\lib", "src\components")
$structureOk = $true
foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir)) {
        $structureOk = $false
        break
    }
}
if ($structureOk) {
    Write-Host " ✅ PASS" -ForegroundColor Green
} else {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    Write-Host "      Project structure incomplete" -ForegroundColor Yellow
    $allGood = $false
}

# Check 5: Key files exist
Write-Host "[5/5] Checking critical files..." -NoNewline
$requiredFiles = @(
    "src\lib\ai-analysis.ts",
    "src\app\api\analyze\route.ts",
    "src\app\submission\page.tsx",
    "package.json"
)
$filesOk = $true
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $filesOk = $false
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "      Missing: $file" -ForegroundColor Yellow
        $allGood = $false
        break
    }
}
if ($filesOk) {
    Write-Host " ✅ PASS" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✅ All checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your app is ready to run:" -ForegroundColor Green
    Write-Host "  .\start-dev.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Then visit: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Configuration incomplete" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please fix the issues above before running the app." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick fixes:" -ForegroundColor White
    Write-Host "  1. Install dependencies: npm install" -ForegroundColor Gray
    Write-Host "  2. Get API key: https://console.anthropic.com/" -ForegroundColor Gray
    Write-Host "  3. Update .env.local with your API key" -ForegroundColor Gray
    Write-Host "  4. See API_SETUP_GUIDE.md for details" -ForegroundColor Gray
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $allGood) {
    exit 1
}


