# Flow Motion - Simple Startup Script (runs in current terminal)
# This script starts the frontend only, assuming backend services are running separately

Write-Host "🚀 Starting Flow Motion Frontend..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Navigate to project root
Set-Location "c:\Users\User\Documents\GitHub\daors-flow-motion"

# Install dependencies if needed
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Start the development server
Write-Host "🌐 Starting React development server..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Green

npm run dev