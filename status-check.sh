#!/bin/bash

# ============================================================================
# Quick Status Check Script
# ============================================================================

APP_DIR="/var/www/my-wedding-site"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== My Wedding Site Status ===${NC}"
echo

# Check PM2 status
echo -e "${GREEN}PM2 Status:${NC}"
sudo -u www-data -H pm2 status 2>/dev/null || echo -e "${RED}PM2 not running${NC}"
echo

# Check port
echo -e "${GREEN}Port 3000 Status:${NC}"
if netstat -tlnp | grep :3000 >/dev/null; then
    echo -e "${GREEN}✅ Port 3000 is listening${NC}"
else
    echo -e "${RED}❌ Port 3000 not listening${NC}"
fi
echo

# Test application response
echo -e "${GREEN}Application Response:${NC}"
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Application responding${NC}"
else
    echo -e "${RED}❌ Application not responding${NC}"
fi
echo

# Check recent logs
echo -e "${GREEN}Recent Logs (last 10 lines):${NC}"
sudo -u www-data -H pm2 logs my-wedding-site --lines 10 2>/dev/null || echo -e "${RED}No logs available${NC}"
echo

# Quick commands reminder
echo -e "${YELLOW}Quick Commands:${NC}"
echo "  Restart: sudo -u www-data -H pm2 restart my-wedding-site"
echo "  Logs: sudo -u www-data -H pm2 logs my-wedding-site"
echo "  Emergency fix: bash emergency-fix.sh"
