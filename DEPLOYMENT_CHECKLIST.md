# 🚀 Flow Motion Deployment Checklist

## Pre-Deployment Verification

### ✅ Step 1: Run Verification Script
```powershell
.\scripts\verify-deployment.ps1
```

### ✅ Step 2: Install Prerequisites (if needed)
```powershell
.\scripts\setup-deployment.ps1
```

### ✅ Step 3: Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Update environment variables for your setup
- [ ] Verify database connection strings
- [ ] Check API endpoints configuration

## Quick Start Deployment

### 🎯 Development Environment
```powershell
# Test deployment (dry run)
.\scripts\deploy-updated.ps1 dev all -DryRun

# Deploy everything
.\scripts\deploy-updated.ps1 dev all

# Deploy specific components
.\scripts\deploy-updated.ps1 dev frontend
.\scripts\deploy-updated.ps1 dev backend
```

### 🎯 Staging Environment
```powershell
# Deploy to staging
.\scripts\deploy-updated.ps1 staging all
```

### 🎯 Production Environment
```powershell
# Deploy to production
.\scripts\deploy-updated.ps1 prod all
```

## Docker Development (Alternative)

### 🐳 Local Development with Docker
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

## Kubernetes Deployment

### 🔧 Manual Kubernetes Commands
```bash
# Apply configurations
kubectl apply -f k8s/test-deployment.yaml

# Check deployment status
kubectl get pods -n logi-core
kubectl get services -n logi-core

# View logs
kubectl logs -f deployment/flow-motion-frontend -n logi-core
kubectl logs -f deployment/flow-motion-backend -n logi-core
```

## Monitoring & Troubleshooting

### 📊 Health Checks
```bash
# Check application health
curl http://localhost:3000/health
curl http://localhost:3001/api/health

# Check Kubernetes health
kubectl get pods -n logi-core
kubectl describe pod <pod-name> -n logi-core
```

### 🔍 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Change ports in docker-compose.dev.yml |
| Docker build fails | Check Dockerfile syntax and dependencies |
| Kubernetes namespace missing | Run deployment script to create |
| Database connection failed | Verify DATABASE_URL in environment |
| Frontend can't reach backend | Check VITE_API_URL configuration |

## Rollback Procedures

### 🔄 Quick Rollback
```powershell
# Rollback to previous version
.\scripts\deploy-updated.ps1 dev all -Rollback

# Rollback specific component
.\scripts\deploy-updated.ps1 dev frontend -Rollback
```

### 🗑️ Complete Cleanup
```bash
# Remove all resources
kubectl delete namespace logi-core
docker system prune -a
```

## Environment Variables Reference

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/flowmotion

# API Configuration
VITE_API_URL=http://localhost:3001/api
PORT=3001

# Redis
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
```

## Support & Documentation

### 📚 Resources
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Verification Script](scripts/verify-deployment.ps1)
- [Setup Script](scripts/setup-deployment.ps1)

### 🆘 Getting Help
1. Run verification script: `.\scripts\verify-deployment.ps1`
2. Check logs: `kubectl logs -f <pod-name>`
3. Review deployment guide
4. Check GitHub issues

## Success Indicators

### ✅ Deployment Successful When:
- [ ] All pods are running (`kubectl get pods`)
- [ ] Services are accessible
- [ ] Frontend loads at http://localhost:3000
- [ ] API responds at http://localhost:3001/api/health
- [ ] Database connections are established
- [ ] No errors in logs

### 🎉 Congratulations!
Your Flow Motion application is now successfully deployed and ready for use!
