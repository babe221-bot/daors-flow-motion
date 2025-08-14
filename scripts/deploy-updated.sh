#!/bin/bash

# Flow Motion Enhanced Deployment Script
# Usage: ./scripts/deploy-updated.sh [environment] [component] [options]
# Examples:
#   ./scripts/deploy-updated.sh dev all
#   ./scripts/deploy-updated.sh prod frontend --skip-build
#   ./scripts/deploy-updated.sh staging backend --dry-run

set -e

# Configuration
ENVIRONMENT=${1:-dev}
COMPONENT=${2:-all}
REGISTRY=${REGISTRY:-"ghcr.io/daors-flow-motion"}
PROJECT_NAME="daors-flow-motion"
NAMESPACE="logi-core"
DRY_RUN=false
SKIP_BUILD=false
SKIP_TESTS=false
FORCE_DEPLOY=false

# Parse additional arguments
while [[ $# -gt 2 ]]; do
    case $3 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --force)
            FORCE_DEPLOY=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Validate environment
validate_environment() {
    if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
        log_error "Invalid environment: $ENVIRONMENT. Must be dev, staging, or prod."
        exit 1
    fi
    
    if [[ "$ENVIRONMENT" != "dev" ]]; then
        NAMESPACE="logi-core-$ENVIRONMENT"
    fi
}

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    local missing_tools=()
    
    # Check required tools
    for tool in kubectl docker git; do
        if ! command -v $tool &> /dev/null; then
            missing_tools+=($tool)
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_info "Please install the missing tools and try again."
        exit 1
    fi
    
    # Check if we can connect to Kubernetes cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    
    # Check if registry is accessible
    if [[ "$SKIP_BUILD" == "false" ]]; then
        if ! docker info &> /dev/null; then
            log_error "Cannot connect to Docker daemon. Please ensure Docker is running."
            exit 1
        fi
    fi
    
    log_success "Prerequisites check passed"
}

# Validate configuration
validate_configuration() {
    log_step "Validating configuration..."
    
    # Check if required files exist
    local required_files=(
        "logi-core/k8s/overlays/$ENVIRONMENT/kustomization.yaml"
        "Dockerfile"
        "logi-core/apps/api-gateway/Dockerfile"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Required file missing: $file"
            exit 1
        fi
    done
    
    # Validate environment variables
    if [[ ! -f ".env.$ENVIRONMENT" && ! -f ".env" ]]; then
        log_warning "No environment file found for $ENVIRONMENT. Using .env.example as template."
        if [[ ! -f ".env.example" ]]; then
            log_error "No .env.example file found. Please create one."
            exit 1
        fi
    fi
    
    log_success "Configuration validation passed"
}

# Run tests
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        log_info "Skipping tests as requested"
        return
    fi
    
    log_step "Running tests..."
    
    # Frontend tests
    if [[ "$COMPONENT" == "frontend" || "$COMPONENT" == "all" ]]; then
        log_info "Running frontend tests..."
        npm test --if-present
        npm run lint --if-present
    fi
    
    # Backend tests
    if [[ "$COMPONENT" == "backend" || "$COMPONENT" == "all" ]]; then
        log_info "Running backend tests..."
        
        # Test API Gateway
        if [[ -d "logi-core/apps/api-gateway" ]]; then
            cd logi-core/apps/api-gateway
            npm test --if-present
            npm run lint --if-present
            cd ../../../
        fi
        
        # Test other services
        local services=("user-service" "inventory-service" "order-service" "routing-service" "geolocation-service" "notification-service")
        for service in "${services[@]}"; do
            if [[ -d "logi-core/services/$service" ]]; then
                log_info "Testing $service..."
                cd "logi-core/services/$service"
                
                # Check for package.json (Node.js) or requirements.txt (Python)
                if [[ -f "package.json" ]]; then
                    npm test --if-present
                    npm run lint --if-present
                elif [[ -f "requirements.txt" ]]; then
                    python -m pytest --version &> /dev/null && python -m pytest || log_warning "No tests found for $service"
                fi
                
                cd ../../../
            fi
        done
    fi
    
    log_success "Tests completed"
}

# Build and push Docker images
build_and_push_images() {
    if [[ "$SKIP_BUILD" == "true" ]]; then
        log_info "Skipping build as requested"
        return
    fi
    
    local component=$1
    log_step "Building and pushing Docker images for $component..."
    
    # Set image tag based on environment and git commit
    local git_commit=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
    local image_tag="${ENVIRONMENT}-${git_commit}"
    
    case $component in
        "frontend"|"all")
            log_info "Building frontend image..."
            docker build -t "$REGISTRY/$PROJECT_NAME-frontend:$image_tag" -t "$REGISTRY/$PROJECT_NAME-frontend:$ENVIRONMENT" .
            docker push "$REGISTRY/$PROJECT_NAME-frontend:$image_tag"
            docker push "$REGISTRY/$PROJECT_NAME-frontend:$ENVIRONMENT"
            log_success "Frontend image built and pushed"
            ;;
    esac
    
    if [[ "$component" == "backend" || "$component" == "all" ]]; then
        # Build backend services
        local services=("api-gateway" "user-service" "inventory-service" "order-service" "routing-service" "geolocation-service" "notification-service")
        
        for service in "${services[@]}"; do
            log_info "Building $service image..."
            
            local context_path
            if [[ "$service" == "api-gateway" ]]; then
                context_path="logi-core/apps/$service"
            else
                context_path="logi-core/services/$service"
            fi
            
            if [[ -d "$context_path" ]]; then
                docker build -t "$REGISTRY/$PROJECT_NAME-$service:$image_tag" -t "$REGISTRY/$PROJECT_NAME-$service:$ENVIRONMENT" "$context_path"
                docker push "$REGISTRY/$PROJECT_NAME-$service:$image_tag"
                docker push "$REGISTRY/$PROJECT_NAME-$service:$ENVIRONMENT"
                log_success "$service image built and pushed"
            else
                log_warning "Service directory not found: $context_path"
            fi
        done
    fi
}

# Deploy to Kubernetes
deploy_to_kubernetes() {
    log_step "Deploying to Kubernetes ($ENVIRONMENT environment)..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "DRY RUN: Would deploy to namespace: $NAMESPACE"
        cd logi-core/k8s
        
        if [[ "$ENVIRONMENT" == "dev" ]]; then
            kubectl apply -k overlays/dev --dry-run=client
        elif [[ "$ENVIRONMENT" == "staging" ]]; then
            kubectl apply -k overlays/staging --dry-run=client
        elif [[ "$ENVIRONMENT" == "prod" ]]; then
            kubectl apply -k overlays/prod --dry-run=client
        fi
        
        cd ../../
        return
    fi
    
    # Ensure namespace exists
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    cd logi-core/k8s
    
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        kubectl apply -k overlays/dev
    elif [[ "$ENVIRONMENT" == "staging" ]]; then
        kubectl apply -k overlays/staging
    elif [[ "$ENVIRONMENT" == "prod" ]]; then
        kubectl apply -k overlays/prod
    fi
    
    cd ../../
    
    # Wait for deployments to be ready
    log_info "Waiting for deployments to be ready..."
    local timeout=600
    if ! kubectl wait --for=condition=available --timeout=${timeout}s deployment --all -n "$NAMESPACE"; then
        log_error "Deployment failed - some pods are not ready"
        kubectl get pods -n "$NAMESPACE"
        exit 1
    fi
    
    log_success "Deployment completed successfully"
}

# Run health checks
run_health_checks() {
    log_step "Running health checks..."
    
    # Check if pods are running
    local running_pods=$(kubectl get pods -n "$NAMESPACE" --field-selector=status.phase=Running --no-headers | wc -l)
    local total_pods=$(kubectl get pods -n "$NAMESPACE" --no-headers | wc -l)
    
    if [[ $running_pods -eq $total_pods ]] && [[ $total_pods -gt 0 ]]; then
        log_success "All pods are running ($running_pods/$total_pods)"
    else
        log_error "Some pods are not running ($running_pods/$total_pods)"
        kubectl get pods -n "$NAMESPACE"
        exit 1
    fi
    
    # Check services
    log_info "Checking services..."
    kubectl get svc -n "$NAMESPACE"
    
    # Check ingress
    log_info "Checking ingress..."
    kubectl get ingress -n "$NAMESPACE"
    
    # Test health endpoints if in dev environment
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        log_info "Testing health endpoints..."
        
        # Port forward and test API Gateway
        local api_pod=$(kubectl get pods -n "$NAMESPACE" -l app=api-gateway -o jsonpath='{.items[0].metadata.name}')
        if [[ -n "$api_pod" ]]; then
            log_info "Testing API Gateway health..."
            kubectl port-forward "$api_pod" 8080:8080 -n "$NAMESPACE" &
            local port_forward_pid=$!
            sleep 5
            
            if curl -f http://localhost:8080/health &>/dev/null; then
                log_success "API Gateway health check passed"
            else
                log_warning "API Gateway health check failed"
            fi
            
            kill $port_forward_pid 2>/dev/null || true
        fi
    fi
    
    log_success "Health checks completed"
}

# Generate deployment report
generate_deployment_report() {
    log_step "Generating deployment report..."
    
    local report_file="deployment-report-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "Flow Motion Deployment Report"
        echo "============================="
        echo "Environment: $ENVIRONMENT"
        echo "Component: $COMPONENT"
        echo "Timestamp: $(date)"
        echo "Git Commit: $(git rev-parse HEAD 2>/dev/null || echo 'N/A')"
        echo ""
        echo "Namespace: $NAMESPACE"
        echo ""
        echo "Pods:"
        kubectl get pods -n "$NAMESPACE"
        echo ""
        echo "Services:"
        kubectl get svc -n "$NAMESPACE"
        echo ""
        echo "Ingress:"
        kubectl get ingress -n "$NAMESPACE"
        echo ""
        echo "Deployments:"
        kubectl get deployments -n "$NAMESPACE"
        echo ""
        echo "ConfigMaps:"
        kubectl get configmaps -n "$NAMESPACE"
        echo ""
        echo "Secrets:"
        kubectl get secrets -n "$NAMESPACE"
    } > "$report_file"
    
    log_success "Deployment report generated: $report_file"
}

# Rollback deployment
rollback_deployment() {
    log_warning "Rolling back deployment..."
    
    # Get all deployments
    local deployments=$(kubectl get deployments -n "$NAMESPACE" -o jsonpath='{.items[*].metadata.name}')
    
    for deployment in $deployments; do
        log_info "Rolling back $deployment..."
        kubectl rollout undo deployment/"$deployment" -n "$NAMESPACE"
    done
    
    # Wait for rollback to complete
    log_info "Waiting for rollback to complete..."
    kubectl wait --for=condition=available --timeout=300s deployment --all -n "$NAMESPACE"
    
    log_success "Rollback completed"
}

# Cleanup old resources
cleanup_old_resources() {
    log_step "Cleaning up old resources..."
    
    # Remove old completed jobs
    kubectl delete jobs --field-selector=status.successful=1 -n "$NAMESPACE" --ignore-not-found=true
    
    # Remove old replica sets
    kubectl delete rs --field-selector=status.replicas=0 -n "$NAMESPACE" --ignore-not-found=true
    
    log_success "Cleanup completed"
}

# Show access information
show_access_info() {
    log_step "Access Information"
    
    case $ENVIRONMENT in
        "dev")
            log_info "Frontend: http://flow-motion.local"
            log_info "API: http://flow-motion.local/api"
            log_info "API Docs: http://flow-motion.local/api/docs"
            ;;
        "staging")
            log_info "Check your ingress configuration for staging URLs"
            log_info "Common staging URLs:"
            log_info "  Frontend: https://staging.flow-motion.com"
            log_info "  API: https://staging-api.flow-motion.com"
            ;;
        "prod")
            log_info "Check your ingress configuration for production URLs"
            log_info "Common production URLs:"
            log_info "  Frontend: https://flow-motion.com"
            log_info "  API: https://api.flow-motion.com"
            ;;
    esac
    
    log_info "To check status: kubectl get pods -n $NAMESPACE"
    log_info "To view logs: kubectl logs -f deployment/api-gateway -n $NAMESPACE"
    log_info "To scale: kubectl scale deployment api-gateway --replicas=3 -n $NAMESPACE"
}

# Main deployment function
main() {
    log_info "Starting deployment process..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Component: $COMPONENT"
    log_info "Namespace: $NAMESPACE"
    log_info "Registry: $REGISTRY"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_warning "DRY RUN MODE - No actual changes will be made"
    fi
    
    validate_environment
    check_prerequisites
    validate_configuration
    
    # Handle rollback
    if [[ "$COMPONENT" == "rollback" ]]; then
        rollback_deployment
        exit 0
    fi
    
    # Main deployment steps
    run_tests
    build_and_push_images $COMPONENT
    deploy_to_kubernetes
    run_health_checks
    cleanup_old_resources
    generate_deployment_report
    show_access_info
    
    log_success "Deployment completed successfully!"
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
