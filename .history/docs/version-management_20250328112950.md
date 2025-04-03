# Version Management Guide

This document explains how to manage versions for the frontend and backend services independently in the monorepo.

## Version Structure

Each service maintains its own version number following semantic versioning (MAJOR.MINOR.PATCH):

- **Frontend**: Located in `frontend/package.json`
- **Backend**: Located in `backend/package.json`

## Version Management Commands

### 1. Frontend Version Management

```bash
# View current frontend version
npm pkg get version --workspace=frontend

# Update frontend version
npm version patch --workspace=frontend  # Increment patch version
npm version minor --workspace=frontend  # Increment minor version
npm version major --workspace=frontend  # Increment major version

# Create a new release (build + version)
npm run release:frontend
```

### 2. Backend Version Management

```bash
# View current backend version
npm pkg get version --workspace=backend

# Update backend version
npm version patch --workspace=backend  # Increment patch version
npm version minor --workspace=backend  # Increment minor version
npm version major --workspace=backend  # Increment major version

# Create a new release (build + version)
npm run release:backend
```

## Versioning Guidelines

### 1. Semantic Versioning Rules

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

### 2. Frontend Versioning

```json
{
  "name": "@vive-realestate/frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "version": "git add -A src",
    "postversion": "git push && git push --tags"
  }
}
```

### 3. Backend Versioning

```json
{
  "name": "@vive-realestate/backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "version": "git add -A src",
    "postversion": "git push && git push --tags"
  }
}
```

## Release Process

### 1. Frontend Release

1. Update version:
   ```bash
   npm version patch --workspace=frontend
   ```

2. Build the application:
   ```bash
   npm run build --workspace=frontend
   ```

3. Deploy:
   ```bash
   docker-compose --profile frontend up -d
   ```

### 2. Backend Release

1. Update version:
   ```bash
   npm version patch --workspace=backend
   ```

2. Build the application:
   ```bash
   npm run build --workspace=backend
   ```

3. Deploy:
   ```bash
   docker-compose --profile backend up -d
   ```

## CI/CD Integration

### 1. Version Tagging

Add to `.github/workflows/ci.yml`:

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

### 2. Docker Image Tagging

Update docker-compose.yml to use version tags:

```yaml
services:
  frontend:
    image: vive-realestate-frontend:${FRONTEND_VERSION:-latest}
    # ... other configurations

  backend:
    image: vive-realestate-backend:${BACKEND_VERSION:-latest}
    # ... other configurations
```

## Version History

### 1. View Version History

```bash
# View frontend version history
git log --oneline frontend/package.json

# View backend version history
git log --oneline backend/package.json
```

### 2. Rollback Versions

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
   - Document breaking changes
   - Update changelog files
   - Keep release notes

4. **Testing**
   - Test each version before deployment
   - Maintain version-specific tests
   - Document test requirements

## Changelog Management

### 1. Frontend Changelog

Create `frontend/CHANGELOG.md`:

```markdown
# Changelog

## [1.0.0] - 2024-03-20
### Added
- Initial release
- User authentication
- Property management

### Changed
- Updated UI components
- Improved performance

### Fixed
- Bug fixes
- Security patches
```

### 2. Backend Changelog

Create `backend/CHANGELOG.md`:

```markdown
# Changelog

## [1.0.0] - 2024-03-20
### Added
- Initial release
- User authentication API
- Property management API

### Changed
- Updated API endpoints
- Improved performance

### Fixed
- Bug fixes
- Security patches
``` 