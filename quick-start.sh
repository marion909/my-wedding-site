#!/bin/bash

# ============================================================================
# QUICK START - My Wedding Site Deployment
# ============================================================================
# Minimal setup guide for experienced users
# ============================================================================

echo "🚀 MY WEDDING SITE - QUICK DEPLOYMENT"
echo "====================================="
echo

# Check if running on Ubuntu
if ! grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
    echo "❌ This script requires Ubuntu 22.04 LTS"
    exit 1
fi

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo bash quick-start.sh"
    exit 1
fi

echo "📋 QUICK SETUP CHECKLIST:"
echo "========================"
echo "✓ Ubuntu 22.04 LTS Server"
echo "✓ Root/sudo access"
echo "✓ Domain A-record configured"
echo "✓ 2GB+ RAM available"
echo

# Prompt for essential info
read -p "🌐 Domain (e.g. my-wedding-site.com): " DOMAIN
read -p "📧 Email for SSL certificate: " EMAIL
read -p "📁 GitHub repo [marion909/my-wedding-site]: " REPO
REPO=${REPO:-"https://github.com/marion909/my-wedding-site.git"}

echo
echo "🚀 Starting deployment..."
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "Repo: $REPO"
echo

# Create temp directory and download
mkdir -p /tmp/wedding-deploy
cd /tmp/wedding-deploy

# Download deployment script
if [ -f "deploy.sh" ]; then
    echo "✓ Using existing deploy.sh"
else
    echo "📥 Downloading deployment script..."
    git clone $REPO .
    chmod +x deploy.sh
fi

# Run deployment with auto-confirm
echo "🔄 Running full deployment..."
echo

# Set environment variables for auto-deployment
export DOMAIN="$DOMAIN"
export EMAIL="$EMAIL"
export GITHUB_REPO="$REPO"
export AUTO_CONFIRM="true"

# Execute main deployment
bash deploy.sh

echo
echo "🎉 Quick deployment completed!"
echo
echo "Next steps:"
echo "1. Visit: https://$DOMAIN"
echo "2. Configure Stripe keys in: /var/www/my-wedding-site/.env.production"
echo "3. Set up Google AdSense publisher ID"
echo
echo "Useful commands:"
echo "- Logs: sudo -u www-data pm2 logs my-wedding-site"
echo "- Restart: sudo -u www-data pm2 restart my-wedding-site"
echo "- Update: bash update.sh"
echo
echo "Happy Wedding Planning! 💍✨"
