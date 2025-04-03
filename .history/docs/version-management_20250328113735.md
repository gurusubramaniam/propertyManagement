# Version Management Guide

This document explains how version management works in the Vive Real Estate monorepo, which contains both frontend and backend services.

## Monorepo Structure

The project is organized as a monorepo using npm workspaces:

```
vive-realestate/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend application
├── package.json       # Root package.json with workspace configuration
└── docker-compose.yml # Docker configuration for all services
```

## Release Process

### 1. Pre-release Checklist

Before starting the release process, ensure:

1. **Code Quality**
   ```bash
   # Run linting
   npm run lint

   # Run tests
   npm run test

   # Check for any uncommitted changes
   git status
   ```

2. **Dependencies**
   ```bash
   # Update dependencies
   npm update

   # Check for outdated packages
   npm outdated
   ```

3. **Documentation**
   - Update CHANGELOG.md files
   - Review API documentation
   - Update README if needed

### 2. Frontend Release Process

1. **Update Version**
   ```bash
   # Increment patch version (e.g., 1.0.0 -> 1.0.1)
   npm run version:frontend

   # Or increment minor version (e.g., 1.0.0 -> 1.1.0)
   npm run version:frontend:minor

   # Or increment major version (e.g., 1.0.0 -> 2.0.0)
   npm run version:frontend:major
   ```

2. **Build Application**
   ```bash
   # Build frontend
   npm run build:frontend
   ```

3. **Test Build**
   ```bash
   # Start production build locally
   npm run start:frontend
   ```

4. **Create Release**
   ```bash
   # Create release (builds and versions)
   npm run release:frontend
   ```

5. **Deploy**
   ```bash
   # Deploy with specific version
   FRONTEND_VERSION=$(npm pkg get version --workspace=frontend | tr -d '"') docker-compose up -d frontend
   ```

### 3. Backend Release Process

1. **Update Version**
   ```bash
   # Increment patch version (e.g., 1.0.0 -> 1.0.1)
   npm run version:backend

   # Or increment minor version (e.g., 1.0.0 -> 1.1.0)
   npm run version:backend:minor

   # Or increment major version (e.g., 1.0.0 -> 2.0.0)
   npm run version:backend:major
   ```

2. **Build Application**
   ```bash
   # Build backend
   npm run build:backend
   ```

3. **Database Migrations**
   ```bash
   # Generate migration if needed
   npm run typeorm migration:generate --workspace=backend

   # Run migrations
   npm run typeorm migration:run --workspace=backend
   ```

4. **Test Build**
   ```bash
   # Start production build locally
   npm run start:backend
   ```

5. **Create Release**
   ```bash
   # Create release (builds and versions)
   npm run release:backend
   ```

6. **Deploy**
   ```bash
   # Deploy with specific version
   BACKEND_VERSION=$(npm pkg get version --workspace=backend | tr -d '"') docker-compose up -d backend
   ```

### 4. Combined Release Process

To release both services together:

1. **Update Both Versions**
   ```bash
   # Update frontend version
   npm run version:frontend

   # Update backend version
   npm run version:backend
   ```

2. **Build Both Services**
   ```bash
   # Build both services
   npm run build
   ```

3. **Create Releases**
   ```bash
   # Create releases for both services
   npm run release:frontend
   npm run release:backend
   ```

4. **Deploy Both Services**
   ```bash
   # Deploy both services with their versions
   FRONTEND_VERSION=$(npm pkg get version --workspace=frontend | tr -d '"') \
   BACKEND_VERSION=$(npm pkg get version --workspace=backend | tr -d '"') \
   docker-compose up -d
   ```

### 5. Post-release Steps

1. **Verify Deployment**
   ```bash
   # Check service status
   docker-compose ps

   # Check logs
   docker-compose logs -f
   ```

2. **Health Checks**
   ```bash
   # Frontend health check
   curl http://localhost:3000/api/health

   # Backend health check
   curl http://localhost:3001/api/health
   ```

3. **Documentation**
   - Update release notes
   - Tag the release in git
   ```bash
   # Create git tags
   git tag -a "frontend-v$(npm pkg get version --workspace=frontend | tr -d '"')" -m "Frontend release"
   git tag -a "backend-v$(npm pkg get version --workspace=backend | tr -d '"')" -m "Backend release"
   
   # Push tags
   git push --tags
   ```

## Rollback Process

### 1. Frontend Rollback

```bash
# Stop current version
docker-compose stop frontend

# Deploy previous version
FRONTEND_VERSION=1.0.0 docker-compose up -d frontend
```

### 2. Backend Rollback

```bash
# Stop current version
docker-compose stop backend

# Rollback database if needed
npm run typeorm migration:revert --workspace=backend

# Deploy previous version
BACKEND_VERSION=1.0.0 docker-compose up -d backend
```

## Version Management Commands

### Frontend Commands
```bash
# View current version
npm pkg get version --workspace=frontend

# Update version
npm run version:frontend        # Patch
npm run version:frontend:minor  # Minor
npm run version:frontend:major  # Major

# Release
npm run release:frontend        # Build + patch
npm run release:frontend:minor  # Build + minor
npm run release:frontend:major  # Build + major
```

### Backend Commands
```bash
# View current version
npm pkg get version --workspace=backend

# Update version
npm run version:backend        # Patch
npm run version:backend:minor  # Minor
npm run version:backend:major  # Major

# Release
npm run release:backend        # Build + patch
npm run release:backend:minor  # Build + minor
npm run release:backend:major  # Build + major
```

## Best Practices

1. **Version Control**
   - Always commit version changes
   - Use meaningful commit messages
   - Tag releases in git

2. **Deployment**
   - Deploy specific versions in production
   - Use version tags for Docker images
   - Maintain version history

3. **Documentation**
   - Update changelog files for each service
   - Document breaking changes
   - Keep release notes

4. **Testing**
   - Test each version before deployment
   - Maintain version-specific tests
   - Document test requirements

## Changelog Management

Each service maintains its own changelog file:

- `frontend/CHANGELOG.md`: Frontend-specific changes
- `backend/CHANGELOG.md`: Backend-specific changes

The changelogs follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and include:
- Version numbers
- Release dates
- Added features
- Changed functionality
- Fixed bugs
- Security updates

## CI/CD Integration

The version management system can be integrated with CI/CD pipelines by:

1. Adding version management steps to your CI workflow
2. Automating version updates based on git tags
3. Triggering builds and deployments for specific versions

Example CI workflow addition:
```yaml
jobs:
  version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - name: Create version tags
        run: |
          if [[ ${{ github.ref }} == 'refs/heads/main' ]]; then
            npm run release:frontend
            npm run release:backend
          fi
``` 