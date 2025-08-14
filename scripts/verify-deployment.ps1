# Flow Motion Deployment Verification Script
# This script verifies that the deployment system is ready to use

param(
    [string]$Environment = "dev",
    [switch]$Quick,
    [switch]$Verbose
)

Write-Host "=== Flow Motion Deployment Verification ===" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow

# Colors
$Colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error   = "Red"
    Info    = "Cyan"
}

function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "Info"
    )
    $color = $Colors[$Status]
    Write-Host "  $Message" -ForegroundColor $color
}

function Test-Command {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Test-File {
    param([string]$Path)
    Test-Path $Path
}

function Test-Port {
    param([int]$Port)
    $tcp = New-Object System.Net.Sockets.TcpClient
    try {
        $tcp.Connect("localhost", $Port)
        $tcp.Close()
        return $true
    }
    catch {
        return $false
    }
}

# 1. Check Required Tools
Write-Host "`n1. Checking Required Tools..." -ForegroundColor Cyan
$tools = @("docker", "kubectl", "git", "node", "npm")
$allTools = $true

foreach ($tool in $tools) {
    if (Test-Command $tool) {
        Write-Status "✓ $tool is available" "Success"
        if ($Verbose) {
            & $tool --version
        }
    }
    else {
        Write-Status "✗ $tool is NOT available" "Error"
        $allTools = $false
    }
}

# 2. Check Required Files
Write-Host "`n2. Checking Required Files..." -ForegroundColor Cyan
$requiredFiles = @(
    "scripts/deploy-updated.ps1",
    "scripts/deploy-updated.sh",
    "scripts/setup-deployment.ps1",
    "DEPLOYMENT_GUIDE.md",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.dev.yml",
    "nginx.dev.conf"
)

foreach ($file in $requiredFiles) {
    if (Test-File $file) {
        Write-Status "✓ $file exists" "Success"
    }
    else {
        Write-Status "✗ $file is missing" "Error"
    }
}

# 3. Check Environment Files
Write-Host "`n3. Checking Environment Configuration..." -ForegroundColor Cyan
$envFiles = @(".env", ".env.development", ".env.staging", ".env.production", ".env.example")

foreach ($envFile in $envFiles) {
    if (Test-File $envFile) {
        Write-Status "✓ $envFile exists" "Success"
    }
    else {
        Write-Status "⚠ $envFile is missing (using .env.example)" "Warning"
    }
}

# 4. Check Kubernetes Configuration
Write-Host "`n4. Checking Kubernetes Configuration..." -ForegroundColor Cyan
$k8sFiles = @(
    "k8s/test-deployment.yaml",
    "logi-core/k8s/base",
    "logi-core/k8s/overlays/dev",
    "logi-core/k8s/overlays/staging",
    "logi-core/k8s/overlays/prod"
)

foreach ($k8sFile in $k8sFiles) {
    if (Test-File $k8sFile) {
        Write-Status "✓ $k8sFile exists" "Success"
    }
    else {
        Write-Status "⚠ $k8sFile is missing" "Warning"
    }
}

# 5. Check Docker Configuration
Write-Host "`n5. Checking Docker Configuration..." -ForegroundColor Cyan
if (Test-Command "docker") {
    try {
        $dockerInfo = docker info 2>$null
        if ($dockerInfo) {
            Write-Status "✓ Docker is running" "Success"
            
            # Check if we can build
            Write-Status "Testing Docker build..." "Info"
            $buildTest = docker build -t flow-motion-test:latest . --target development 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Status "✓ Docker build successful" "Success"
                docker rmi flow-motion-test:latest 2>$null
            }
            else {
                Write-Status "✗ Docker build failed" "Error"
                if ($Verbose) { Write-Host $buildTest }
            }
        }
        else {
            Write-Status "✗ Docker is not running" "Error"
        }
    }
    catch {
        Write-Status "✗ Docker check failed: $_" "Error"
    }
}

# 6. Check Kubernetes Cluster
Write-Host "`n6. Checking Kubernetes Cluster..." -ForegroundColor Cyan
if (Test-Command "kubectl") {
    try {
        $clusterInfo = kubectl cluster-info 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "✓ Kubernetes cluster is accessible" "Success"
            
            # Check if namespace exists
            $namespace = if ($Environment -eq "dev") { "logi-core" } else { "logi-core-$Environment" }
            $nsExists = kubectl get namespace $namespace 2>$null
            if ($nsExists) {
                Write-Status "✓ Namespace '$namespace' exists" "Success"
            }
            else {
                Write-Status "⚠ Namespace '$namespace' does not exist (will be created)" "Warning"
            }
        }
        else {
            Write-Status "✗ Kubernetes cluster is not accessible" "Error"
            Write-Status "  Please ensure Docker Desktop Kubernetes or Minikube is running" "Info"
        }
    }
    catch {
        Write-Status "✗ Kubernetes check failed: $_" "Error"
    }
}

# 7. Check Node.js Dependencies
Write-Host "`n7. Checking Node.js Dependencies..." -ForegroundColor Cyan
if (Test-Command "npm") {
    if (Test-File "package.json") {
        $nodeModules = Test-File "node_modules"
        if ($nodeModules) {
            Write-Status "✓ Node.js dependencies are installed" "Success"
        }
        else {
            Write-Status "⚠ Node.js dependencies not installed (run: npm install)" "Warning"
        }
    }
}

# 8. Check Ports
Write-Host "`n8. Checking Available Ports..." -ForegroundColor Cyan
$ports = @(3000, 3001, 5432, 6379, 80)
foreach ($port in $ports) {
    if (Test-Port $port) {
        Write-Status "⚠ Port $port is in use" "Warning"
    }
    else {
        Write-Status "✓ Port $port is available" "Success"
    }
}

# 9. Summary
Write-Host "`n=== Deployment Verification Summary ===" -ForegroundColor Cyan

if ($allTools) {
    Write-Host "✅ Ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Install missing tools if any"
    Write-Host "2. Run: npm install (if not done)"
    Write-Host "3. Test with: .\scripts\deploy-updated.ps1 dev all -DryRun"
    Write-Host "4. Deploy with: .\scripts\deploy-updated.ps1 dev all"
}
else {
    Write-Host "❌ Some requirements are missing" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install missing tools and run this script again" -ForegroundColor Yellow
    Write-Host "Or run: .\scripts\setup-deployment.ps1" -ForegroundColor Cyan
}

Write-Host "`n=== Verification Complete ===" -ForegroundColor Cyan
