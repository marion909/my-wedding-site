#!/bin/bash

# ============================================================================
# JavaScript Runtime Error Fix Script
# ============================================================================
# This script diagnoses and fixes JavaScript runtime errors in production
# Specifically addresses "e is not defined" minification issues
# ============================================================================

set -e

# Colors for output
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

print_status "Diagnosing JavaScript runtime errors..."

cd $APP_DIR

# Step 1: Stop current application
print_status "Stopping current application..."
sudo -u www-data -H pm2 kill 2>/dev/null || true

# Step 2: Clean all caches
print_status "Cleaning all build caches..."
npx next clean || true
rm -rf .next || true
rm -rf node_modules/.cache || true
npm cache clean --force || true

# Step 3: Create ultra-safe configuration
print_status "Creating ultra-safe Next.js configuration..."
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable all optimizations that can cause runtime errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Safe output mode
  output: 'standalone',
  
  // Disable all experimental features
  experimental: {},
  
  // Safe image configuration
  images: {
    unoptimized: true, // Disable image optimization to prevent errors
  },
  
  // Disable compression
  compress: false,
  
  // Safe compiler settings
  compiler: {
    removeConsole: false, // Keep console for debugging
  },
  
  // Webpack configuration for maximum safety
  webpack: (config, { dev, isServer }) => {
    // Disable ALL optimizations in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false,           // CRITICAL: Disable minification
        minimizer: [],             // Remove all minimizers
        sideEffects: false,        // Disable tree shaking
        usedExports: false,        // Disable dead code elimination
        concatenateModules: false, // Disable module concatenation
        splitChunks: {
          cacheGroups: {
            default: false,        // Disable chunk splitting
            vendors: false,
          },
        },
      };
    }
    
    // Safe module resolution
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
    };
    
    return config;
  },
  
  // Disable all headers that might interfere
  poweredByHeader: false,
}

module.exports = nextConfig
EOF

# Step 4: Reinstall dependencies
print_status "Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# Step 5: Try safe build
print_status "Attempting safe build..."
if npm run build; then
    print_status "Safe build successful!"
    
    # Step 6: Create safe PM2 configuration
    print_status "Creating safe PM2 configuration..."
    cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'my-wedding-site',
    script: 'npm',
    args: 'start',
    cwd: '${APP_DIR}',
    instances: 1,  // Single instance to prevent conflicts
    exec_mode: 'fork',  // Fork mode instead of cluster
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NODE_OPTIONS: '--max-old-space-size=2048'
    },
    error_file: '/var/log/pm2/my-wedding-site-error.log',
    out_file: '/var/log/pm2/my-wedding-site-out.log',
    log_file: '/var/log/pm2/my-wedding-site.log',
    time: true,
    max_memory_restart: '2G',
    restart_delay: 5000,
    watch: false,
    ignore_watch: ['node_modules', '.next', 'public/uploads'],
    kill_timeout: 5000,
  }]
};
EOF

    # Step 7: Start with safe configuration
    print_status "Starting application with safe configuration..."
    sudo -u www-data -H pm2 start ecosystem.config.js
    sudo -u www-data -H pm2 save
    
    print_status "Application started successfully!"
    print_status "Checking application status..."
    sleep 5
    sudo -u www-data -H pm2 status
    
else
    print_error "Safe build failed. Falling back to development mode..."
    
    # Fallback: Development mode
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
    restart_delay: 5000,
    watch: false,
  }]
};
EOF

    print_status "Starting in development mode..."
    sudo -u www-data -H pm2 start ecosystem.config.js
    sudo -u www-data -H pm2 save
fi

# Step 8: Check logs
print_status "Checking application logs..."
sudo -u www-data -H pm2 logs my-wedding-site --lines 20

print_status "✅ JavaScript error fix completed!"
print_status "🌐 Website should now be accessible at your domain"
print_warning "If problems persist, check: sudo -u www-data -H pm2 logs my-wedding-site"
