# Flow Motion Deployment Setup Script
# This script helps set up the required tools for deployment

param(
    [switch]$SkipDocker,
    [switch]$SkipKubectl,
    [switch]$SkipGit
)

Write-Host "=== Flow Motion Deployment Setup ===" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Warning "Some installations may require administrator privileges. Please run as administrator if prompted."
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Install Chocolatey if not present
if (-not (Test-Command "choco")) {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

# Install Docker Desktop
if (-not $SkipDocker -and -not (Test-Command "docker")) {
    Write-Host "Installing Docker Desktop..." -ForegroundColor Yellow
    choco install docker-desktop -y
    Write-Host "Please restart your computer after Docker installation completes." -ForegroundColor Red
    Write-Host "Then run this script again with -SkipDocker flag" -ForegroundColor Yellow
    exit 1
}

# Install kubectl
if (-not $SkipKubectl -and -not (Test-Command "kubectl")) {
    Write-Host "Installing kubectl..." -ForegroundColor Yellow
    choco install kubernetes-cli -y
}

# Install Git if needed
if (-not $SkipGit -and -not (Test-Command "git")) {
    Write-Host "Installing Git..." -ForegroundColor Yellow
    choco install git -y
}

# Verify installations
Write-Host "`n=== Verification ===" -ForegroundColor Cyan

$tools = @("docker", "kubectl", "git")
$allGood = $true

foreach ($tool in $tools) {
    if (Test-Command $tool) {
        Write-Host "✓ $tool is installed" -ForegroundColor Green
        & $tool --version
    }
    else {
        Write-Host "✗ $tool is NOT installed" -ForegroundColor Red
        $allGood = $false
    }
}

if ($allGood) {
    Write-Host "`n✓ All tools are installed! You can now run the deployment script." -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Ensure Docker Desktop is running"
    Write-Host "2. Ensure you have access to a Kubernetes cluster"
    Write-Host "3. Run: .\scripts\deploy-updated.ps1 dev all -DryRun"
}
else {
    Write-Host "`n✗ Some tools are missing. Please install them manually or run this script as administrator." -ForegroundColor Red
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
