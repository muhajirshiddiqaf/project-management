# Docker Setup Guide

## 🐳 Prerequisites

### Install Docker Desktop
1. Download Docker Desktop for Mac dari https://www.docker.com/products/docker-desktop
2. Install dan launch Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

### Start Docker Daemon
Jika Docker daemon tidak running:
```bash
# Method 1: Start Docker Desktop application
open -a Docker

# Method 2: Start via launchctl
sudo launchctl start com.docker.docker

# Method 3: Check if Docker is running
docker ps
```

## 🚀 Quick Start

### 1. Start All Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres
docker-compose up -d redis
```

### 2. Check Service Status
```bash
# List running containers
docker-compose ps

# Check logs
docker-compose logs postgres
docker-compose logs backend
docker-compose logs frontend
```

### 3. Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔧 Service Configuration

### PostgreSQL Database
- **Port**: 5432
- **Database**: project_management
- **Username**: postgres
- **Password**: password123
- **Volume**: postgres_data

### Redis Cache
- **Port**: 6379
- **No authentication required** (development only)

### Backend API
- **Port**: 3001
- **Environment**: development
- **Hot reload**: enabled

### Frontend React App
- **Port**: 3000
- **Environment**: development
- **Hot reload**: enabled

## 🛠️ Troubleshooting

### Common Issues

#### 1. Docker Daemon Not Running
```bash
# Check Docker status
docker ps

# Start Docker Desktop manually
open -a Docker
```

#### 2. Port Already in Use
```bash
# Check what's using the port
lsof -i :5432
lsof -i :3000
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

#### 3. Container Build Issues
```bash
# Rebuild containers
docker-compose build --no-cache

# Clean up Docker
docker system prune -a
```

#### 4. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U postgres -d project_management
```

## 📋 Development Commands

### Database Operations
```bash
# Create database migration
docker-compose exec backend npm run migrate:create

# Run migrations
docker-compose exec backend npm run migrate:run

# Seed database
docker-compose exec backend npm run seed
```

### Backend Development
```bash
# Install dependencies
docker-compose exec backend npm install

# Run tests
docker-compose exec backend npm test

# Run linting
docker-compose exec backend npm run lint
```

### Frontend Development
```bash
# Install dependencies
docker-compose exec frontend npm install

# Run tests
docker-compose exec frontend npm test

# Build for production
docker-compose exec frontend npm run build
```

## 🔒 Security Notes

### Development Environment
- Database password is hardcoded for development
- Redis has no authentication
- JWT secret is development-only
- All services exposed on localhost

### Production Considerations
- Use environment variables for secrets
- Enable Redis authentication
- Use strong JWT secrets
- Configure proper firewall rules
- Use SSL/TLS certificates

## 📊 Monitoring

### Health Checks
```bash
# Check service health
docker-compose ps

# Monitor resource usage
docker stats
```

### Logs
```bash
# Follow logs in real-time
docker-compose logs -f

# Follow specific service
docker-compose logs -f backend
```

---

**Last Updated**: [Tanggal saat ini]
**Next Review**: [Tanggal + 1 minggu]
