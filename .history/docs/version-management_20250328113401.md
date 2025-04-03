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

## Version Management Overview

Each service (frontend and backend) maintains its own version number following semantic versioning (MAJOR.MINOR.PATCH). The root `package.json` provides scripts to manage versions independently.

### Available Version Commands

```bash
# Frontend Version Management
npm run version:frontend        # Increment patch version
npm run version:frontend:minor  # Increment minor version
npm run version:frontend:major  # Increment major version

# Backend Version Management
npm run version:backend        # Increment patch version
npm run version:backend:minor  # Increment minor version
npm run version:backend:major  # Increment major version
```

### Release Process

The release process combines building and versioning:

```bash
# Frontend Release
npm run release:frontend        # Build + patch version
npm run release:frontend:minor  # Build + minor version
npm run release:frontend:major  # Build + major version

# Backend Release
npm run release:backend        # Build + patch version
npm run release:backend:minor  # Build + minor version
npm run release:backend:major  # Build + major version
```

## Semantic Versioning Rules

- **MAJOR** version (X.0.0):
  - Breaking changes in API
  - Major feature additions
  - Incompatible changes

- **MINOR** version (0.X.0):
  - New features (backwards compatible)
  - API enhancements
  - Deprecation notices

- **PATCH** version (0.0.X):
  - Bug fixes
  - Performance improvements
  - Documentation updates

## Docker Integration

The Docker setup supports versioned deployments through environment variables:

```bash
# Deploy specific versions
FRONTEND_VERSION=1.0.0 BACKEND_VERSION=1.0.0 docker-compose up -d

# Deploy latest versions
docker-compose up -d
```

The `docker-compose.yml` configuration uses these version tags:
```yaml
services:
  frontend:
    image: vive-realestate-frontend:${FRONTEND_VERSION:-latest}
    # ...

  backend:
    image: vive-realestate-backend:${BACKEND_VERSION:-latest}
    # ...
```

## Version History and Rollback

### View Version History
```bash
# View frontend version history
git log --oneline frontend/package.json

# View backend version history
git log --oneline backend/package.json
```

### Rollback to Previous Version
```bash
# Rollback frontend version
git checkout <commit-hash> frontend/package.json
npm install --workspace=frontend

# Rollback backend version
git checkout <commit-hash> backend/package.json
npm install --workspace=backend
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