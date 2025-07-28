#!/bin/bash

# Docker Setup Test Script
# This script tests Docker configuration and container communication

echo "🐳 Testing Docker Setup..."
echo "=========================="

# Check if Docker is installed
echo "1. Checking Docker installation..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed: $(docker --version)"
else
    echo "❌ Docker is not installed"
    exit 1
fi

# Check if Docker Compose is installed
echo "2. Checking Docker Compose installation..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is installed: $(docker-compose --version)"
else
    echo "❌ Docker Compose is not installed"
    exit 1
fi

# Check if Docker daemon is running
echo "3. Checking Docker daemon status..."
if docker ps &> /dev/null; then
    echo "✅ Docker daemon is running"
else
    echo "❌ Docker daemon is not running"
    echo "   Please start Docker Desktop or Docker daemon"
    echo "   On macOS: open -a Docker"
    echo "   On Linux: sudo systemctl start docker"
    exit 1
fi

# Test docker-compose.yml syntax
echo "4. Testing docker-compose.yml syntax..."
if docker-compose config &> /dev/null; then
    echo "✅ docker-compose.yml syntax is valid"
else
    echo "❌ docker-compose.yml has syntax errors"
    docker-compose config
    exit 1
fi

# Test PostgreSQL container
echo "5. Testing PostgreSQL container..."
echo "   Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to start
echo "   Waiting for PostgreSQL to start..."
sleep 10

# Check if PostgreSQL is running
if docker-compose ps postgres | grep -q "Up"; then
    echo "✅ PostgreSQL container is running"
else
    echo "❌ PostgreSQL container failed to start"
    docker-compose logs postgres
    exit 1
fi

# Test Redis container
echo "6. Testing Redis container..."
echo "   Starting Redis container..."
docker-compose up -d redis

# Wait for Redis to start
echo "   Waiting for Redis to start..."
sleep 5

# Check if Redis is running
if docker-compose ps redis | grep -q "Up"; then
    echo "✅ Redis container is running"
else
    echo "❌ Redis container failed to start"
    docker-compose logs redis
    exit 1
fi

# Test database connection
echo "7. Testing database connection..."
if docker-compose exec postgres pg_isready -U postgres &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Test Redis connection
echo "8. Testing Redis connection..."
if docker-compose exec redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis connection successful"
else
    echo "❌ Redis connection failed"
    exit 1
fi

# Test container communication
echo "9. Testing container communication..."
if docker-compose exec postgres ping -c 1 redis &> /dev/null; then
    echo "✅ Container communication successful"
else
    echo "❌ Container communication failed"
    exit 1
fi

# Show running containers
echo "10. Current running containers:"
docker-compose ps

echo ""
echo "🎉 Docker setup test completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start backend development: docker-compose up backend"
echo "2. Start frontend development: docker-compose up frontend"
echo "3. View logs: docker-compose logs [service_name]"
echo "4. Stop all services: docker-compose down"
