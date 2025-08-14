# Flow Motion - Complete Deployment Guide

## 🚀 Deployment Components Status

All missing deployment components have been successfully created and configured:

### ✅ Completed Components

#### 1. Frontend Dockerfile
- **Location**: `Dockerfile`
- **Features**: Multi-stage build, Nginx server, health checks, security headers
- **Status**: ✅ Complete

#### 2. Kubernetes Manifests
- **Frontend Deployment**: `logi-core/k8s/base/frontend.deployment.yaml`
- **Ingress Configuration**: `logi-core/k8s/base/ingress.yaml`
- **Development Overlay**: `logi-core/k8s/overlays/dev/`
- **Production Overlay**: `logi-core/k8s/overlays/prod/`
- **Status**: ✅ Complete

#### 3. CI/CD Pipeline
- **GitHub Actions**: `.github/workflows/ci-cd.yml`
- **Features**: 
  - Frontend/Backend testing
  - Security scanning
  - Multi-environment deployment
  - Health checks
  - Rollback capabilities
- **Status**: ✅ Complete

#### 4. Additional Infrastructure
- **Docker Compose**: `docker-compose.yml` (full stack development)
- **Nginx Configuration**: `nginx.conf`
- **Environment Files**: `.env.development`, `.env.production`
- **Deployment Scripts**: `scripts/deploy.sh`, `scripts/deploy.ps1`
- **Monitoring**: `logi-core/k8s/base/monitoring.yaml`
- **SSL/TLS**: `logi-core/k8s/base/cert-manager.yaml`
- **Status**: ✅ Complete

## 🛠 Quick Start Deployment

### Option 1: Docker Compose (Recommended for Development)
```bash
# Clone and setup
git clone <repository-url>
cd daors-flow-motion

# Copy environment variables
cp .env.example .env
cp .env.development .env.local

# Start full stack
docker-compose up --build
```

### Option 2: Kubernetes Deployment
```bash
# Development environment
./scripts/deploy.sh dev all

# Production environment
./scripts/deploy.sh prod all
```

### Option 3: Manual Kubernetes Deployment
```bash
# Build frontend image
docker build -t flow-motion-frontend:latest .

# Deploy to Kubernetes
cd logi-core/k8s
kubectl apply -k overlays/dev  # or overlays/prod
```

## 🔧 Configuration Requirements

### Environment Variables Setup

1. **Copy environment files**:
   ```bash
   cp .env.example .env
   cp .env.development .env.local  # for development
   cp .env.production .env.local   # for production
   ```

2. **Update Supabase credentials** in your environment files:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Update API endpoints**:
   ```env
   VITE_API_BASE_URL=http://localhost:8080  # development
   VITE_API_BASE_URL=https://api.your-domain.com  # production
   ```

### Kubernetes Configuration

1. **Update image registry** in `logi-core/k8s/overlays/*/kustomization.yaml`:
   ```yaml
   images:
   - name: flow-motion-frontend
     newName: your-registry/flow-motion-frontend
   ```

2. **Update domain names** in `logi-core/k8s/base/ingress.yaml`:
   ```yaml
   rules:
   - host: your-domain.com  # Replace with your domain
   ```

3. **Configure SSL certificates** in `logi-core/k8s/base/cert-manager.yaml`:
   ```yaml
   dnsNames:
   - your-domain.com
   - api.your-domain.com
   ```

## 🚦 Deployment Verification

### Health Checks
- **Frontend**: `http://your-domain/health`
- **API Gateway**: `http://your-domain/api/health`

### Monitoring
- **Prometheus**: Available via ServiceMonitor
- **Grafana**: Dashboard configuration included
- **Alerts**: PrometheusRule configured

### Logs
```bash
# Check deployment status
kubectl get pods -n logi-core

# View logs
kubectl logs -f deployment/frontend -n logi-core
kubectl logs -f deployment/api-gateway -n logi-core
```

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline automatically:

1. **Tests** frontend and backend code
2. **Builds** Docker images
3. **Scans** for security vulnerabilities
4. **Deploys** to development/production
5. **Runs** health checks
6. **Notifies** on completion

### Pipeline Triggers
- **Push to `develop`**: Deploys to development
- **Push to `main`**: Deploys to production
- **Pull requests**: Runs tests only

## 🛡 Security Features

- **Network policies** for pod-to-pod communication
- **RBAC** configurations
- **SSL/TLS** certificates via cert-manager
- **Security headers** in Nginx
- **Container scanning** in CI/CD
- **Secret management** via Kubernetes secrets

## 📊 Scaling and Performance

### Horizontal Pod Autoscaling
- **Frontend**: 1-10 replicas based on CPU/memory
- **API Gateway**: 1-15 replicas based on load
- **Automatic scaling** based on metrics

### Resource Limits
- **Development**: Lower resource limits
- **Production**: Higher limits with proper resource requests

## 🚨 Troubleshooting

### Common Issues

1. **Image pull errors**: Check registry credentials
2. **Pod startup failures**: Check environment variables
3. **Ingress not working**: Verify DNS and SSL configuration
4. **Database connection**: Check Supabase credentials

### Debug Commands
```bash
# Check pod status
kubectl describe pod <pod-name> -n logi-core

# Check events
kubectl get events -n logi-core --sort-by='.lastTimestamp'

# Port forward for local testing
kubectl port-forward svc/frontend 8080:80 -n logi-core
```

## 🎯 Next Steps

1. **Configure your domain** and SSL certificates
2. **Set up monitoring** and alerting
3. **Configure backup** strategies
4. **Set up staging** environment
5. **Configure CI/CD secrets** in GitHub

## 📞 Support

For deployment issues:
1. Check the logs using kubectl commands above
2. Verify environment variables are correctly set
3. Ensure all prerequisites are installed
4. Check network connectivity and DNS resolution

---

**Status**: 🟢 Ready for Demo Deployment

All components are now in place for a successful deployment. The project structure is complete and follows best practices for containerization, orchestration, and CI/CD.