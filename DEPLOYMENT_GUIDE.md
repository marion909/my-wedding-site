# 🚀 Deployment Anleitung - My Wedding Site

## Übersicht

Das `deploy.sh` Skript automatisiert die komplette Production-Installation deiner Hochzeitswebsite auf einem Ubuntu Server.

## 📋 Voraussetzungen

### Server Requirements:
- **Ubuntu 22.04 LTS** Server
- **Mindestens 2GB RAM** (4GB empfohlen)
- **Root-Zugriff** oder sudo-Berechtigung
- **Domain** mit A-Record auf Server-IP zeigend
- **Internetverbindung**

### Lokale Vorbereitung:
1. GitHub Repository erstellt und Code gepusht ✅
2. Domain registriert und DNS konfiguriert
3. Server gemietet (Hetzner, DigitalOcean, AWS, etc.)

## 🖥️ Server-Zugriff

### 1. SSH-Verbindung zum Server
```bash
# Mit SSH zum Server verbinden
ssh root@YOUR_SERVER_IP

# Oder mit Benutzer + sudo
ssh username@YOUR_SERVER_IP
```

### 2. Deployment-Skript auf Server laden

**Option A: GitHub Repository klonen**
```bash
# Temporäres Verzeichnis erstellen
mkdir -p /tmp/deployment
cd /tmp/deployment

# Repository klonen
git clone https://github.com/marion909/my-wedding-site.git
cd my-wedding-site

# Skript ausführbar machen
chmod +x deploy.sh
```

**Option B: Skript direkt herunterladen**
```bash
# Direkt von GitHub herunterladen
wget https://raw.githubusercontent.com/marion909/my-wedding-site/main/deploy.sh
chmod +x deploy.sh
```

## 🚀 Deployment starten

### Vollständiges Deployment
```bash
# Als root ausführen
sudo bash deploy.sh

# Oder direkt als root
bash deploy.sh
```

### Deployment mit Optionen
```bash
# Hilfe anzeigen
bash deploy.sh --help

# Nur Konfiguration sammeln (Test)
bash deploy.sh --config-only

# Ohne SSL (für Tests)
bash deploy.sh --no-ssl

# Ohne Firewall-Konfiguration
bash deploy.sh --no-firewall
```

## 📝 Deployment-Prozess

Das Skript führt folgende Schritte automatisch aus:

### 1. **Konfiguration sammeln** 📋
```
Domain name (z.B. my-wedding-site.com): ihre-domain.de
Your email address: ihr@email.de
GitHub repository URL: https://github.com/marion909/my-wedding-site.git
```

### 2. **System-Updates** 🔄
- Ubuntu Pakete aktualisieren
- Sicherheitsupdates installieren
- Grundlegende Tools installieren

### 3. **Software installieren** 📦
- Node.js 18+ installieren
- PostgreSQL Datenbank installieren
- nginx Webserver installieren
- PM2 Process Manager installieren

### 4. **Anwendung deployen** 🎯
- GitHub Repository klonen
- Dependencies installieren
- Datenbank einrichten
- Umgebungsvariablen konfigurieren
- Anwendung builden

### 5. **Services konfigurieren** ⚙️
- PM2 für Anwendung konfigurieren
- nginx als Reverse Proxy einrichten
- SSL-Zertifikat mit Let's Encrypt installieren
- Firewall konfigurieren

### 6. **Monitoring & Backups** 📊
- Automatische Backups einrichten
- Health-Checks konfigurieren
- Log-Rotation einrichten

## ⚠️ Wichtige Hinweise während des Deployments

### Interaktive Eingaben:
1. **Domain**: Vollständige Domain ohne https:// (z.B. `my-wedding-site.com`)
2. **Email**: Für Let's Encrypt SSL-Zertifikat
3. **Repository**: GitHub-URL (Standard ist bereits gesetzt)

### Automatische Passwörter:
- **Datenbank-Passwort**: Wird automatisch generiert
- **NextAuth Secret**: Wird automatisch generiert

## 🔧 Nach dem Deployment

### 1. **API-Keys konfigurieren**
```bash
# Environment-Datei bearbeiten
nano /var/www/my-wedding-site/.env.production

# Echte Stripe-Keys eintragen:
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google AdSense Publisher ID:
GOOGLE_ADS_CLIENT_ID="ca-pub-..."

# Anwendung neustarten
sudo -u www-data pm2 restart my-wedding-site
```

### 2. **Stripe Webhooks konfigurieren**
- Im Stripe Dashboard: `https://dashboard.stripe.com/webhooks`
- Webhook-URL: `https://ihre-domain.de/api/stripe/webhooks`
- Events: `checkout.session.completed`, `customer.subscription.updated`, etc.

### 3. **DNS final prüfen**
```bash
# DNS-Auflösung testen
nslookup ihre-domain.de
ping ihre-domain.de
```

## 🧪 Deployment testen

### Automatische Tests
Das Skript führt automatisch Tests durch:
- HTTP/HTTPS Erreichbarkeit
- Health-Check Endpoint
- PM2 Status
- SSL-Zertifikat

### Manuelle Tests
```bash
# Website aufrufen
curl -I https://ihre-domain.de

# Health-Check
curl https://ihre-domain.de/health

# Admin-Bereich
# Browser: https://ihre-domain.de/dashboard
```

## 🚨 Troubleshooting

### Häufige Probleme:

**1. DNS noch nicht propagiert**
```bash
# Warten Sie 24-48h für vollständige DNS-Propagation
# Temporär über /etc/hosts testen:
echo "SERVER_IP ihre-domain.de" >> /etc/hosts
```

**2. SSL-Zertifikat fehlgeschlagen**
```bash
# Manuell Let's Encrypt ausführen
certbot --nginx -d ihre-domain.de -d www.ihre-domain.de
```

**3. Anwendung startet nicht**
```bash
# Logs prüfen
sudo -u www-data pm2 logs my-wedding-site

# Anwendung neustarten
sudo -u www-data pm2 restart my-wedding-site
```

**4. Nginx-Konfiguration fehlerhaft**
```bash
# Nginx-Konfiguration testen
nginx -t

# Nginx neustarten
systemctl restart nginx
```

## 📊 Nützliche Befehle nach Deployment

```bash
# Anwendungs-Status
sudo -u www-data pm2 status

# Logs anzeigen
sudo -u www-data pm2 logs my-wedding-site

# Nginx-Logs
tail -f /var/log/nginx/error.log

# Backup manuell ausführen
sudo /usr/local/bin/backup-wedding-db.sh

# Update der Anwendung
bash update.sh
```

## 🎉 Erfolgreiche Deployment-Bestätigung

Nach erfolgreichem Deployment sollten Sie sehen:

```
============================================================================
 Deployment Completed Successfully! 🎉
============================================================================

Your wedding site platform is now live!

Website URL: https://ihre-domain.de
Admin Panel: https://ihre-domain.de/dashboard

Important Next Steps:
1. Configure real Stripe API keys in: /var/www/my-wedding-site/.env.production
2. Configure Google AdSense publisher ID
3. Set up email SMTP credentials
4. Test the complete user flow
5. Set up domain DNS if not done already

Happy Wedding Planning! 💍✨
```

## 📞 Support

Bei Problemen:
1. Logs prüfen (siehe Befehle oben)
2. GitHub Issues erstellen
3. Deployment-Skript mit `--help` ausführen

**Viel Erfolg mit dem Deployment! 🚀💍**
