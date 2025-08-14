# Flow Motion - Complete Application Startup Script
# This script starts all components of the Flow Motion logistics platform

Write-Host "🚀 Starting Flow Motion Logistics Platform..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Function to start a service in a new PowerShell window
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Path,
        [string]$Command,
        [int]$Port
    )
    
    Write-Host "🔧 Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    
    $scriptBlock = @"
Set-Location '$Path'
Write-Host '🟢 $ServiceName is starting...' -ForegroundColor Green
Write-Host 'Path: $Path' -ForegroundColor Cyan
Write-Host 'Port: $Port' -ForegroundColor Cyan
Write-Host '================================' -ForegroundColor Green
$Command
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock
    Start-Sleep -Seconds 2
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✅ Python version: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Installing dependencies (if needed)..." -ForegroundColor Yellow

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location "c:\Users\User\Documents\GitHub\daors-flow-motion"
npm install --silent

# Install API Gateway dependencies
Write-Host "📦 Installing API Gateway dependencies..." -ForegroundColor Cyan
Set-Location "c:\Users\User\Documents\GitHub\daors-flow-motion\logi-core\apps\api-gateway"
npm install --silent

# Install User Service dependencies
Write-Host "📦 Installing User Service dependencies..." -ForegroundColor Cyan
Set-Location "c:\Users\User\Documents\GitHub\daors-flow-motion\logi-core\services\user-service"
npm install --silent

# Setup Python environment for Inventory Service
Write-Host "🐍 Setting up Python environment for Inventory Service..." -ForegroundColor Cyan
Set-Location "c:\Users\User\Documents\GitHub\daors-flow-motion\logi-core\services\inventory-service"
if (-not (Test-Path ".venv")) {
    python -m venv .venv
}
.venv\Scripts\Activate.ps1
pip install -r requirements.txt --quiet

Write-Host "`n🚀 Starting all services..." -ForegroundColor Green
Write-Host "Services will open in separate PowerShell windows" -ForegroundColor Yellow
Write-Host "You can close individual services by closing their windows" -ForegroundColor Yellow

# Start services in order
Start-Service -ServiceName "Inventory Service (Python FastAPI)" -Path "c:\Users\User\Documents\GitHub\daors-flow-motion\logi-core\services\inventory-service" -Command ".venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000" -Port 8000

Start-Service -ServiceName "User Service (NestJS)" -Path "c:\Users\User\Documents\GitHub\daors-flow-motion\logi-core\services\user-service" -Command "npm run dev" -Port 4001

Start-Service -ServiceName "API Gateway (Express)" -Path "c:\Users\User\Documents\GitHub\daors-flow-motion\logi-core\apps\api-gateway" -Command "npm run dev" -Port 8080

Start-Service -ServiceName "Frontend (React + Vite)" -Path "c:\Users\User\Documents\GitHub\daors-flow-motion" -Command "npm run dev" -Port 3000

Write-Host "`n✅ All services are starting!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "🌐 Frontend (React):     http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 API Gateway:          http://localhost:8080" -ForegroundColor Cyan
Write-Host "👤 User Service:         http://localhost:4001" -ForegroundColor Cyan
Write-Host "📦 Inventory Service:    http://localhost:8000" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Green
Write-Host "💡 Tip: Wait a few seconds for all services to fully start" -ForegroundColor Yellow
Write-Host "💡 Check each service window for startup logs" -ForegroundColor Yellow
Write-Host "💡 Press Ctrl+C in any service window to stop that service" -ForegroundColor Yellow

# Keep this window open
Write-Host "`nPress any key to exit this startup script (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")