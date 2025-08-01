#!/bin/bash

# Deployment script for Project Management System
# Usage: ./scripts/deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Load environment variables
if [[ "$ENVIRONMENT" == "production" ]]; then
    export $(cat .env.production | xargs)
    COMPOSE_FILE="docker-compose.prod.yml"
else
    export $(cat .env.staging | xargs)
    COMPOSE_FILE="docker-compose.staging.yml"
fi

echo "📦 Building Docker images..."
docker-compose -f $COMPOSE_FILE build

echo "🔄 Running database migrations..."
docker-compose -f $COMPOSE_FILE run --rm backend npm run migrate

echo "🚀 Starting services..."
docker-compose -f $COMPOSE_FILE up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🔍 Running health checks..."
# Health check for backend
if curl -f http://localhost:3001/health; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Health check for frontend
if curl -f http://localhost:3000; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
echo "📊 Services status:"
docker-compose -f $COMPOSE_FILE ps

# Send notification
if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ Deployment to $ENVIRONMENT completed successfully at $(date)\"}" \
        $SLACK_WEBHOOK_URL
fi
