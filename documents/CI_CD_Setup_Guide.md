# CI/CD Setup Guide

## Overview

This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). The CI/CD pipeline is designed to ensure code quality, security, and reliable deployments across different environments.

## Workflows

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

**Triggers:**

- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

- **Lint and Format Check**: ESLint and Prettier validation
- **Test Backend**: Unit tests, integration tests, and coverage
- **Test Frontend**: React tests and build verification
- **Docker Build**: Container building and testing
- **Security Scan**: Vulnerability scanning with Trivy
- **Performance Test**: Performance testing
- **Code Quality**: SonarCloud analysis
- **Documentation Check**: Documentation validation
- **Deploy Staging**: Automatic deployment to staging (develop branch)
- **Deploy Production**: Automatic deployment to production (main branch)
- **Notify Team**: Slack notifications

### 2. Dependency Check (`dependency-check.yml`)

**Triggers:**

- Scheduled (every Monday at 2 AM)
- Push to `main` or `develop`
- Pull requests

**Jobs:**

- **Dependency Check**: Outdated packages and security vulnerabilities
- **License Check**: License compliance verification
- **Bundle Size Check**: Frontend bundle size monitoring

### 3. Release Management (`release.yml`)

**Triggers:**

- Push of version tags (`v*`)

**Jobs:**

- **Create Release**: GitHub release creation
- **Docker Release**: Docker image building and pushing

### 4. Backup (`backup.yml`)

**Triggers:**

- Scheduled (daily at 3 AM)
- Manual trigger

**Jobs:**

- **Database Backup**: PostgreSQL backup
- **File Backup**: Application files backup

### 5. Manual Deployment (`manual-deploy.yml`)

**Triggers:**

- Manual workflow dispatch

**Features:**

- Environment selection (staging/production)
- Version specification
- Health checks
- Slack notifications

## Environment Variables

### Required Secrets

Add these secrets in your GitHub repository settings:

```bash
# Docker Hub credentials
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# SonarCloud
SONAR_TOKEN=your_sonarcloud_token

# Slack notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url

# AWS credentials (for backups)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

### Environment-Specific Variables

Create these files in your repository:

#### `.env.staging`

```bash
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db:5432/project_management
JWT_SECRET=your_staging_jwt_secret
```

#### `.env.production`

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/project_management
JWT_SECRET=your_production_jwt_secret
```

## Deployment Scripts

### Automated Deployment

The CI/CD pipeline automatically deploys:

- **Staging**: When code is pushed to `develop` branch
- **Production**: When code is pushed to `main` branch

### Manual Deployment

Use the manual deployment workflow:

1. Go to GitHub Actions
2. Select "Manual Deployment"
3. Choose environment (staging/production)
4. Optionally specify version
5. Click "Run workflow"

### Local Deployment

Use the deployment script:

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

## Backup Scripts

### Automated Backup

Backups run automatically:

- **Database**: Daily at 3 AM
- **Files**: Daily at 3 AM

### Manual Backup

```bash
# Backup everything
./scripts/backup.sh all

# Backup only database
./scripts/backup.sh database

# Backup only files
./scripts/backup.sh files
```

## Code Quality Tools

### ESLint Configuration

The project uses ESLint for code linting:

- **Backend**: Node.js and Hapi.js rules
- **Frontend**: React and modern JavaScript rules

### Prettier Configuration

Code formatting is standardized with Prettier:

- Single quotes
- 80 character line width
- 2 space indentation
- Trailing commas

### Testing

#### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:coverage      # Run with coverage
npm run test:performance   # Run performance tests
```

#### Frontend Tests

```bash
cd frontend
npm test                   # Run all tests
npm test -- --coverage     # Run with coverage
```

## Security Scanning

### Trivy Vulnerability Scanner

Automatically scans for:

- Known vulnerabilities in dependencies
- Container image vulnerabilities
- Infrastructure as Code issues

### npm Audit

Checks for:

- Known vulnerabilities in npm packages
- Outdated dependencies
- Security advisories

## Monitoring and Notifications

### Slack Integration

The pipeline sends notifications for:

- Successful deployments
- Failed deployments
- Security vulnerabilities
- Performance issues

### Health Checks

Automated health checks verify:

- Backend API availability
- Frontend application loading
- Database connectivity
- Redis connectivity

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review ESLint and Prettier errors

2. **Test Failures**

   - Ensure database is running
   - Check environment variables
   - Verify test data setup

3. **Deployment Failures**

   - Check Docker configuration
   - Verify environment variables
   - Review health check endpoints

4. **Security Scan Failures**
   - Update vulnerable dependencies
   - Review security advisories
   - Check container base images

### Debugging

Enable debug mode:

```bash
# Set debug environment variable
export DEBUG=*

# Run with verbose logging
npm run start:dev -- --verbose
```

## Best Practices

### Code Quality

- Write tests for new features
- Maintain code coverage above 80%
- Follow ESLint and Prettier rules
- Document API changes

### Security

- Regularly update dependencies
- Review security scan results
- Use environment variables for secrets
- Implement proper authentication

### Deployment

- Test in staging before production
- Use blue-green deployments
- Monitor application health
- Keep backups current

### Monitoring

- Set up application monitoring
- Configure error tracking
- Monitor performance metrics
- Track user analytics

## Support

For CI/CD related issues:

1. Check GitHub Actions logs
2. Review workflow configurations
3. Verify environment variables
4. Contact the development team

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Testing Best Practices](https://reactjs.org/docs/testing.html)
