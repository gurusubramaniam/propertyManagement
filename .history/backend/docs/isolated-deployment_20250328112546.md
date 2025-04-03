# Isolated Deployment Guide

This document explains how to deploy the frontend and backend services independently.

## Overview

The application can be deployed in two ways:
1. **Combined Deployment**: Using the main `docker-compose.yml` file
2. **Isolated Deployment**: Deploying frontend and backend separately

## Backend Deployment

### 1. Directory Structure
```
backend/
├── Dockerfile
├── docker-compose.yml
└── ...
```

### 2. Configuration
1. Update environment variables in `backend/docker-compose.yml`:
   ```yaml
   environment:
     - DATABASE_URL=postgresql://postgres:postgres@db:5432/vive_realestate
     - JWT_SECRET=your_jwt_secret
     - JWT_EXPIRATION=24h
     - CORS_ORIGIN=http://your-frontend-domain.com
   ```

2. Start the backend services:
   ```bash
   cd backend
   docker-compose up -d
   ```

### 3. Access Points
- API: http://your-backend-domain:3001
- Swagger Documentation: http://your-backend-domain:3001/api
- Database: your-backend-domain:5432

## Frontend Deployment

### 1. Directory Structure
```
frontend/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── ...
```

### 2. Configuration
1. Update environment variables in `frontend/docker-compose.yml`:
   ```yaml
   environment:
     - NEXT_PUBLIC_API_URL=http://your-backend-domain:3001
     - BACKEND_URL=http://your-backend-domain:3001
   ```

2. Start the frontend service:
   ```bash
   cd frontend
   docker-compose up -d
   ```

### 3. Access Points
- Frontend: http://your-frontend-domain:3000

## Production Deployment

### 1. Backend Deployment

1. Set up SSL/TLS:
   ```nginx
   # Example Nginx configuration for backend
   server {
       listen 443 ssl;
       server_name api.yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. Update CORS settings:
   ```typescript
   // backend/src/main.ts
   app.enableCors({
     origin: process.env.CORS_ORIGIN,
     credentials: true
   });
   ```

### 2. Frontend Deployment

1. Set up SSL/TLS:
   ```nginx
   # Example Nginx configuration for frontend
   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://your-backend-domain:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. Update API URL in environment:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

## Security Considerations

### 1. Network Security
- Use separate networks for frontend and backend
- Configure firewall rules appropriately
- Use SSL/TLS for all communications

### 2. Environment Variables
- Use secure secrets management
- Never commit sensitive data to version control
- Use different credentials for development and production

### 3. CORS Configuration
- Restrict CORS origins to specific domains
- Use HTTPS for all cross-origin requests
- Implement proper authentication headers

## Monitoring and Maintenance

### 1. Backend Monitoring
```bash
# View logs
docker-compose logs -f backend

# Check container status
docker-compose ps

# Monitor database
docker-compose exec db psql -U postgres -d vive_realestate
```

### 2. Frontend Monitoring
```bash
# View logs
docker-compose logs -f frontend

# Check container status
docker-compose ps

# Monitor Nginx access logs
docker-compose exec frontend tail -f /var/log/nginx/access.log
```

## Scaling

### 1. Backend Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Use a load balancer (e.g., Nginx, HAProxy)
```

### 2. Frontend Scaling
```bash
# Scale frontend services
docker-compose up -d --scale frontend=3

# Use a load balancer for multiple frontend instances
```

## Backup and Recovery

### 1. Database Backup
```bash
# Create backup
docker-compose exec db pg_dump -U postgres vive_realestate > backup.sql

# Restore backup
docker-compose exec -T db psql -U postgres vive_realestate < backup.sql
```

### 2. Configuration Backup
- Backup all environment files
- Backup SSL certificates
- Backup Nginx configurations

## Troubleshooting

### 1. Common Issues
1. CORS errors:
   - Check CORS configuration in backend
   - Verify frontend API URL
   - Check SSL certificates

2. Connection issues:
   - Verify network connectivity
   - Check firewall rules
   - Verify DNS resolution

3. SSL/TLS issues:
   - Check certificate validity
   - Verify SSL configuration
   - Check certificate permissions

### 2. Debugging Tools
```bash
# Check network connectivity
docker network inspect backend-network
docker network inspect frontend-network

# View detailed logs
docker-compose logs --tail=100 backend
docker-compose logs --tail=100 frontend

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
``` 