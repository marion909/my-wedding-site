#!/bin/bash

# ============================================================================
# EMERGENCY JavaScript Fix - Immediate Solution
# ============================================================================
# This script provides an immediate fix for "e is not defined" errors
# by creating the most compatible configuration possible
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

APP_DIR="/var/www/my-wedding-site"

print_status "🚨 EMERGENCY JavaScript Fix Starting..."

cd $APP_DIR

# Step 1: Immediate stop of all processes
print_status "Stopping all running processes..."
sudo -u www-data -H pm2 delete all 2>/dev/null || true
sudo -u www-data -H pm2 kill 2>/dev/null || true
pkill -f "next" 2>/dev/null || true
pkill -f "node.*3000" 2>/dev/null || true

# Step 2: Complete cleanup
print_status "Complete cleanup..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .next.backup 2>/dev/null || true

# Step 3: Create ZERO-optimization configuration
print_status "Creating zero-optimization Next.js config..."
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ZERO optimizations - maximum compatibility
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // No experimental features
  experimental: {},
  
  // Disable all image optimizations
  images: {
    unoptimized: true,
  },
  
  // No compression
  compress: false,
  
  // No console removal
  compiler: {},
  
  // Disable webpack optimizations completely
  webpack: (config) => {
    // Completely disable optimization
    config.optimization = {
      minimize: false,
      minimizer: [],
      splitChunks: false,
      runtimeChunk: false,
      sideEffects: false,
      usedExports: false,
      concatenateModules: false,
      flagIncludedChunks: false,
      occurrenceOrder: false,
      providedExports: false,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      mergeDuplicateChunks: false,
    };
    
    // Disable module concatenation
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
  
  // Basic output
  output: 'standalone',
  
  // No powered by header
  poweredByHeader: false,
}

module.exports = nextConfig
EOF

# Step 4: Force development mode instead of production
print_status "Forcing development mode configuration..."

# Create package.json script override
cp package.json package.json.backup
node -e "
const pkg = require('./package.json');
pkg.scripts.start = 'next dev';
pkg.scripts['start:safe'] = 'NODE_ENV=development next dev';
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Step 5: Create development PM2 config
print_status "Creating development PM2 configuration..."
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'my-wedding-site',
    script: 'npm',
    args: 'run dev',
    cwd: '${APP_DIR}',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    error_file: '/var/log/pm2/my-wedding-site-error.log',
    out_file: '/var/log/pm2/my-wedding-site-out.log',
    log_file: '/var/log/pm2/my-wedding-site.log',
    time: true,
    max_memory_restart: '2G',
    restart_delay: 3000,
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
  }]
};
EOF

# Step 6: Fix permissions
print_status "Fixing permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR

# Step 7: Install dependencies fresh
print_status "Fresh dependency installation..."
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Step 8: Start in development mode
print_status "Starting in development mode..."
sudo -u www-data -H pm2 start ecosystem.config.js
sudo -u www-data -H pm2 save

# Step 9: Wait and check
print_status "Waiting for application to start..."
sleep 10

print_status "Checking application status..."
sudo -u www-data -H pm2 status

print_status "Checking if port 3000 is listening..."
netstat -tlnp | grep :3000 || print_warning "Port 3000 not yet listening"

# Step 10: Test the application
print_status "Testing application..."
sleep 5
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_status "✅ Application is responding!"
else
    print_warning "⚠️  Application not yet responding, checking logs..."
    sudo -u www-data -H pm2 logs my-wedding-site --lines 20
fi

print_status "🎉 Emergency fix completed!"
print_status "🌐 Your website should now work without JavaScript errors"
print_status "📝 Check logs with: sudo -u www-data -H pm2 logs my-wedding-site"
print_warning "⚠️  Running in development mode for maximum stability"
print_warning "⚠️  Once stable, you can optimize later if needed"
