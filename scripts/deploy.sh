#!/bin/bash

# Flow Motion Deployment Script
# Usage: ./scripts/deploy.sh [environment] [component]
# Example: ./scripts/deploy.sh dev frontend
# Example: ./scripts/deploy.sh prod all

set -e

# Configuration
ENVIRONMENT=${1:-dev}
COMPONENT=${2:-all}
REGISTRY="ghcr.io/your-org"
PROJECT_NAME="daors-flow-motion"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Validate environment
validate_environment() {
    if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
        log_error "Invalid environment: $ENVIRONMENT. Must be dev, staging, or prod."
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if we can connect to Kubernetes cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Build and push Docker images
build_and_push_images() {
    local component=$1
    log_info "Building and pushing Docker images for $component..."
    
    case $component in
        "frontend"|"all")
            log_info "Building frontend image..."
            docker build -t $REGISTRY/$PROJECT_NAME-frontend:$ENVIRONMENT .
            docker push $REGISTRY/$PROJECT_NAME-frontend:$ENVIRONMENT
            log_success "Frontend image built and pushed"
            ;;
    esac
    
    if [[ "$component" == "backend" || "$component" == "all" ]]; then
        # Build backend services
        services=("api-gateway" "user-service" "inventory-service" "order-service" "routing-service" "geolocation-service" "notification-service")
        
        for service in "${services[@]}"; do
            log_info "Building $service image..."
            if [[ "$service" == "api-gateway" ]]; then
                docker build -t $REGISTRY/$PROJECT_NAME-$service:$ENVIRONMENT ./logi-core/apps/$service
            else
                docker build -t $REGISTRY/$PROJECT_NAME-$service:$ENVIRONMENT ./logi-core/services/$service
            fi
            docker push $REGISTRY/$PROJECT_NAME-$service:$ENVIRONMENT
            log_success "$service image built and pushed"
        done
    fi
}

# Deploy to Kubernetes
deploy_to_kubernetes() {
    log_info "Deploying to Kubernetes ($ENVIRONMENT environment)..."
    
    # Set the correct namespace
    local namespace="logi-core"
    if [[ "$ENVIRONMENT" != "dev" ]]; then
        namespace="logi-core-$ENVIRONMENT"
    fi
    
    # Apply Kubernetes manifests
    cd logi-core/k8s
    
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        kubectl apply -k overlays/dev
    elif [[ "$ENVIRONMENT" == "staging" ]]; then
        kubectl apply -k overlays/staging
    elif [[ "$ENVIRONMENT" == "prod" ]]; then
        kubectl apply -k overlays/prod
    fi
    
    # Wait for deployments to be ready
    log_info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=600s deployment --all -n $namespace
    
    log_success "Deployment completed successfully"
}

# Run health checks
run_health_checks() {
    local namespace="logi-core"
    if [[ "$ENVIRONMENT" != "dev" ]]; then
        namespace="logi-core-$ENVIRONMENT"
    fi
    
    log_info "Running health checks..."
    
    # Check if pods are running
    if kubectl get pods -n $namespace | grep -q "Running"; then
        log_success "Pods are running"
    else
        log_error "Some pods are not running"
        kubectl get pods -n $namespace
        exit 1
    fi
    
    # Check services
    log_info "Checking services..."
    kubectl get svc -n $namespace
    
    # Test frontend health endpoint
    if kubectl get svc frontend -n $namespace &> /dev/null; then
        log_info "Frontend service found"
        # Port forward and test (for local testing)
        if [[ "$ENVIRONMENT" == "dev" ]]; then
            kubectl port-forward svc/frontend 8080:80 -n $namespace &
            sleep 5
            if curl -f http://localhost:8080/health &> /dev/null; then
                log_success "Frontend health check passed"
            else
                log_warning "Frontend health check failed"
            fi
            pkill -f "kubectl port-forward"
        fi
    fi
    
    log_success "Health checks completed"
}

# Rollback deployment
rollback_deployment() {
    log_warning "Rolling back deployment..."
    
    local namespace="logi-core"
    if [[ "$ENVIRONMENT" != "dev" ]]; then
        namespace="logi-core-$ENVIRONMENT"
    fi
    
    # Rollback all deployments
    deployments=$(kubectl get deployments -n $namespace -o jsonpath='{.items[*].metadata.name}')
    for deployment in $deployments; do
        log_info "Rolling back $deployment..."
        kubectl rollout undo deployment/$deployment -n $namespace
    done
    
    log_success "Rollback completed"
}

# Main deployment function
main() {
    log_info "Starting deployment process..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Component: $COMPONENT"
    
    validate_environment
    check_prerequisites
    
    # Handle rollback
    if [[ "$COMPONENT" == "rollback" ]]; then
        rollback_deployment
        exit 0
    fi
    
    # Build and push images
    build_and_push_images $COMPONENT
    
    # Deploy to Kubernetes
    deploy_to_kubernetes
    
    # Run health checks
    run_health_checks
    
    log_success "Deployment completed successfully!"
    
    # Show access information
    local namespace="logi-core"
    if [[ "$ENVIRONMENT" != "dev" ]]; then
        namespace="logi-core-$ENVIRONMENT"
    fi
    
    log_info "Access information:"
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        log_info "Frontend: http://flow-motion.local"
        log_info "API: http://flow-motion.local/api"
    else
        log_info "Check your ingress configuration for access URLs"
    fi
    
    log_info "To check status: kubectl get pods -n $namespace"
    log_info "To view logs: kubectl logs -f deployment/frontend -n $namespace"
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"