# Flow Motion Troubleshooting Guide

This guide provides detailed solutions for common issues you might encounter when setting up, developing, or deploying the Flow Motion logistics platform.

## Table of Contents

- [Dependency Issues](#dependency-issues)
- [Environment Configuration](#environment-configuration)
- [Database Connection Issues](#database-connection-issues)
- [API Gateway Issues](#api-gateway-issues)
- [Frontend Issues](#frontend-issues)
- [Microservices Issues](#microservices-issues)
- [Docker Issues](#docker-issues)
- [Kubernetes Issues](#kubernetes-issues)

## Dependency Issues

### Node.js Version Conflicts

**Issue**: Incompatible Node.js version

**Symptoms**:
- Error messages about unsupported JavaScript features
- Package installation failures
- Unexpected runtime errors

**Solution**:
1. Check your Node.js version:
   ```bash
   node -v
   ```

2. Install the recommended Node.js version (v20.x or later):
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20
   
   # Or download from nodejs.org
   ```

3. Verify the correct version is active:
   ```bash
   node -v
   ```

### Package Installation Failures

**Issue**: npm install fails with dependency errors

**Symptoms**:
- Error messages during `npm install`
- Missing peer dependencies
- Version conflicts

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

4. If specific packages are causing issues, try installing them with exact versions:
   ```bash
   npm install @radix-ui/react-dialog@1.1.14 --save-exact
   ```

5. For peer dependency warnings, install the required peer dependencies:
   ```bash
   npm install react@18.3.1 react-dom@18.3.1 --save-exact
   ```

### TypeScript Compilation Errors

**Issue**: TypeScript type errors or compilation failures

**Symptoms**:
- Type errors during build
- Incompatible type definitions
- Missing type declarations

**Solution**:
1. Update TypeScript and type definitions:
   ```bash
   npm install typescript@5.9.2 @types/react@19.1.9 @types/react-dom@19.1.7 --save-dev
   ```

2. Check for missing type definitions:
   ```bash
   # Example for missing leaflet types
   npm install @types/leaflet --save-dev
   ```

3. Verify tsconfig.json settings:
   ```bash
   # Make sure your tsconfig.json has appropriate settings
   # Especially check "target", "lib", and "moduleResolution"
   ```

4. Clear TypeScript cache:
   ```bash
   rm -rf node_modules/.cache/typescript
   ```

### Python Environment Issues

**Issue**: Python dependency or virtual environment problems

**Symptoms**:
- Import errors
- Module not found errors
- Version conflicts

**Solution**:
1. Create a fresh virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate
   
   # Unix/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies with specific versions:
   ```bash
   pip install -r requirements.txt
   ```

3. If a specific package is causing issues, try installing it separately:
   ```bash
   pip install fastapi==0.103.1
   ```

4. Update pip and setuptools:
   ```bash
   pip install --upgrade pip setuptools
   ```

## Environment Configuration

### Missing Environment Variables

**Issue**: Application fails due to missing environment variables

**Symptoms**:
- "Cannot read property of undefined" errors
- Connection failures
- Authentication errors

**Solution**:
1. Copy the example environment file:
   ```bash
   # For frontend
   cp .env.example .env
   
   # For backend
   cd logi-core
   cp .env.example .env
   ```

2. Fill in all required variables in the .env files:
   - Supabase URL and anon key
   - API endpoints
   - Service URLs
   - JWT secrets

3. Verify environment variables are loaded:
   ```bash
   # For frontend (add a console.log in your code)
   console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
   
   # For backend
   console.log('Environment:', process.env);
   ```

4. Restart the application after changing environment variables

### Incorrect Service URLs

**Issue**: Services cannot communicate with each other

**Symptoms**:
- Connection timeout errors
- 404 Not Found errors
- ECONNREFUSED errors

**Solution**:
1. Verify service URLs in environment files:
   ```
   # For local development
   USER_SERVICE_URL=http://localhost:4001
   
   # For Docker
   USER_SERVICE_URL=http://user-service:4001
   ```

2. Check that services are running on the expected ports:
   ```bash
   # Windows
   netstat -ano | findstr "4001"
   
   # Unix/Linux
   netstat -tulpn | grep 4001
   ```

3. Ensure network connectivity between services:
   ```bash
   # Test connection
   curl http://localhost:4001/health
   ```

## Database Connection Issues

### Supabase Connection Failures

**Issue**: Cannot connect to Supabase

**Symptoms**:
- Authentication errors
- Database query failures
- "Failed to fetch" errors

**Solution**:
1. Verify Supabase credentials in .env file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Check Supabase service status at [status.supabase.com](https://status.supabase.com)

3. Test connection with a simple query:
   ```javascript
   const { data, error } = await supabase
     .from('users')
     .select('id')
     .limit(1);
   
   console.log('Data:', data, 'Error:', error);
   ```

4. Verify your IP is not blocked by Supabase

### Missing Database Tables

**Issue**: Queries fail due to missing tables or columns

**Symptoms**:
- "relation does not exist" errors
- "column does not exist" errors
- Empty query results

**Solution**:
1. Run the database setup scripts in order:
   ```sql
   -- Execute these in Supabase SQL Editor
   -- 1. schema-fixed.sql
   -- 2. rls-policies.sql
   -- 3. sample-data.sql
   ```

2. Verify tables were created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. Check table structure:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users';
   ```

4. If tables are missing, check for SQL errors during creation

### Row Level Security Issues

**Issue**: Cannot access data due to RLS policies

**Symptoms**:
- Empty query results despite data existing
- Permission denied errors
- Authentication required errors

**Solution**:
1. Verify RLS policies are correctly set up:
   ```sql
   SELECT * FROM pg_policies;
   ```

2. Check that you're authenticated before querying:
   ```javascript
   // Make sure user is signed in
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
     console.error('User not authenticated');
     return;
   }
   
   // Then query data
   const { data, error } = await supabase.from('users').select('*');
   ```

3. Temporarily bypass RLS for testing (use with caution):
   ```javascript
   // Only for development/debugging
   const { data, error } = await supabase.rpc('admin_get_users');
   ```

## API Gateway Issues

### Service Discovery Failures

**Issue**: API Gateway cannot connect to microservices

**Symptoms**:
- 502 Bad Gateway errors
- 504 Gateway Timeout errors
- Connection refused errors in logs

**Solution**:
1. Verify all services are running:
   ```bash
   # If using Docker
   docker ps
   
   # If using Kubernetes
   kubectl get pods -n logi-core
   ```

2. Check API Gateway logs for connection errors:
   ```bash
   # If using Docker
   docker logs logi-core_api-gateway_1
   
   # If using Kubernetes
   kubectl logs deployment/api-gateway -n logi-core
   ```

3. Ensure service URLs in API Gateway configuration are correct:
   ```
   # For Docker Compose
   USER_SERVICE_URL=http://user-service:4001
   
   # For local development
   USER_SERVICE_URL=http://localhost:4001
   ```

4. Test direct connection to services:
   ```bash
   curl http://localhost:4001/health
   curl http://localhost:8000/health
   ```

### Authentication Failures

**Issue**: JWT validation errors in API Gateway

**Symptoms**:
- 401 Unauthorized errors
- "Invalid token" errors
- "Token expired" errors

**Solution**:
1. Verify JWT_SECRET is consistent across services:
   ```
   # Should be the same in all .env files
   JWT_SECRET=your-secret-key
   ```

2. Check token expiration and validity:
   ```javascript
   // Decode JWT to check expiration
   const decoded = jwt.decode(token);
   console.log('Token expires at:', new Date(decoded.exp * 1000));
   ```

3. Ensure clocks are synchronized across services

4. Regenerate tokens if needed:
   ```javascript
   const { data, error } = await supabase.auth.refreshSession();
   ```

## Frontend Issues

### Build Failures

**Issue**: Vite build process fails

**Symptoms**:
- Error messages during `npm run build`
- TypeScript compilation errors
- Module resolution errors

**Solution**:
1. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

3. Update Vite and plugins:
   ```bash
   npm install vite@5.4.19 @vitejs/plugin-react@4.7.0 --save-dev
   ```

4. Try building with verbose logging:
   ```bash
   npm run build -- --debug
   ```

### Runtime Errors

**Issue**: Application crashes or shows errors in browser

**Symptoms**:
- White screen of death
- Console errors
- React error boundaries triggered

**Solution**:
1. Check browser console for errors

2. Verify React version compatibility:
   ```bash
   npm ls react react-dom
   ```

3. Check for missing dependencies:
   ```bash
   # Install any missing peer dependencies
   npm install [missing-package]
   ```

4. Clear browser cache and local storage:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

### CORS Issues

**Issue**: Cross-Origin Resource Sharing problems

**Symptoms**:
- "Access-Control-Allow-Origin" errors in console
- API requests failing in browser but working in Postman
- Preflight request failures

**Solution**:
1. Verify API Gateway CORS configuration:
   ```javascript
   // In API Gateway code
   app.use(cors({
     origin: ['http://localhost:3000', 'https://your-production-domain.com'],
     credentials: true
   }));
   ```

2. Ensure credentials mode is properly set:
   ```javascript
   // In frontend fetch calls
   fetch(url, {
     credentials: 'include'
   });
   
   // Or in Supabase initialization
   const supabase = createClient(supabaseUrl, supabaseKey, {
     auth: {
       persistSession: true,
       autoRefreshToken: true
     }
   });
   ```

3. Check for missing headers in API responses

## Microservices Issues

### Service Startup Failures

**Issue**: Microservices fail to start

**Symptoms**:
- Process exits immediately
- Port already in use errors
- Missing dependency errors

**Solution**:
1. Check if port is already in use:
   ```bash
   # Windows
   netstat -ano | findstr "4001"
   taskkill /PID [PID] /F
   
   # Unix/Linux
   lsof -i :4001
   kill -9 [PID]
   ```

2. Verify all dependencies are installed:
   ```bash
   # For Node.js services
   npm install
   
   # For Python services
   pip install -r requirements.txt
   ```

3. Check for syntax errors in code:
   ```bash
   # For Node.js
   npx eslint src/**/*.js
   
   # For Python
   pylint *.py
   ```

4. Try running with debug logging:
   ```bash
   # For Node.js
   DEBUG=* node src/index.js
   
   # For Python
   LOGLEVEL=DEBUG uvicorn main:app
   ```

### Inter-Service Communication Failures

**Issue**: Services cannot communicate with each other

**Symptoms**:
- Timeout errors
- Connection refused errors
- 404 Not Found errors

**Solution**:
1. Verify service discovery configuration:
   ```
   # Check environment variables
   USER_SERVICE_URL=http://user-service:4001
   ```

2. Ensure services are running and healthy:
   ```bash
   # Test health endpoints
   curl http://localhost:4001/health
   curl http://localhost:8000/health
   ```

3. Check network connectivity:
   ```bash
   # In Docker
   docker network inspect logi-core_default
   
   # In Kubernetes
   kubectl get endpoints -n logi-core
   ```

4. Verify service ports are correctly exposed:
   ```bash
   # In Docker Compose
   ports:
     - "4001:4001"
   ```

## Docker Issues

### Container Build Failures

**Issue**: Docker build fails

**Symptoms**:
- Error messages during `docker build`
- Exit codes in build process
- Missing dependencies

**Solution**:
1. Check Dockerfile syntax:
   ```bash
   docker build -t test-image . --no-cache
   ```

2. Verify base image availability:
   ```bash
   docker pull node:20-alpine
   ```

3. Check for network issues during build:
   ```bash
   # Try with host network
   docker build --network=host -t test-image .
   ```

4. Increase Docker build memory:
   ```bash
   # In Docker Desktop settings
   # Increase memory allocation
   ```

### Container Runtime Issues

**Issue**: Containers exit unexpectedly or fail to start

**Symptoms**:
- Container exits with code 1
- "Exited (1)" status
- Application crashes inside container

**Solution**:
1. Check container logs:
   ```bash
   docker logs [container_id]
   ```

2. Verify environment variables:
   ```bash
   docker inspect [container_id] | grep -A 20 "Env"
   ```

3. Check for permission issues:
   ```bash
   # Fix permissions in Dockerfile
   RUN chmod +x /app/entrypoint.sh
   ```

4. Try running with interactive shell:
   ```bash
   docker run -it --rm [image_name] /bin/sh
   ```

### Docker Compose Issues

**Issue**: Docker Compose fails to start services

**Symptoms**:
- "Service failed to build" errors
- Dependency cycle errors
- Network connectivity issues

**Solution**:
1. Validate docker-compose.yml:
   ```bash
   docker-compose config
   ```

2. Rebuild all services:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

3. Check for port conflicts:
   ```bash
   # Windows
   netstat -ano | findstr "8080"
   
   # Unix/Linux
   netstat -tulpn | grep 8080
   ```

4. Verify service dependencies:
   ```yaml
   # In docker-compose.yml
   depends_on:
     - user-service
     - inventory-service
   ```

## Kubernetes Issues

### Pod Startup Failures

**Issue**: Pods fail to start or crash loop

**Symptoms**:
- CrashLoopBackOff status
- ImagePullBackOff status
- Error status

**Solution**:
1. Check pod status and events:
   ```bash
   kubectl describe pod [pod_name] -n logi-core
   ```

2. View pod logs:
   ```bash
   kubectl logs [pod_name] -n logi-core
   ```

3. Verify image exists and is accessible:
   ```bash
   # Check image pull policy
   kubectl get pod [pod_name] -n logi-core -o yaml | grep imagePullPolicy
   ```

4. Check for resource constraints:
   ```bash
   # Verify resource requests and limits
   kubectl get pod [pod_name] -n logi-core -o yaml | grep -A 8 resources
   ```

### Service Discovery Issues

**Issue**: Services cannot discover each other in Kubernetes

**Symptoms**:
- Connection timeout errors
- DNS resolution failures
- Service unavailable errors

**Solution**:
1. Verify service exists:
   ```bash
   kubectl get svc -n logi-core
   ```

2. Check endpoints:
   ```bash
   kubectl get endpoints -n logi-core
   ```

3. Test DNS resolution from another pod:
   ```bash
   kubectl run -it --rm debug --image=busybox -- nslookup user-service.logi-core.svc.cluster.local
   ```

4. Verify network policies:
   ```bash
   kubectl get networkpolicy -n logi-core
   ```

### ConfigMap and Secret Issues

**Issue**: Pods cannot access ConfigMaps or Secrets

**Symptoms**:
- Missing environment variables
- "Secret not found" errors
- Configuration missing

**Solution**:
1. Verify ConfigMap exists:
   ```bash
   kubectl get configmap -n logi-core
   ```

2. Check Secret exists:
   ```bash
   kubectl get secret -n logi-core
   ```

3. Verify mounting in pod:
   ```bash
   kubectl describe pod [pod_name] -n logi-core | grep -A 10 Volumes
   ```

4. Check environment variables in pod:
   ```bash
   kubectl exec [pod_name] -n logi-core -- env
   ```