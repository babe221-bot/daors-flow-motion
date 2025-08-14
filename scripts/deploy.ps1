# Flow Motion Deployment Script for Windows PowerShell
# Usage: .\scripts\deploy.ps1 -Environment dev -Component frontend
# Example: .\scripts\deploy.ps1 -Environment prod -Component all

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("frontend", "backend", "all", "rollback")]
    [string]$Component = "all"
)

# Configuration
$Registry = "ghcr.io/your-org"
$ProjectName = "daors-flow-motion"

# Logging functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check prerequisites
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check if kubectl is installed
    if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
        Write-Error "kubectl is not installed. Please install kubectl first."
        exit 1
    }
    
    # Check if docker is installed
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed. Please install Docker first."
        exit 1
    }
    
    # Check if we can connect to Kubernetes cluster
    try {
        kubectl cluster-info | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Cannot connect to cluster"
        }
    }
    catch {
        Write-Error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    }
    
    Write-Success "Prerequisites check passed"
}

# Build and push Docker images
function Build-AndPushImages {
    param([string]$ComponentToBuild)
    
    Write-Info "Building and pushing Docker images for $ComponentToBuild..."
    
    if ($ComponentToBuild -eq "frontend" -or $ComponentToBuild -eq "all") {
        Write-Info "Building frontend image..."
        docker build -t "$Registry/$ProjectName-frontend:$Environment" .
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to build frontend image"
            exit 1
        }
        
        docker push "$Registry/$ProjectName-frontend:$Environment"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to push frontend image"
            exit 1
        }
        
        Write-Success "Frontend image built and pushed"
    }
    
    if ($ComponentToBuild -eq "backend" -or $ComponentToBuild -eq "all") {
        $services = @("api-gateway", "user-service", "inventory-service", "order-service", "routing-service", "geolocation-service", "notification-service")
        
        foreach ($service in $services) {
            Write-Info "Building $service image..."
            
            $contextPath = if ($service -eq "api-gateway") { ".\logi-core\apps\$service" } else { ".\logi-core\services\$service" }
            
            docker build -t "$Registry/$ProjectName-$service:$Environment" $contextPath
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to build $service image"
                exit 1
            }
            
            docker push "$Registry/$ProjectName-$service:$Environment"
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to push $service image"
                exit 1
            }
            
            Write-Success "$service image built and pushed"
        }
    }
}

# Deploy to Kubernetes
function Deploy-ToKubernetes {
    Write-Info "Deploying to Kubernetes ($Environment environment)..."
    
    # Set the correct namespace
    $namespace = if ($Environment -eq "dev") { "logi-core" } else { "logi-core-$Environment" }
    
    # Apply Kubernetes manifests
    Set-Location "logi-core\k8s"
    
    try {
        switch ($Environment) {
            "dev" { kubectl apply -k overlays/dev }
            "staging" { kubectl apply -k overlays/staging }
            "prod" { kubectl apply -k overlays/prod }
        }
        
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to apply Kubernetes manifests"
        }
    }
    catch {
        Write-Error "Failed to deploy to Kubernetes: $_"
        Set-Location "..\..\"
        exit 1
    }
    
    # Wait for deployments to be ready
    Write-Info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=600s deployment --all -n $namespace
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Deployment completed successfully"
    } else {
        Write-Error "Deployment failed or timed out"
        Set-Location "..\..\"
        exit 1
    }
    
    Set-Location "..\..\"
}

# Run health checks
function Test-HealthChecks {
    $namespace = if ($Environment -eq "dev") { "logi-core" } else { "logi-core-$Environment" }
    
    Write-Info "Running health checks..."
    
    # Check if pods are running
    $runningPods = kubectl get pods -n $namespace --no-headers | Where-Object { $_ -match "Running" }
    if ($runningPods) {
        Write-Success "Pods are running"
    } else {
        Write-Error "Some pods are not running"
        kubectl get pods -n $namespace
        exit 1
    }
    
    # Check services
    Write-Info "Checking services..."
    kubectl get svc -n $namespace
    
    Write-Success "Health checks completed"
}

# Rollback deployment
function Invoke-Rollback {
    Write-Warning "Rolling back deployment..."
    
    $namespace = if ($Environment -eq "dev") { "logi-core" } else { "logi-core-$Environment" }
    
    # Get all deployments and rollback
    $deployments = kubectl get deployments -n $namespace -o jsonpath='{.items[*].metadata.name}' | ForEach-Object { $_.Split(' ') }
    
    foreach ($deployment in $deployments) {
        if ($deployment) {
            Write-Info "Rolling back $deployment..."
            kubectl rollout undo deployment/$deployment -n $namespace
        }
    }
    
    Write-Success "Rollback completed"
}

# Main deployment function
function Start-Deployment {
    Write-Info "Starting deployment process..."
    Write-Info "Environment: $Environment"
    Write-Info "Component: $Component"
    
    Test-Prerequisites
    
    # Handle rollback
    if ($Component -eq "rollback") {
        Invoke-Rollback
        return
    }
    
    # Build and push images
    Build-AndPushImages $Component
    
    # Deploy to Kubernetes
    Deploy-ToKubernetes
    
    # Run health checks
    Test-HealthChecks
    
    Write-Success "Deployment completed successfully!"
    
    # Show access information
    $namespace = if ($Environment -eq "dev") { "logi-core" } else { "logi-core-$Environment" }
    
    Write-Info "Access information:"
    if ($Environment -eq "dev") {
        Write-Info "Frontend: http://flow-motion.local"
        Write-Info "API: http://flow-motion.local/api"
    } else {
        Write-Info "Check your ingress configuration for access URLs"
    }
    
    Write-Info "To check status: kubectl get pods -n $namespace"
    Write-Info "To view logs: kubectl logs -f deployment/frontend -n $namespace"
}

# Error handling
trap {
    Write-Error "Deployment interrupted: $_"
    exit 1
}

# Run main function
Start-Deployment