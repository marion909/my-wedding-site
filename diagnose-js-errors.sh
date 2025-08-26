#!/bin/bash

# ============================================================================
# JavaScript Error Diagnosis Script
# ============================================================================
# This script helps diagnose JavaScript runtime errors in production builds
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

APP_DIR="/var/www/my-wedding-site"

print_header "JavaScript Error Diagnosis"

cd $APP_DIR

print_header "1. Application Status"
print_status "PM2 Process Status:"
sudo -u www-data -H pm2 status 2>/dev/null || print_error "PM2 not running"

print_status "Recent PM2 Logs:"
sudo -u www-data -H pm2 logs my-wedding-site --lines 10 2>/dev/null || print_error "No PM2 logs available"

print_header "2. Configuration Analysis"
print_status "Next.js Configuration:"
if [ -f "next.config.js" ]; then
    echo "✅ next.config.js exists"
    head -20 next.config.js
else
    print_error "❌ next.config.js missing"
fi

print_status "Package.json Scripts:"
if [ -f "package.json" ]; then
    grep -A 10 '"scripts"' package.json
else
    print_error "❌ package.json missing"
fi

print_header "3. Build Analysis"
print_status "Build Directory Status:"
if [ -d ".next" ]; then
    echo "✅ .next directory exists"
    ls -la .next/ | head -10
    
    print_status "Build Manifest:"
    if [ -f ".next/build-manifest.json" ]; then
        echo "✅ Build manifest exists"
    else
        print_error "❌ Build manifest missing"
    fi
    
    print_status "Server Build:"
    if [ -f ".next/server/app/page.js" ]; then
        echo "✅ Server build exists"
    else
        print_error "❌ Server build missing"
    fi
    
    print_status "Static Build:"
    if [ -d ".next/static" ]; then
        echo "✅ Static directory exists"
        ls -la .next/static/ | head -5
    else
        print_error "❌ Static directory missing"
    fi
else
    print_error "❌ .next directory missing - application not built"
fi

print_header "4. Environment Analysis"
print_status "Environment Files:"
for env_file in .env .env.local .env.production .env.development; do
    if [ -f "$env_file" ]; then
        echo "✅ $env_file exists"
    else
        echo "❌ $env_file missing"
    fi
done

print_status "Current Environment:"
if [ -f ".env" ]; then
    echo "DATABASE_URL present: $(grep -q DATABASE_URL .env && echo 'Yes' || echo 'No')"
    echo "NEXTAUTH_SECRET present: $(grep -q NEXTAUTH_SECRET .env && echo 'Yes' || echo 'No')"
    echo "NEXTAUTH_URL present: $(grep -q NEXTAUTH_URL .env && echo 'Yes' || echo 'No')"
fi

print_header "5. Network and Service Check"
print_status "Application Port Check:"
netstat -tlnp | grep :3000 || print_warning "Port 3000 not listening"

print_status "Nginx Status:"
systemctl is-active nginx || print_warning "Nginx not running"

print_status "Database Connection:"
sudo -u postgres psql -c "\l" | grep myweddingsite || print_warning "Database not found"

print_header "6. Error Pattern Analysis"
print_status "Searching for common error patterns in logs..."

if [ -f "/var/log/pm2/my-wedding-site-error.log" ]; then
    echo "PM2 Error Log (last 20 lines):"
    tail -20 /var/log/pm2/my-wedding-site-error.log
else
    print_warning "No PM2 error log found"
fi

if [ -f "/var/log/pm2/my-wedding-site-out.log" ]; then
    echo "PM2 Output Log (last 20 lines):"
    tail -20 /var/log/pm2/my-wedding-site-out.log
else
    print_warning "No PM2 output log found"
fi

print_header "7. JavaScript Bundle Analysis"
if [ -d ".next/static/chunks" ]; then
    print_status "JavaScript Chunks:"
    ls -la .next/static/chunks/ | head -10
    
    print_status "Checking for minification issues in chunks..."
    for chunk in .next/static/chunks/*.js; do
        if [ -f "$chunk" ]; then
            # Check for common minification problems
            if grep -q "ReferenceError\|is not defined\|undefined" "$chunk" 2>/dev/null; then
                print_error "Potential minification issue in $(basename $chunk)"
            fi
        fi
    done
fi

print_header "8. Recommendations"
print_status "Based on the analysis above:"

if [ ! -d ".next" ]; then
    echo "🔧 Run: npm run build"
fi

if ! sudo -u www-data -H pm2 status &>/dev/null; then
    echo "🔧 Run: bash fix-js-errors.sh"
fi

if [ -f ".next/build-manifest.json" ]; then
    echo "✅ Build appears complete"
else
    echo "🔧 Rebuild required - use safe configuration"
fi

print_status "To fix JavaScript errors, run: bash fix-js-errors.sh"
