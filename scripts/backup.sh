#!/bin/bash

# Backup script for Project Management System
# Usage: ./scripts/backup.sh [database|files|all]

set -e

BACKUP_TYPE=${1:-all}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DATABASE_URL=${DATABASE_URL:-"postgresql://postgres:password123@localhost:5432/project_management"}

echo "💾 Starting backup process..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

backup_database() {
    echo "🗄️  Creating database backup..."

    # Extract database connection details
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

    # Create database backup
    PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_DIR/database_backup_$TIMESTAMP.sql

    # Compress the backup
    gzip $BACKUP_DIR/database_backup_$TIMESTAMP.sql

    echo "✅ Database backup created: database_backup_$TIMESTAMP.sql.gz"
}

backup_files() {
    echo "📁 Creating file backup..."

    # Create file backup excluding unnecessary files
    tar -czf $BACKUP_DIR/files_backup_$TIMESTAMP.tar.gz \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=build \
        --exclude=backups \
        --exclude=.DS_Store \
        .

    echo "✅ File backup created: files_backup_$TIMESTAMP.tar.gz"
}

cleanup_old_backups() {
    echo "🧹 Cleaning up old backups (keeping last 7 days)..."

    # Remove backups older than 7 days
    find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
    find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

    echo "✅ Old backups cleaned up"
}

# Main backup logic
case $BACKUP_TYPE in
    "database")
        backup_database
        ;;
    "files")
        backup_files
        ;;
    "all")
        backup_database
        backup_files
        ;;
    *)
        echo "❌ Invalid backup type. Use 'database', 'files', or 'all'"
        exit 1
        ;;
esac

cleanup_old_backups

echo "🎉 Backup process completed successfully!"
echo "📊 Backup summary:"
ls -lh $BACKUP_DIR/

# Optional: Upload to cloud storage
if [[ -n "$AWS_ACCESS_KEY_ID" && -n "$AWS_SECRET_ACCESS_KEY" ]]; then
    echo "☁️  Uploading backups to cloud storage..."
    aws s3 cp $BACKUP_DIR/ s3://your-backup-bucket/ --recursive --exclude "*" --include "*.gz"
    echo "✅ Backups uploaded to cloud storage"
fi
