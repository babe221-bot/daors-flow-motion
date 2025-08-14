# Flow Motion Deployment Guide

This guide provides comprehensive instructions for deploying the Flow Motion logistics platform in various environments, from local development to production.

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline Setup](#cicd-pipeline-setup)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Scaling Strategies](#scaling-strategies)

## Local Development Setup

### Prerequisites

- Node.js v20.x or later
- Python 3.11 or later
- npm v9.x or later
- Git

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/daors-flow-motion.git
   cd daors-flow-motion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The frontend will be available at http://localhost:5173

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd logi-core
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your service URLs:
   ```
   PORT=8080
   JWT_SECRET=dev-secret
   USER_SERVICE_URL=http://localhost:4001
   INVENTORY_SERVICE_URL=http://localhost:8000
   ORDER_SERVICE_URL=http://localhost:4003
   ROUTING_SERVICE_URL=http://localhost:4004
   GEO_SERVICE_URL=http://localhost:4005
   NOTIFY_SERVICE_URL=http://localhost:4006
   ```

3. **Start the API Gateway**:
   ```bash
   cd apps/api-gateway
   npm install
   npm run dev
   ```
   
   The API Gateway will be available at http://localhost:8080

4. **Start the User Service**:
   ```bash
   cd ../../services/user-service
   npm install
   npm run dev
   ```
   
   The User Service will be available at http://localhost:4001

5. **Start the Inventory Service**:
   ```bash
   cd ../inventory-service
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # source .venv/bin/activate  # On Unix/Linux
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
   
   The Inventory Service will be available at http://localhost:8000

6. **Start other services** following similar patterns for each service in the `services` directory.

### Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Navigate to the SQL Editor** in your Supabase dashboard

3. **Execute SQL scripts** in the following order:
   - `database/schema-fixed.sql` - Creates tables
   - `database/rls-policies.sql` - Sets up Row Level Security
   - `database/sample-data.sql` - (Optional) Adds sample data

4. **Verify tables were created** by checking the Table Editor in Supabase

## Docker Deployment

### Prerequisites

- Docker v20.x or later
- Docker Compose v2.x or later

### Deployment Steps

1. **Navigate to the backend directory**:
   ```bash
   cd logi-core
   ```

2. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

3. **Verify services are running**:
   ```bash
   docker-compose ps
   ```

4. **Access the services**:
   - API Gateway: http://localhost:8080
   - Inventory Service: http://localhost:8000/docs

### Frontend Docker Setup (Optional)

1. **Create a Dockerfile in the root directory** if not already present:
   ```dockerfile
   FROM node:20-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf** for routing:
   ```
   server {
     listen 80;
     
     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
     
     location /api/ {
       proxy_pass http://api-gateway:8080/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

3. **Build and run the frontend container**:
   ```bash
   docker build -t flow-motion-frontend .
   docker run -d -p 80:80 --name flow-motion-frontend flow-motion-frontend
   ```

4. **Access the frontend** at http://localhost

### Full Stack Docker Compose

For a complete deployment including frontend and backend:

1. **Create a docker-compose.yml in the root directory**:
   ```yaml
   version: '3.8'
   services:
     frontend:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "80:80"
       depends_on:
         - api-gateway
     
     api-gateway:
       build:
         context: ./logi-core/apps/api-gateway
       environment:
         - PORT=8080
         - JWT_SECRET=dev-secret
         - USER_SERVICE_URL=http://user-service:4001
         - INVENTORY_SERVICE_URL=http://inventory-service:8000
         - ORDER_SERVICE_URL=http://order-service:4003
         - ROUTING_SERVICE_URL=http://routing-service:4004
         - GEO_SERVICE_URL=http://geolocation-service:4005
         - NOTIFY_SERVICE_URL=http://notification-service:4006
       ports:
         - "8080:8080"
       depends_on:
         - user-service
         - inventory-service
         - order-service
         - routing-service
         - geolocation-service
         - notification-service
     
     user-service:
       build:
         context: ./logi-core/services/user-service
       environment:
         - PORT=4001
     
     inventory-service:
       image: tiangolo/uvicorn-gunicorn-fastapi:python3.11
       working_dir: /app
       volumes:
         - ./logi-core/services/inventory-service:/app
       environment:
         - PORT=8000
       command: uvicorn main:app --host 0.0.0.0 --port 8000
     
     order-service:
       build:
         context: ./logi-core/services/order-service
       environment:
         - PORT=4003
     
     routing-service:
       build:
         context: ./logi-core/services/routing-service
       environment:
         - PORT=4004
     
     geolocation-service:
       build:
         context: ./logi-core/services/geolocation-service
       environment:
         - PORT=4005
     
     notification-service:
       build:
         context: ./logi-core/services/notification-service
       environment:
         - PORT=4006
   ```

2. **Run the full stack**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application** at http://localhost

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (local or cloud-based)
- kubectl configured to access your cluster
- Helm (optional, for package management)

### Deployment Steps

1. **Navigate to the Kubernetes manifests directory**:
   ```bash
   cd logi-core/k8s
   ```

2. **Create namespace if not exists**:
   ```bash
   kubectl apply -f base/namespace.yaml
   ```

3. **Apply base configurations**:
   ```bash
   kubectl apply -k base
   ```

4. **Apply environment-specific overlay** (e.g., dev):
   ```bash
   kubectl apply -k overlays/dev
   ```

5. **Verify deployment**:
   ```bash
   kubectl get pods -n logi-core
   kubectl get svc -n logi-core
   ```

6. **Access the API Gateway**:
   ```bash
   # Get the service URL
   kubectl get svc api-gateway -n logi-core
   
   # For local clusters with NodePort
   minikube service api-gateway -n logi-core
   ```

### Frontend Kubernetes Deployment

1. **Create frontend deployment manifest** `frontend-deployment.yaml`:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: frontend
     namespace: logi-core
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: frontend
     template:
       metadata:
         labels:
           app: frontend
       spec:
         containers:
         - name: frontend
           image: flow-motion-frontend:latest
           imagePullPolicy: IfNotPresent
           ports:
           - containerPort: 80
           resources:
             requests:
               memory: "128Mi"
               cpu: "100m"
             limits:
               memory: "256Mi"
               cpu: "200m"
   ```

2. **Create frontend service manifest** `frontend-service.yaml`:
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: frontend
     namespace: logi-core
   spec:
     selector:
       app: frontend
     ports:
     - port: 80
       targetPort: 80
     type: ClusterIP
   ```

3. **Create ingress manifest** `ingress.yaml`:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: flow-motion-ingress
     namespace: logi-core
     annotations:
       nginx.ingress.kubernetes.io/rewrite-target: /
   spec:
     rules:
     - host: flow-motion.local
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: frontend
               port:
                 number: 80
         - path: /api
           pathType: Prefix
           backend:
             service:
               name: api-gateway
               port:
                 number: 8080
   ```

4. **Apply the manifests**:
   ```bash
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f frontend-service.yaml
   kubectl apply -f ingress.yaml
   ```

5. **Add host entry** to your local machine's hosts file:
   ```
   127.0.0.1 flow-motion.local
   ```

6. **Access the application** at http://flow-motion.local

## Production Deployment

### Cloud Provider Setup (Example: GCP)

1. **Create GKE cluster**:
   ```bash
   gcloud container clusters create flow-motion-cluster \
     --num-nodes=3 \
     --machine-type=e2-standard-2 \
     --region=us-central1
   ```

2. **Configure kubectl**:
   ```bash
   gcloud container clusters get-credentials flow-motion-cluster --region=us-central1
   ```

3. **Create production namespace**:
   ```bash
   kubectl create namespace logi-core-prod
   ```

4. **Set up Cloud SQL** for database:
   ```bash
   gcloud sql instances create flow-motion-db \
     --database-version=POSTGRES_13 \
     --tier=db-g1-small \
     --region=us-central1
   ```

5. **Create database and user**:
   ```bash
   gcloud sql databases create logicore --instance=flow-motion-db
   gcloud sql users create logicore-user --instance=flow-motion-db --password=secure-password
   ```

### Production Deployment Steps

1. **Set up Container Registry**:
   ```bash
   # Tag images
   docker tag flow-motion-frontend:latest gcr.io/your-project/flow-motion-frontend:latest
   docker tag api-gateway:latest gcr.io/your-project/api-gateway:latest
   
   # Push images
   docker push gcr.io/your-project/flow-motion-frontend:latest
   docker push gcr.io/your-project/api-gateway:latest
   ```

2. **Create production secrets**:
   ```bash
   kubectl create secret generic db-credentials \
     --namespace=logi-core-prod \
     --from-literal=username=logicore-user \
     --from-literal=password=secure-password
   
   kubectl create secret generic jwt-secret \
     --namespace=logi-core-prod \
     --from-literal=jwt-secret=your-production-jwt-secret
   ```

3. **Update image references** in Kubernetes manifests to use your container registry

4. **Apply production configurations**:
   ```bash
   kubectl apply -k overlays/prod
   ```

5. **Set up Cloud Load Balancer**:
   ```bash
   kubectl apply -f load-balancer.yaml
   ```

6. **Configure SSL with Let's Encrypt**:
   ```bash
   # Install cert-manager
   kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.1/cert-manager.yaml
   
   # Apply certificate issuer
   kubectl apply -f cert-issuer.yaml
   
   # Apply ingress with TLS
   kubectl apply -f secure-ingress.yaml
   ```

7. **Verify deployment**:
   ```bash
   kubectl get pods -n logi-core-prod
   kubectl get svc -n logi-core-prod
   ```

## CI/CD Pipeline Setup

### GitHub Actions Pipeline

1. **Create `.github/workflows/ci-cd.yml`**:
   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
       - name: Set up Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '20'
           cache: 'npm'
       - name: Install dependencies
         run: npm ci
       - name: Run tests
         run: npm test

     build:
       needs: test
       runs-on: ubuntu-latest
       if: github.event_name == 'push' && github.ref == 'refs/heads/main'
       steps:
       - uses: actions/checkout@v3
       - name: Set up Docker Buildx
         uses: docker/setup-buildx-action@v2
       - name: Login to Container Registry
         uses: docker/login-action@v2
         with:
           registry: gcr.io
           username: _json_key
           password: ${{ secrets.GCP_SA_KEY }}
       - name: Build and push frontend
         uses: docker/build-push-action@v4
         with:
           context: .
           push: true
           tags: gcr.io/your-project/flow-motion-frontend:latest
       - name: Build and push API Gateway
         uses: docker/build-push-action@v4
         with:
           context: ./logi-core/apps/api-gateway
           push: true
           tags: gcr.io/your-project/api-gateway:latest

     deploy:
       needs: build
       runs-on: ubuntu-latest
       if: github.event_name == 'push' && github.ref == 'refs/heads/main'
       steps:
       - uses: actions/checkout@v3
       - name: Set up kubectl
         uses: azure/setup-kubectl@v3
       - name: Set up GCloud SDK
         uses: google-github-actions/setup-gcloud@v1
         with:
           service_account_key: ${{ secrets.GCP_SA_KEY }}
           project_id: your-project
       - name: Get GKE credentials
         run: gcloud container clusters get-credentials flow-motion-cluster --region=us-central1
       - name: Deploy to GKE
         run: |
           kubectl apply -k logi-core/k8s/overlays/prod
           kubectl rollout restart deployment/frontend -n logi-core-prod
           kubectl rollout restart deployment/api-gateway -n logi-core-prod
   ```

2. **Set up GitHub Secrets**:
   - `GCP_SA_KEY`: Service account key with permissions to push to GCR and deploy to GKE

### GitLab CI/CD Pipeline

1. **Create `.gitlab-ci.yml`**:
   ```yaml
   stages:
     - test
     - build
     - deploy

   variables:
     DOCKER_DRIVER: overlay2
     DOCKER_TLS_CERTDIR: ""

   test:
     stage: test
     image: node:20
     script:
       - npm ci
       - npm test

   build:
     stage: build
     image: docker:20
     services:
       - docker:20-dind
     before_script:
       - echo $GCP_SA_KEY > /tmp/key.json
       - docker login -u _json_key --password-stdin https://gcr.io < /tmp/key.json
     script:
       - docker build -t gcr.io/your-project/flow-motion-frontend:latest .
       - docker push gcr.io/your-project/flow-motion-frontend:latest
       - docker build -t gcr.io/your-project/api-gateway:latest ./logi-core/apps/api-gateway
       - docker push gcr.io/your-project/api-gateway:latest
     only:
       - main

   deploy:
     stage: deploy
     image: google/cloud-sdk:latest
     before_script:
       - echo $GCP_SA_KEY > /tmp/key.json
       - gcloud auth activate-service-account --key-file=/tmp/key.json
       - gcloud container clusters get-credentials flow-motion-cluster --region=us-central1
     script:
       - kubectl apply -k logi-core/k8s/overlays/prod
       - kubectl rollout restart deployment/frontend -n logi-core-prod
       - kubectl rollout restart deployment/api-gateway -n logi-core-prod
     only:
       - main
   ```

2. **Set up GitLab CI/CD Variables**:
   - `GCP_SA_KEY`: Service account key with permissions to push to GCR and deploy to GKE

## Monitoring and Logging

### Prometheus and Grafana Setup

1. **Install Prometheus Operator** using Helm:
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   helm install prometheus prometheus-community/kube-prometheus-stack \
     --namespace monitoring \
     --create-namespace
   ```

2. **Create ServiceMonitor** for your services:
   ```yaml
   apiVersion: monitoring.coreos.com/v1
   kind: ServiceMonitor
   metadata:
     name: logi-core-monitor
     namespace: monitoring
   spec:
     selector:
       matchLabels:
         app: api-gateway
     namespaceSelector:
       matchNames:
         - logi-core-prod
     endpoints:
     - port: metrics
       interval: 15s
   ```

3. **Access Grafana**:
   ```bash
   kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
   ```
   
   Default credentials: admin/prom-operator

### ELK Stack for Logging

1. **Install Elasticsearch, Logstash, and Kibana** using Helm:
   ```bash
   helm repo add elastic https://helm.elastic.co
   helm repo update
   
   # Install Elasticsearch
   helm install elasticsearch elastic/elasticsearch \
     --namespace logging \
     --create-namespace
   
   # Install Kibana
   helm install kibana elastic/kibana \
     --namespace logging
   
   # Install Filebeat
   helm install filebeat elastic/filebeat \
     --namespace logging
   ```

2. **Configure Filebeat** to collect logs from your services

3. **Access Kibana**:
   ```bash
   kubectl port-forward svc/kibana-kibana 5601:5601 -n logging
   ```

## Backup and Recovery

### Database Backup Strategy

1. **Set up automated backups** for Cloud SQL:
   ```bash
   gcloud sql instances patch flow-motion-db \
     --backup-start-time=23:00 \
     --enable-bin-log
   ```

2. **Create manual backup**:
   ```bash
   gcloud sql backups create --instance=flow-motion-db
   ```

3. **Restore from backup**:
   ```bash
   gcloud sql instances restore flow-motion-db \
     --restore-instance=flow-motion-db \
     --backup-id=BACKUP_ID
   ```

### Application State Backup

1. **Export Kubernetes resources**:
   ```bash
   kubectl get all -n logi-core-prod -o yaml > logi-core-backup.yaml
   ```

2. **Back up ConfigMaps and Secrets**:
   ```bash
   kubectl get configmaps -n logi-core-prod -o yaml > configmaps-backup.yaml
   kubectl get secrets -n logi-core-prod -o yaml > secrets-backup.yaml
   ```

## Scaling Strategies

### Horizontal Pod Autoscaling

1. **Create HorizontalPodAutoscaler** for your services:
   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: api-gateway-hpa
     namespace: logi-core-prod
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: api-gateway
     minReplicas: 2
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 70
   ```

2. **Apply the HPA**:
   ```bash
   kubectl apply -f api-gateway-hpa.yaml
   ```

### Vertical Pod Autoscaling

1. **Install Vertical Pod Autoscaler**:
   ```bash
   git clone https://github.com/kubernetes/autoscaler.git
   cd autoscaler/vertical-pod-autoscaler
   ./hack/vpa-up.sh
   ```

2. **Create VerticalPodAutoscaler** for your services:
   ```yaml
   apiVersion: autoscaling.k8s.io/v1
   kind: VerticalPodAutoscaler
   metadata:
     name: api-gateway-vpa
     namespace: logi-core-prod
   spec:
     targetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: api-gateway
     updatePolicy:
       updateMode: Auto
   ```

3. **Apply the VPA**:
   ```bash
   kubectl apply -f api-gateway-vpa.yaml
   ```

### Database Scaling

1. **Upgrade Cloud SQL instance** for vertical scaling:
   ```bash
   gcloud sql instances patch flow-motion-db \
     --tier=db-custom-4-15360
   ```

2. **Set up read replicas** for horizontal scaling:
   ```bash
   gcloud sql instances create flow-motion-db-replica \
     --master-instance-name=flow-motion-db \
     --region=us-west1
   ```

3. **Configure connection pooling** with PgBouncer:
   ```bash
   # Deploy PgBouncer using Helm
   helm repo add crunchy https://crunchydata.github.io/postgres-operator-charts
   helm repo update
   helm install pgbouncer crunchy/pgbouncer \
     --namespace logi-core-prod
   ```