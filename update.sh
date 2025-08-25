#!/bin/bash

# ============================================================================
# My Wedding Site - Update/Redeploy Script
# ============================================================================
# This script updates an existing deployment with new code changes
# Usage: bash update.sh [OPTIONS]
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_NAME="my-wedding-site"
APP_DIR="/var/www/${APP_NAME}"
BACKUP_DIR="/var/backups/wedding-site/updates"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "============================================================================"
    echo " $1"
    echo "============================================================================"
    echo -e "${NC}"
}

# Pre-update checks
pre_update_checks() {
    print_header "Pre-Update Checks"
    
    # Check if we're in the right directory
    if [ ! -d "$APP_DIR" ]; then
        print_error "Application directory not found: $APP_DIR"
        exit 1
    fi
    
    # Check if PM2 is running
    if ! sudo -u www-data pm2 list | grep -q "$APP_NAME"; then
        print_error "Application not running in PM2"
        exit 1
    fi
    
    # Check if Git repository exists
    if [ ! -d "$APP_DIR/.git" ]; then
        print_error "Git repository not found in $APP_DIR"
        exit 1
    fi
    
    print_status "Pre-update checks passed"
}

# Create backup before update
create_backup() {
    print_header "Creating Backup"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    mkdir -p "$BACKUP_DIR"
    
    # Backup current code
    print_status "Backing up current application..."
    tar -czf "$BACKUP_DIR/app_backup_$timestamp.tar.gz" -C "$APP_DIR" . --exclude='.git' --exclude='node_modules'
    
    # Backup database
    print_status "Backing up database..."
    sudo -u postgres pg_dump myweddingsite > "$BACKUP_DIR/db_backup_$timestamp.sql"
    
    # Save current commit hash
    cd "$APP_DIR"
    git rev-parse HEAD > "$BACKUP_DIR/commit_$timestamp.txt"
    
    print_status "Backup created: $timestamp"
    export BACKUP_TIMESTAMP="$timestamp"
}

# Update application code
update_code() {
    print_header "Updating Application Code"
    
    cd "$APP_DIR"
    
    # Fetch latest changes
    print_status "Fetching latest changes..."
    git fetch origin
    
    # Show what will be updated
    print_status "Changes to be applied:"
    git log --oneline HEAD..origin/main | head -10
    echo
    
    # Confirm update
    if [ "${AUTO_CONFIRM:-}" != "true" ]; then
        read -p "Continue with update? (y/N): " confirm
        if [[ ! $confirm =~ ^[Yy]$ ]]; then
            print_warning "Update cancelled"
            exit 0
        fi
    fi
    
    # Pull changes
    print_status "Pulling latest changes..."
    git pull origin main
    
    print_status "Code updated successfully"
}

# Update dependencies
update_dependencies() {
    print_header "Updating Dependencies"
    
    cd "$APP_DIR"
    
    # Check if package.json changed
    if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
        print_status "package.json changed, updating dependencies..."
        npm install
    else
        print_status "No dependency changes detected"
    fi
}

# Run database migrations
run_migrations() {
    print_header "Running Database Migrations"
    
    cd "$APP_DIR"
    
    # Check if schema.prisma changed
    if git diff HEAD~1 HEAD --name-only | grep -q "prisma/schema.prisma"; then
        print_status "Database schema changed, running migrations..."
        npx prisma generate
        npx prisma db push
    else
        print_status "No database changes detected"
    fi
}

# Build application
build_application() {
    print_header "Building Application"
    
    cd "$APP_DIR"
    
    print_status "Building Next.js application..."
    npm run build
    
    # Update permissions
    chown -R www-data:www-data "$APP_DIR"
    
    print_status "Build completed successfully"
}

# Restart application
restart_application() {
    print_header "Restarting Application"
    
    print_status "Restarting PM2 processes..."
    sudo -u www-data pm2 restart "$APP_NAME"
    
    # Wait for application to start
    print_status "Waiting for application to start..."
    sleep 10
    
    # Health check
    local retries=5
    while [ $retries -gt 0 ]; do
        if curl -f http://localhost:3000/health >/dev/null 2>&1; then
            print_status "Application started successfully"
            break
        else
            print_warning "Health check failed, retrying... ($retries attempts left)"
            sleep 5
            retries=$((retries - 1))
        fi
    done
    
    if [ $retries -eq 0 ]; then
        print_error "Application failed to start properly"
        print_warning "Consider rolling back using: bash update.sh --rollback $BACKUP_TIMESTAMP"
        exit 1
    fi
}

# Rollback function
rollback() {
    local backup_timestamp="$1"
    
    print_header "Rolling Back to Backup: $backup_timestamp"
    
    if [ ! -f "$BACKUP_DIR/app_backup_$backup_timestamp.tar.gz" ]; then
        print_error "Backup not found: $backup_timestamp"
        exit 1
    fi
    
    # Stop application
    print_status "Stopping application..."
    sudo -u www-data pm2 stop "$APP_NAME"
    
    # Restore code
    print_status "Restoring application code..."
    cd "$APP_DIR"
    rm -rf .next
    tar -xzf "$BACKUP_DIR/app_backup_$backup_timestamp.tar.gz"
    
    # Restore database
    print_status "Restoring database..."
    sudo -u postgres psql myweddingsite < "$BACKUP_DIR/db_backup_$backup_timestamp.sql"
    
    # Restart application
    print_status "Restarting application..."
    sudo -u www-data pm2 restart "$APP_NAME"
    
    print_status "Rollback completed successfully"
}

# Post-update cleanup
post_update_cleanup() {
    print_header "Post-Update Cleanup"
    
    # Remove old build artifacts
    cd "$APP_DIR"
    rm -rf .next/cache
    
    # Clear PM2 logs if they're too large
    if [ -f "/var/log/pm2/${APP_NAME}.log" ] && [ $(stat -c%s "/var/log/pm2/${APP_NAME}.log") -gt 10485760 ]; then
        print_status "Rotating large PM2 logs..."
        sudo -u www-data pm2 flush "$APP_NAME"
    fi
    
    # Clean old backups (keep last 5)
    if [ -d "$BACKUP_DIR" ]; then
        print_status "Cleaning old backups..."
        ls -t "$BACKUP_DIR"/app_backup_*.tar.gz | tail -n +6 | xargs -r rm
        ls -t "$BACKUP_DIR"/db_backup_*.sql | tail -n +6 | xargs -r rm
    fi
    
    print_status "Cleanup completed"
}

# Show update summary
show_summary() {
    print_header "Update Summary"
    
    cd "$APP_DIR"
    
    echo -e "${GREEN}Update completed successfully!${NC}"
    echo
    echo "Current version: $(git rev-parse --short HEAD)"
    echo "Last commit: $(git log -1 --pretty=format:'%s' HEAD)"
    echo "Author: $(git log -1 --pretty=format:'%an' HEAD)"
    echo
    echo -e "${BLUE}Application Status:${NC}"
    sudo -u www-data pm2 status "$APP_NAME"
    echo
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "View logs: sudo -u www-data pm2 logs $APP_NAME"
    echo "Rollback: bash update.sh --rollback $BACKUP_TIMESTAMP"
    echo
}

# List available backups
list_backups() {
    print_header "Available Backups"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        print_warning "No backup directory found"
        return
    fi
    
    echo "Available backups for rollback:"
    ls -la "$BACKUP_DIR"/app_backup_*.tar.gz 2>/dev/null | while read line; do
        local file=$(echo "$line" | awk '{print $9}')
        local timestamp=$(basename "$file" .tar.gz | sed 's/app_backup_//')
        local date=$(echo "$timestamp" | sed 's/_/ /' | sed 's/\(.\{8\}\)\(.\{6\}\)/\1 \2/')
        echo "  $timestamp - $date"
    done
}

# Quick deployment for development
quick_deploy() {
    print_header "Quick Development Deploy"
    
    print_status "Performing quick deployment (no backup)..."
    
    cd "$APP_DIR"
    git pull origin main
    npm run build
    sudo -u www-data pm2 restart "$APP_NAME"
    
    print_status "Quick deployment completed"
}

# Main update function
main_update() {
    pre_update_checks
    create_backup
    update_code
    update_dependencies
    run_migrations
    build_application
    restart_application
    post_update_cleanup
    show_summary
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --help, -h           Show this help message"
        echo "  --rollback TIMESTAMP Rollback to specific backup"
        echo "  --list-backups       List available backups"
        echo "  --quick              Quick deploy without backup (dev only)"
        echo "  --auto-confirm       Skip confirmation prompts"
        exit 0
        ;;
    --rollback)
        if [ -z "$2" ]; then
            print_error "Please specify backup timestamp"
            echo "Use --list-backups to see available backups"
            exit 1
        fi
        rollback "$2"
        exit 0
        ;;
    --list-backups)
        list_backups
        exit 0
        ;;
    --quick)
        quick_deploy
        exit 0
        ;;
    --auto-confirm)
        export AUTO_CONFIRM="true"
        main_update
        ;;
    "")
        main_update
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
