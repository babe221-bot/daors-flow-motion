# Flow Motion Logistics Platform

A comprehensive logistics management platform with a modern React frontend and microservices backend architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Database Setup](#database-setup)
- [Deployment Options](#deployment-options)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
  - [Kubernetes Deployment](#kubernetes-deployment)
- [Common Issues & Troubleshooting](#common-issues--troubleshooting)
  - [Dependency Issues](#dependency-issues)
  - [Environment Configuration](#environment-configuration)
  - [Database Connection Issues](#database-connection-issues)
  - [API Gateway Issues](#api-gateway-issues)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)

## Overview

Flow Motion is a modern logistics platform designed to streamline operations for transportation and logistics companies. The platform consists of:

- **Frontend**: React-based UI with Vite, TypeScript, and Tailwind CSS
- **Backend**: Microservices architecture with Node.js and Python services
- **Database**: PostgreSQL with Supabase integration
- **Infrastructure**: Docker containers and Kubernetes orchestration

## System Architecture

```
┌─────────────────┐      ┌───────────────────────────────────┐
│                 │      │            LogiCore               │
│   Flow Motion   │      │  ┌─────────┐      ┌────────────┐  │
│    Frontend     │──────┼─▶│   API   │──────▶ User Service│  │
│  (React + Vite) │      │  │ Gateway │      └────────────┘  │
│                 │      │  └─────────┘            │         │
└─────────────────┘      │        │                │         │
                         │        ▼                ▼         │
┌─────────────────┐      │  ┌─────────────┐  ┌────────────┐  │
│                 │      │  │ Inventory   │  │ Order      │  │
│    Supabase     │◀─────┼──│ Service     │  │ Service    │  │
│   (Database)    │      │  │ (FastAPI)   │  │            │  │
│                 │      │  └─────────────┘  └────────────┘  │
└─────────────────┘      │        │                │         │
                         │        ▼                ▼         │
                         │  ┌─────────────┐  ┌────────────┐  │
                         │  │ Geolocation │  │ Routing    │  │
                         │  │ Service     │  │ Service    │  │
                         │  └─────────────┘  └────────────┘  │
                         │                                   │
                         └───────────────────────────────────┘
```

## Prerequisites

- **Node.js**: v20.x or later
- **Python**: v3.11 or later
- **Docker**: Latest version (for containerized deployment)
- **Kubernetes**: Latest version (for orchestrated deployment)
- **npm**: v9.x or later
- **Supabase Account**: For database setup

## Getting Started

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
   Edit the `.env` file with your Supabase credentials and other configuration.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd logi-core
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your service URLs and other configuration.

3. **Start the API Gateway**:
   ```bash
   cd apps/api-gateway
   npm install
   npm run dev
   ```

4. **Start the User Service**:
   ```bash
   cd ../../services/user-service
   npm install
   npm run dev
   ```

5. **Start the Inventory Service**:
   ```bash
   cd ../inventory-service
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # source .venv/bin/activate  # On Unix/Linux
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

### Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Execute SQL scripts** in the following order:
   - `database/schema-fixed.sql` - Creates tables
   - `database/rls-policies.sql` - Sets up Row Level Security
   - `database/sample-data.sql` - (Optional) Adds sample data

3. **Update environment variables** with your Supabase URL and anon key

## Deployment Options

### Local Development

For local development, follow the setup instructions above for frontend and backend.

### Docker Deployment

1. **Build and run the entire stack**:
   ```bash
   cd logi-core
   docker-compose up --build
   ```

2. **Access the services**:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Inventory Service: http://localhost:8000/docs

### Kubernetes Deployment

1. **Apply Kubernetes manifests**:
   ```bash
   cd logi-core/k8s
   kubectl apply -k overlays/dev
   ```

2. **Verify deployment**:
   ```bash
   kubectl get pods -n logi-core
   ```

## Common Issues & Troubleshooting

### Dependency Issues

**Issue**: Package version conflicts or missing dependencies

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check for outdated packages:
   ```bash
   npm outdated
   ```

4. If specific packages are causing issues, try installing them separately:
   ```bash
   npm install [package-name]@[version]
   ```

### Environment Configuration

**Issue**: Application fails to connect to services or database

**Solution**:
1. Verify all environment variables are correctly set in `.env` files
2. For Supabase, ensure the URL and anon key are correct
3. Check that service URLs match the actual running services
4. For local development, make sure ports are not in use by other applications

### Database Connection Issues

**Issue**: Cannot connect to Supabase or database errors

**Solution**:
1. Verify Supabase credentials in `.env` file
2. Check that all required tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
3. Verify RLS policies are correctly set up:
   ```sql
   SELECT * FROM pg_policies;
   ```
4. Check for network issues or firewall restrictions

### API Gateway Issues

**Issue**: Services not accessible through API Gateway

**Solution**:
1. Verify all services are running:
   ```bash
   docker ps  # If using Docker
   # or
   kubectl get pods -n logi-core  # If using Kubernetes
   ```
2. Check API Gateway logs for connection errors:
   ```bash
   docker logs logi-core_api-gateway_1  # If using Docker
   # or
   kubectl logs deployment/api-gateway -n logi-core  # If using Kubernetes
   ```
3. Ensure service URLs in API Gateway configuration are correct
4. Check for CORS issues if accessing from frontend

## Performance Optimization

1. **Frontend Optimization**:
   - Enable production builds with `npm run build`
   - Use code splitting for large components
   - Implement lazy loading for routes
   - Optimize images and assets

2. **Backend Optimization**:
   - Scale services horizontally in Kubernetes
   - Implement caching for frequently accessed data
   - Use connection pooling for database connections
   - Monitor and optimize database queries

## Security Considerations

1. **Authentication**:
   - Supabase handles authentication securely
   - JWT tokens are used for service-to-service communication
   - Implement proper token validation in all services

2. **Authorization**:
   - Row Level Security (RLS) in Supabase controls data access
   - API Gateway validates permissions before forwarding requests
   - Implement role-based access control (RBAC)

3. **Data Protection**:
   - Use HTTPS for all communications
   - Encrypt sensitive data at rest
   - Implement proper input validation to prevent injection attacks

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request