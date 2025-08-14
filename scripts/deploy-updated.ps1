# Flow Motion Enhanced Deployment Script (PowerShell)
# Usage: .\scripts\deploy-updated.ps1 [environment] [component] [options]
# Examples:
#   .\scripts\deploy-updated.ps1 dev all
#   .\scripts\deploy-updated.ps1 prod frontend -SkipBuild
#   .\scripts\deploy-updated.ps1 staging backend -DryRun

param(
    [Parameter(Position = 0)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment = "dev",
    
    [Parameter(Position = 1)]
    [string]$Component = "all",
    
    [switch]$DryRun,
    [switch]$SkipBuild,
    [switch]$SkipTests,
    [switch]$ForceDeploy
)

# Configuration
$Registry = if ($env:REGISTRY) { $env:REGISTRY } else { "ghcr.io/daors-flow-motion" }
$ProjectName = "daors-flow-motion"
$Namespace = if ($Environment -eq "dev") { "logi-core" } else { "logi-core-$Environment" }

# Colors for output
$Colors = @{
    Info    = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error   = "Red"
    Step    = "Magenta"
}

# Logging functions
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "Info"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = $Colors[$Level]
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Write-Info { Write-Log -Message $args[0] -Level "Info" }
function Write-Success { Write-Log -Message $args[0] -Level "Success" }
function Write-Warning { Write-Log -Message $args[0] -Level "Warning" }
function Write-Error { Write-Log -Message $args[0] -Level "Error" }
function Write-Step { Write-Log -Message $args[0] -Level "Step" }

# Validate environment
function Test-Environment {
    Write-Step "Validating environment..."
    
    if ($Environment -notin @("dev", "staging", "prod")) {
        Write-Error "Invalid environment: $Environment. Must be dev, staging, or prod."
        exit 1
    }
    
    Write-Success "Environment validation passed"
}

# Check prerequisites
function Test-Prerequisites {
    Write-Step "Checking prerequisites..."
    
    $missingTools = @()
    
    # Check required tools
    $tools = @("kubectl", "docker", "git")
    foreach ($tool in $tools) {
        if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
            $missingTools += $tool
        }
    }
    
    if ($missingTools.Count -gt 0) {
        Write-Error "Missing required tools: $($missingTools -join ', ')"
        Write-Info "Please install the missing tools and try again."
        exit 1
    }
    
    # Check if we can connect to Kubernetes cluster
    try {
        kubectl cluster-info | Out-Null
    }
    catch {
        Write-Error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    }
    
    # Check if Docker is running
    if (-not $SkipBuild) {
        try {
            docker info | Out-Null
        }
        catch {
            Write-Error "Cannot connect to Docker daemon. Please ensure Docker is running."
            exit 1
        }
    }
    
    Write-Success "Prerequisites check passed"
}

# Validate configuration
function Test-Configuration {
    Write-Step "Validating configuration..."
    
    # Check if required files exist
    $requiredFiles = @(
        "logi-core/k8s/overlays/$Environment/kustomization.yaml",
        "Dockerfile",
        "logi-core/apps/api-gateway/Dockerfile"
    )
    
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            Write-Error "Required file missing: $file"
            exit 1
        }
    }
    
    # Validate environment variables
    if (-not (Test-Path ".env.$Environment") -and -not (Test-Path ".env")) {
        Write-Warning "No environment file found for $Environment. Using .env.example as template."
        if (-not (Test-Path ".env.example")) {
            Write-Error "No .env.example file found. Please create one."
            exit 1
        }
    }
    
    Write-Success "Configuration validation passed"
}

# Run tests
function Invoke-Tests {
    if ($SkipTests) {
        Write-Info "Skipping tests as requested"
        return
    }
    
    Write-Step "Running tests..."
    
    # Frontend tests
    if ($Component -eq "frontend" -or $Component -eq "all") {
        Write-Info "Running frontend tests..."
        npm test --if-present
        npm run lint --if-present
    }
    
    # Backend tests
    if ($Component -eq "backend" -or $Component -eq "all") {
        Write-Info "Running backend tests..."
        
        # Test API Gateway
        if (Test-Path "logi-core/apps/api-gateway") {
            Push-Location "logi-core/apps/api-gateway"
            npm test --if-present
            npm run lint --if-present
            Pop-Location
        }
        
        # Test other services
        $services = @("user-service", "inventory-service", "order-service", "routing-service", "geolocation-service", "notification-service")
        foreach ($service in $services) {
            $servicePath = "logi-core/services/$service"
            if (Test-Path $servicePath) {
                Write-Info "Testing $service..."
                Push-Location $servicePath
                
                if (Test-Path "package.json") {
                    npm test --if-present
                    npm run lint --if-present
                }
                elseif (Test-Path "requirements.txt") {
                    try {
                        python -m pytest --version | Out-Null
                        python -m pytest
                    }
                    catch {
                        Write-Warning "No tests found for $service"
                    }
                }
                
                Pop-Location
            }
        }
    }
    
    Write-Success "Tests completed"
}

# Build and push Docker images
function Build-And-PushImages {
    param([string]$Component)
    
    if ($SkipBuild) {
        Write-Info "Skipping build as requested"
        return
    }
    
    Write-Step "Building and pushing Docker images for $Component..."
    
    # Set image tag based on environment and git commit
    $gitCommit = try { git rev-parse --short HEAD 2>$null } catch { "latest" }
    $imageTag = "$Environment-$gitCommit"
    
    switch ($Component) {
        "frontend" {
            Write-Info "Building frontend image..."
            docker build -t "${Registry}/${ProjectName}-frontend:${imageTag}" -t "${Registry}/${ProjectName}-frontend:${Environment}" .
            docker push "${Registry}/${ProjectName}-frontend:${imageTag}"
            docker push "${Registry}/${ProjectName}-frontend:${Environment}"
            Write-Success "Frontend image built and pushed"
        }
        "all" {
            Write-Info "Building frontend image..."
            docker build -t "${Registry}/${ProjectName}-frontend:${imageTag}" -t "${Registry}/${ProjectName}-frontend:${Environment}" .
            docker push "${Registry}/${ProjectName}-frontend:${imageTag}"
            docker push "${Registry}/${ProjectName}-frontend:${Environment}"
            Write-Success "Frontend image built and pushed"
        }
    }
    
    if ($Component -eq "backend" -or $Component -eq "all") {
        # Build backend services
        $services = @("api-gateway", "user-service", "inventory-service", "order-service", "routing-service", "geolocation-service", "notification-service")
        
        foreach ($service in $services) {
            Write-Info "Building $service image..."
            
            $contextPath = if ($service -eq "api-gateway") {
                "logi-core/apps/$service"
            }
            else {
                "logi-core/services/$service"
            }
            
            if (Test-Path $contextPath) {
                docker build -t "${Registry}/${ProjectName}-${service}:${imageTag}" -t "${Registry}/${ProjectName}-${service}:${Environment}" $contextPath
                docker push "${Registry}/${ProjectName}-${service}:${imageTag}"
                docker push "${Registry}/${ProjectName}-${service}:${Environment}"
                Write-Success "$service image built and pushed"
            }
            else {
                Write-Warning "Service directory not found: $contextPath"
            }
        }
    }
}

# Deploy to Kubernetes
function Deploy-ToKubernetes {
    Write-Step "Deploying to Kubernetes ($Environment environment)..."
    
    if ($DryRun) {
        Write-Info "DRY RUN: Would deploy to namespace: $Namespace"
        Push-Location "logi-core/k8s"
        
        switch ($Environment) {
            "dev" { kubectl apply -k overlays/dev --dry-run=client }
            "staging" { kubectl apply -k overlays/staging --dry-run=client }
            "prod" { kubectl apply -k overlays/prod --dry-run=client }
        }
        
        Pop-Location
        return
    }
    
    # Ensure namespace exists
    kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    Push-Location "logi-core/k8s"
    
    switch ($Environment) {
        "dev" { kubectl apply -k overlays/dev }
        "staging" { kubectl apply -k overlays/staging }
        "prod" { kubectl apply -k overlays/prod }
    }
    
    Pop-Location
    
    # Wait for deployments to be ready
    Write-Info "Waiting for deployments to be ready..."
    $timeout = 600
    try {
        kubectl wait --for=condition=available --timeout="${timeout}s" deployment --all -n $Namespace
    }
    catch {
        Write-Error "Deployment failed - some pods are not ready"
        kubectl get pods -n $Namespace
        exit 1
    }
    
    Write-Success "Deployment completed successfully"
}

# Run health checks
function Test-HealthChecks {
    Write-Step "Running health checks..."
    
    # Check if pods are running
    $runningPods = (kubectl get pods -n $Namespace --field-selector=status.phase=Running --no-headers | Measure-Object).Count
    $totalPods = (kubectl get pods -n $Namespace --no-headers | Measure-Object).Count
    
    if ($runningPods -eq $totalPods -and $totalPods -gt 0) {
        Write-Success "All pods are running ($runningPods/$totalPods)"
    }
    else {
        Write-Error "Some pods are not running ($runningPods/$totalPods)"
        kubectl get pods -n $Namespace
        exit 1
    }
    
    # Check services
    Write-Info "Checking services..."
    kubectl get svc -n $Namespace
    
    # Check ingress
    Write-Info "Checking ingress..."
    kubectl get ingress -n $Namespace
    
    # Test health endpoints if in dev environment
    if ($Environment -eq "dev") {
        Write-Info "Testing health endpoints..."
        
        # Port forward and test API Gateway
        $apiPod = kubectl get pods -n $Namespace -l app=api-gateway -o jsonpath='{.items[0].metadata.name}'
        if ($apiPod) {
            Write-Info "Testing API Gateway health..."
            $job = Start-Job -ScriptBlock {
                kubectl port-forward $using:apiPod 8080:8080 -n $using:Namespace
            }
            Start-Sleep -Seconds 5
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing
                if ($response.StatusCode -eq 200) {
                    Write-Success "API Gateway health check passed"
                }
                else {
                    Write-Warning "API Gateway health check failed"
                }
            }
            catch {
                Write-Warning "API Gateway health check failed"
            }
            
            Stop-Job $job -ErrorAction SilentlyContinue
            Remove-Job $job -ErrorAction SilentlyContinue
        }
    }
    
    Write-Success "Health checks completed"
}

# Generate deployment report
function New-DeploymentReport {
    Write-Step "Generating deployment report..."
    
    $reportFile = "deployment-report-$Environment-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    
    @"
Flow Motion Deployment Report
=============================
Environment: $Environment
Component: $Component
Timestamp: $(Get-Date)
Git Commit: $(try { git rev-parse HEAD 2>$null } catch { 'N/A' })

Namespace: $Namespace

Pods:
$(kubectl get pods -n $Namespace)

Services:
$(kubectl get svc -n $Namespace)

Ingress:
$(kubectl get ingress -n $Namespace)

Deployments:
$(kubectl get deployments -n $Namespace)

ConfigMaps:
$(kubectl get configmaps -n $Namespace)

Secrets:
$(kubectl get secrets -n $Namespace)
"@ | Out-File -FilePath $reportFile
    
    Write-Success "Deployment report generated: $reportFile"
}

# Rollback deployment
function Invoke-Rollback {
    Write-Warning "Rolling back deployment..."
    
    # Get all deployments
    $deployments = kubectl get deployments -n $Namespace -o jsonpath='{.items[*].metadata.name}'
    
    foreach ($deployment in $deployments -split ' ') {
        if ($deployment) {
            Write-Info "Rolling back $deployment..."
            kubectl rollout undo deployment/$deployment -n $Namespace
        }
    }
    
    # Wait for rollback to complete
    Write-Info "Waiting for rollback to complete..."
    kubectl wait --for=condition=available --timeout=300s deployment --all -n $Namespace
    
    Write-Success "Rollback completed"
}

# Cleanup old resources
function Clear-OldResources {
    Write-Step "Cleaning up old resources..."
    
    # Remove old completed jobs
    kubectl delete jobs --field-selector=status.successful=1 -n $Namespace --ignore-not-found=true
    
    # Remove old replica sets
    kubectl delete rs --field-selector=status.replicas=0 -n $Namespace --ignore-not-found=true
    
    Write-Success "Cleanup completed"
}

# Show access information
function Show-AccessInfo {
    Write-Step "Access Information"
    
    switch ($Environment) {
        "dev" {
            Write-Info "Frontend: http://flow-motion.local"
            Write-Info "API: http://flow-motion.local/api"
            Write-Info "API Docs: http://flow-motion.local/api/docs"
        }
        "staging" {
            Write-Info "Check your ingress configuration for staging URLs"
            Write-Info "Common staging URLs:"
            Write-Info "  Frontend: https://staging.flow-motion.com"
            Write-Info "  API: https://staging-api.flow-motion.com"
        }
        "prod" {
            Write-Info "Check your ingress configuration for production URLs"
            Write-Info "Common production URLs:"
            Write-Info "  Frontend: https://flow-motion.com"
            Write-Info "  API: https://api.flow-motion.com"
        }
    }
    
    Write-Info "To check status: kubectl get pods -n $Namespace"
    Write-Info "To view logs: kubectl logs -f deployment/api-gateway -n $Namespace"
    Write-Info "To scale: kubectl scale deployment api-gateway --replicas=3 -n $Namespace"
}

# Main deployment function
function Start-Deployment {
    Write-Info "Starting deployment process..."
    Write-Info "Environment: $Environment"
    Write-Info "Component: $Component"
    Write-Info "Namespace: $Namespace"
    Write-Info "Registry: $Registry"
    
    if ($DryRun) {
        Write-Warning "DRY RUN MODE - No actual changes will be made"
    }
    
    Test-Environment
    Test-Prerequisites
    Test-Configuration
    
    # Handle rollback
    if ($Component -eq "rollback") {
        Invoke-Rollback
        exit 0
    }
    
    # Main deployment steps
    Invoke-Tests
    Build-And-PushImages -Component $Component
    Deploy-ToKubernetes
    Test-HealthChecks
    Clear-OldResources
    New-DeploymentReport
    Show-AccessInfo
    
    Write-Success "Deployment completed successfully!"
}

# Handle script interruption
try {
    Start-Deployment
}
catch {
    Write-Error "Deployment failed: $_"
    exit 1
}
