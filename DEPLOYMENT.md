# Production Deployment Guide

## Server Requirements
- Ubuntu 22.04 LTS
- Node.js 18+ 
- PostgreSQL 14+
- nginx
- 2GB RAM minimum (4GB recommended)
- Domain with A-Record pointing to server IP

## 1. Server Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE myweddingsite;
CREATE USER myweddinguser WITH PASSWORD 'secure-password-here';
GRANT ALL PRIVILEGES ON DATABASE myweddingsite TO myweddinguser;
\q
```

### Install nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2
```bash
sudo npm install -g pm2
```

## 2. Application Setup

### Clone and Setup
```bash
cd /var/www
sudo git clone https://github.com/yourusername/my-wedding-site.git
sudo chown -R $USER:$USER my-wedding-site
cd my-wedding-site
npm install
```

### Environment Configuration
```bash
cp .env.example .env
nano .env
```

Configure production environment:
```env
DATABASE_URL="postgresql://myweddinguser:secure-password-here@localhost:5432/myweddingsite"
NEXTAUTH_SECRET="generate-a-super-secure-random-key"
NEXTAUTH_URL="https://my-wedding-site.com"
NEXT_PUBLIC_BASE_URL="https://my-wedding-site.com"

# Production Email (Gmail example)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-gmail@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@my-wedding-site.com"
```

### Database Migration
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Build Application
```bash
npm run build
```

## 3. nginx Configuration

Create nginx config:
```bash
sudo nano /etc/nginx/sites-available/my-wedding-site
```

```nginx
server {
    listen 80;
    server_name my-wedding-site.com www.my-wedding-site.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name my-wedding-site.com www.my-wedding-site.com;

    # SSL Configuration (will be added by certbot)
    ssl_certificate /etc/letsencrypt/live/my-wedding-site.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-wedding-site.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /_next/static/ {
        alias /var/www/my-wedding-site/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle uploads
    location /uploads/ {
        alias /var/www/my-wedding-site/public/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # File upload size
    client_max_body_size 10M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/my-wedding-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. SSL with Let's Encrypt

### Install Certbot
```bash
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### Get SSL Certificate
```bash
sudo certbot --nginx -d my-wedding-site.com -d www.my-wedding-site.com
```

## 5. PM2 Process Management

### Create PM2 ecosystem file
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'my-wedding-site',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/my-wedding-site',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/my-wedding-site/error.log',
    out_file: '/var/log/my-wedding-site/out.log',
    log_file: '/var/log/my-wedding-site/combined.log',
    time: true
  }]
}
```

### Start with PM2
```bash
sudo mkdir -p /var/log/my-wedding-site
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Monitoring & Maintenance

### Log Monitoring
```bash
# View logs
pm2 logs my-wedding-site

# Monitor resources
pm2 monit

# Restart application
pm2 restart my-wedding-site
```

### Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-wedding-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/my-wedding-site"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U myweddinguser -d myweddingsite > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-wedding-db.sh

# Add to crontab for daily backup
sudo crontab -e
0 2 * * * /usr/local/bin/backup-wedding-db.sh
```

### Security Updates
```bash
# Auto-update security patches
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 7. Domain Configuration

Point your domain to the server:
- A Record: my-wedding-site.com → Your_Server_IP
- CNAME: www.my-wedding-site.com → my-wedding-site.com

## 8. Testing

```bash
# Test the deployment
curl -I https://my-wedding-site.com
curl -I https://my-wedding-site.com/health

# Load test (optional)
sudo apt install apache2-utils -y
ab -n 100 -c 10 https://my-wedding-site.com/
```

## Production Checklist
- [ ] Server secured (firewall, SSH keys)
- [ ] Database configured with strong password
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] nginx configured
- [ ] PM2 running application
- [ ] Backups configured
- [ ] Domain pointing to server
- [ ] Email sending working
- [ ] Upload directory writable
- [ ] Logs rotating properly

Your wedding site platform is now live! 🎉
