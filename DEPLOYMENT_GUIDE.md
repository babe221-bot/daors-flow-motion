# Flow Motion Deployment Guide

## Quick Start

### Prerequisites
- Docker Desktop
- kubectl (Kubernetes CLI)
- PowerShell (Windows) or Bash (Linux/Mac)
- Git

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/babe221-bot/daors-flow-motion.git
cd daors-flow-motion

# Install dependencies
npm install
```

### 2. Local Development

```bash
# Start local development
npm run dev

# Or use Docker Compose
docker-compose up
```

### 3. Deploy to Kubernetes

#### Using PowerShell (Windows)
```powershell
# Deploy to development
.\scripts\deploy-updated.ps1 dev all

# Deploy to staging
.\scripts\deploy-updated.ps1 staging all

# Deploy to production
.\scripts\deploy-updated.ps1 prod all
```

#### Using Bash (Linux/Mac)
```bash
# Deploy to development
./scripts/deploy-updated.sh dev all

# Deploy to staging
./scripts/deploy-updated.sh staging all

# Deploy to production
./scripts/deploy-updated.sh prod all
```

### 4. Deployment Options

#### Dry Run (Preview changes)
```powershell
.\scripts\deploy-updated.ps1 dev all -DryRun
```

#### Skip Tests
```powershell
.\scripts\deploy-updated.ps1 dev all -SkipTests
```

#### Skip Build
```powershell
.\scripts\deploy-updated.ps1 dev all -SkipBuild
```

#### Rollback
```powershell
.\scripts\deploy-updated.ps1 dev rollback
```

### 5. Environment Configuration

#### Development (.env.development)
```env
VITE_API_URL=http://flow-motion.local/api
VITE_ENVIRONMENT=development
```

#### Staging (.env.staging)
```env
VITE_API_URL=https://staging-api.flow-motion.com
VITE_ENVIRONMENT=staging
```

#### Production (.env.production)
```env
VITE_API_URL=https://api.flow-motion.com
VITE_ENVIRONMENT=production
```

### 6. Access URLs

#### Development
- Frontend: http://flow-motion.local
- API: http://flow-motion.local/api
- API Docs: http://flow-motion.local/api/docs

#### Staging/Production
- Check your ingress configuration for actual URLs

### 7. Monitoring

```bash
# Check deployment status
kubectl get pods -n logi-core

# View logs
kubectl logs -f deployment/api-gateway -n logi-core

# Scale services
kubectl scale deployment api-gateway --replicas=3 -n logi-core
```

### 8. Troubleshooting

#### Common Issues

1. **Docker not running**
   ```bash
   # Start Docker Desktop
   docker info
   ```

2. **kubectl not connected**
   ```bash
   # Check cluster connection
   kubectl cluster-info
   ```

3. **Namespace issues**
   ```bash
   # Create namespace manually
   kubectl create namespace logi-core
   ```

4. **Image pull issues**
   ```bash
   # Check image availability
   docker images | grep daors-flow-motion
   ```

### 9. Health Checks

The deployment includes automatic health checks:
- Pod status verification
- Service endpoint testing
- API health endpoint validation

### 10. Cleanup

```bash
# Remove all resources
kubectl delete namespace logi-core

# Clean Docker images
docker system prune -a
```

## Support

For deployment issues:
1. Check the deployment report generated after each deployment
2. Review logs with `kubectl logs`
3. Check the troubleshooting guide in TROUBLESHOOTING.md
