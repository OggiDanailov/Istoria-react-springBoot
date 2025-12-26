# Ave Caesar - DigitalOcean Deployment Guide

**Status**: Ready for production deployment
**Estimated Time**: 8-12 hours (2-3 days)
**Platform**: DigitalOcean
**Backend**: Spring Boot (Java 21)
**Frontend**: React (Vite)
**Database**: PostgreSQL (Managed)
**Cost**: ~$12-20/month

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: DigitalOcean Account & Initial Setup](#step-1-digitalocean-account--initial-setup)
3. [Step 2: Create Managed PostgreSQL Database](#step-2-create-managed-postgresql-database)
4. [Step 3: Create Droplet (Server)](#step-3-create-droplet-server)
5. [Step 4: Deploy Backend (Spring Boot)](#step-4-deploy-backend-spring-boot)
6. [Step 5: Deploy Frontend (React)](#step-5-deploy-frontend-react)
7. [Step 6: Configure SSL/HTTPS](#step-6-configure-httpsssl)
8. [Step 7: Setup Domain](#step-7-setup-domain)
9. [Step 8: Security Configuration](#step-8-security-configuration)
10. [Step 9: Monitoring & Backups](#step-9-monitoring--backups)
11. [Step 10: Testing Before Launch](#step-10-testing-before-launch)
12. [Troubleshooting](#troubleshooting)
13. [Post-Launch Checklist](#post-launch-checklist)

---

## Prerequisites

Before starting, ensure you have:

- [ ] DigitalOcean account created (free $200 credit if you use referral link)
- [ ] Backend code ready (Spring Boot JAR buildable)
- [ ] Frontend code ready (React with Vite)
- [ ] Domain name (register at Namecheap, GoDaddy, or similar - or use DigitalOcean DNS)
- [ ] SSH key pair generated on your local machine
- [ ] Terminal/command line access
- [ ] Git installed locally

**Generate SSH key (if you don't have one):**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Save to ~/.ssh/id_ed25519
# This creates public key (~/.ssh/id_ed25519.pub) and private key
```

---

## Step 1: DigitalOcean Account & Initial Setup

### 1.1 Create DigitalOcean Account

1. Go to https://www.digitalocean.com
2. Click "Sign Up"
3. Create account (email, password)
4. Add payment method (credit card)
5. **Optional**: Enable 2FA for security

### 1.2 Add SSH Key to DigitalOcean

1. In DigitalOcean dashboard, go to **Settings > Security > SSH Keys**
2. Click **"Add SSH Key"**
3. Paste your public key content:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
4. Name it something like "ave-caesar-deployment"
5. Click **"Add SSH Key"**

This lets you login to servers without a password.

### 1.3 Create a Project

1. Go to **Projects** in sidebar
2. Click **"New Project"**
3. Name it: "Ave Caesar"
4. Description: "Roman History Learning Platform"
5. Click **"Create Project"**

All resources will be organized here.

---

## Step 2: Create Managed PostgreSQL Database

### 2.1 Create Database Cluster

1. In your project, click **"Create"** → **"Databases"**
2. Choose **PostgreSQL** version **15** (or latest stable)
3. Configure:
   - **Datacenter Region**: Choose closest to your location (e.g., New York, San Francisco)
   - **Database Cluster Name**: `ave-caesar-db`
   - **Machine Type**: Basic (1 GB RAM, 1 vCPU) - sufficient for MVP
4. Click **"Create Database Cluster"**

**Wait time**: 3-5 minutes. Status will show "Creating" → "Ready"

### 2.2 Configure Database Access

Once ready:

1. Click on the cluster name
2. Go to **Users & Databases** tab
3. Create new database:
   - **Database Name**: `ave_caesar`
   - Click **"Create Database"**
4. Create new user (if default user doesn't exist):
   - **Username**: `avecaesar`
   - **Password**: Generate strong password (save this!)
   - Click **"Create User"**
5. Give user permissions to database

### 2.3 Get Connection String

1. Go to the **Connection details** tab
2. Copy the **connection string** (looks like):
   ```
   postgresql://avecaesar:PASSWORD@host:5432/ave_caesar?sslmode=require
   ```
3. **Save this** - you'll need it for the backend

### 2.4 Add Trusted Sources (Firewall)

1. Go to **Firewall** tab
2. Click **"Add Trusted Sources"**
3. For now, allow **all IPs** (we'll restrict later):
   - Enter: `0.0.0.0/0`
4. Click **"Add"**

This allows your Droplet to connect. Later, restrict to Droplet IP only.

---

## Step 3: Create Droplet (Server)

### 3.1 Create Droplet

1. In your project, click **"Create"** → **"Droplets"**
2. Choose Image:
   - **Ubuntu 24.04 LTS** (Long Term Support)
3. Choose Plan:
   - **Basic** → **Regular Performance**
   - **2 GB RAM / 1 vCPU / 50 GB SSD** = ~$12/month (sufficient for MVP)
4. Datacenter:
   - Same region as database (important for speed)
5. Authentication:
   - Select **SSH keys**
   - Choose the key you added earlier
6. Hostname:
   - `ave-caesar-app`
7. Click **"Create Droplet"**

**Wait time**: 1-2 minutes. Status will show "New" → "Active"

### 3.2 Get Droplet IP Address

Once active:
1. Click on the Droplet name
2. Copy the **IPv4 address** (e.g., `123.45.67.89`)
3. **Save this** - you'll use it for SSH access and DNS

### 3.3 Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
# e.g., ssh root@123.45.67.89
# Should connect without password if SSH key setup correctly
```

You're now in your server terminal. All subsequent commands run here.

---

## Step 4: Deploy Backend (Spring Boot)

### 4.1 Update System & Install Dependencies

```bash
apt update
apt upgrade -y
apt install -y openjdk-21-jdk-headless curl wget git nano
java -version  # Verify Java 21 is installed
```

### 4.2 Create Application Directory

```bash
mkdir -p /opt/avecaesar
cd /opt/avecaesar
```

### 4.3 Build Backend Locally (On Your Machine)

On your **local machine**, navigate to backend directory and build:

```bash
cd backend
./gradlew clean build
# Or: mvn clean package (if Maven)
# Creates JAR in: build/libs/app-0.0.1-SNAPSHOT.jar
```

### 4.4 Upload Backend JAR to Droplet

From your **local machine**:

```bash
scp backend/build/libs/app-0.0.1-SNAPSHOT.jar root@YOUR_DROPLET_IP:/opt/avecaesar/
# e.g., scp backend/build/libs/app-0.0.1-SNAPSHOT.jar root@123.45.67.89:/opt/avecaesar/
```

### 4.5 Configure Environment Variables

Back on the **Droplet terminal**:

```bash
cd /opt/avecaesar
nano .env
```

Add these environment variables:

```env
# Database
DATABASE_URL=postgresql://avecaesar:YOUR_PASSWORD@YOUR_DB_HOST:5432/ave_caesar?sslmode=require
DATABASE_USER=avecaesar
DATABASE_PASSWORD=YOUR_PASSWORD

# JWT Secret (generate strong one)
JWT_SECRET=your_very_long_random_secret_key_at_least_64_characters_long

# Server
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api

# CORS (restrict to your domain)
CORS_ORIGINS=http://localhost:5173,http://YOUR_DOMAIN.com,https://YOUR_DOMAIN.com
```

Save with **Ctrl+X** → **Y** → **Enter**

### 4.6 Run Backend as Service

Create systemd service file:

```bash
nano /etc/systemd/system/avecaesar-backend.service
```

Paste:

```ini
[Unit]
Description=Ave Caesar Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/avecaesar
EnvironmentFile=/opt/avecaesar/.env
ExecStart=/usr/bin/java -jar /opt/avecaesar/app-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save with **Ctrl+X** → **Y** → **Enter**

Enable and start:

```bash
systemctl daemon-reload
systemctl enable avecaesar-backend
systemctl start avecaesar-backend
systemctl status avecaesar-backend
# Should show "active (running)"
```

### 4.7 Verify Backend is Running

```bash
curl http://localhost:8080/api/periods
# Should return JSON or 200 status
# If error, check logs: journalctl -u avecaesar-backend -n 50
```

---

## Step 5: Deploy Frontend (React)

### 5.1 Install Node.js & npm

On **Droplet**:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node --version
npm --version
```

### 5.2 Build Frontend Locally

On **your local machine**:

```bash
cd frontend
npm install
npm run build
# Creates optimized build in: dist/
```

### 5.3 Upload Frontend to Droplet

```bash
scp -r frontend/dist/* root@YOUR_DROPLET_IP:/opt/avecaesar/frontend/
```

Or upload the entire dist folder:

```bash
scp -r frontend/dist root@YOUR_DROPLET_IP:/opt/avecaesar/
```

### 5.4 Setup Nginx as Reverse Proxy

Install Nginx:

```bash
apt install -y nginx
```

Create Nginx config:

```bash
nano /etc/nginx/sites-available/avecaesar
```

Paste:

```nginx
upstream backend {
    server localhost:8080;
}

server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    # Frontend static files
    location / {
        root /opt/avecaesar/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 1h;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Replace `YOUR_DOMAIN.com`** with your actual domain.

Save with **Ctrl+X** → **Y** → **Enter**

Enable and start Nginx:

```bash
ln -s /etc/nginx/sites-available/avecaesar /etc/nginx/sites-enabled/
nginx -t  # Test config (should show "ok")
systemctl enable nginx
systemctl start nginx
systemctl status nginx
```

### 5.5 Configure Frontend API Endpoint

Your frontend needs to know the backend URL. Update your frontend config:

**Before building, ensure your API config points to production:**

In `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8081';
export { API_BASE_URL };
```

Or create a `.env.production` file:

```
VITE_API_URL=https://YOUR_DOMAIN.com/api
```

Then rebuild and re-upload frontend.

---

## Step 6: Configure HTTPS/SSL

### 6.1 Install Certbot (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificate

```bash
certbot certonly --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose "Redirect to HTTPS"
```

### 6.3 Update Nginx Config

Certbot should auto-update, but verify `/etc/nginx/sites-available/avecaesar` has:

```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN.com/privkey.pem;
```

And add redirect from HTTP to HTTPS:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    return 301 https://$server_name$request_uri;
}
```

### 6.4 Test and Reload

```bash
nginx -t
systemctl reload nginx
```

### 6.5 Auto-Renewal

Certbot auto-renewal is typically enabled:

```bash
systemctl status certbot.timer
# Should show "active"
```

---

## Step 7: Setup Domain

### Option A: Using DigitalOcean DNS (Recommended)

1. Register domain at Namecheap/GoDaddy
2. In DigitalOcean project, go to **Create** → **Domains**
3. Enter your domain name
4. DigitalOcean will provide **nameservers**
5. Update domain registrar to use DigitalOcean nameservers
6. Create **A record** pointing to your Droplet IP:
   - **Name**: `@` (or leave blank)
   - **Type**: A
   - **Points to**: YOUR_DROPLET_IP

### Option B: Using Domain Registrar's DNS

1. Login to your domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS settings
3. Create **A record**:
   - **Name**: `@` or `yourdomain.com`
   - **Type**: A
   - **Value**: YOUR_DROPLET_IP
4. Create **CNAME record** for www:
   - **Name**: `www`
   - **Type**: CNAME
   - **Value**: `yourdomain.com`

**DNS propagation takes 15 mins - 24 hours** (usually 30 mins)

Test when ready:

```bash
nslookup YOUR_DOMAIN.com
# Should resolve to your Droplet IP
```

---

## Step 8: Security Configuration

### 8.1 Enable UFW Firewall

```bash
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable
ufw status
```

### 8.2 Restrict Database Firewall (DigitalOcean)

1. Go to your **PostgreSQL cluster** settings
2. **Firewall** tab
3. Remove "all IPs" rule
4. Add **Droplet IP** only:
   - Get Droplet IP: `curl -s http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address`
   - Add to database firewall

### 8.3 Create Non-Root User (Optional but Recommended)

```bash
adduser avecaesar
usermod -aG sudo avecaesar
# Switch to new user: su - avecaesar
```

### 8.4 Disable Root SSH (Optional)

Edit SSH config:

```bash
nano /etc/ssh/sshd_config
# Find: PermitRootLogin yes
# Change to: PermitRootLogin no
systemctl restart ssh
```

---

## Step 9: Monitoring & Backups

### 9.1 Enable DigitalOcean Monitoring

1. Go to Droplet settings
2. Enable **Monitoring**
3. View metrics in dashboard

### 9.2 Setup Automated Database Backups

1. Go to **PostgreSQL cluster** settings
2. **Backups** tab
3. Enable automated backups (daily)

### 9.3 Setup Log Monitoring

On Droplet, view service logs:

```bash
# Backend logs
journalctl -u avecaesar-backend -f  # Follow in real-time
journalctl -u avecaesar-backend -n 100  # Last 100 lines

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 9.4 Add Google Analytics 4

In your frontend code, add GA4 script:

```html
<!-- In public/index.html or your main template -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA4_ID');
</script>
```

Rebuild and redeploy frontend.

---

## Step 10: Testing Before Launch

### 10.1 Test User Signup

1. Open https://YOUR_DOMAIN.com
2. Click "Sign Up"
3. Create test account
4. Verify email (if implemented)
5. Try to login

### 10.2 Test Quiz Flow

1. Signin with test account
2. Select Period → Topic → Chapter
3. Read content
4. Start quiz
5. Answer questions
6. Submit
7. Check progress on dashboard

### 10.3 Test Admin Panel

1. Go to https://YOUR_DOMAIN.com/admin (or your admin route)
2. Login with admin credentials
3. Test CRUD operations:
   - Create period
   - Create topic
   - Create chapter
   - Create questions

### 10.4 Test API Endpoints

```bash
# From your local machine
curl -X GET https://YOUR_DOMAIN.com/api/periods
# Should return JSON list of periods
```

### 10.5 Test SSL

1. Visit https://YOUR_DOMAIN.com
2. Check certificate:
   - Click lock icon → "Certificate"
   - Should show valid certificate
   - Expiry date 90 days from now

### 10.6 Performance Check

Use tools to test speed:
- Google PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/

---

## Troubleshooting

### Backend not connecting to database

**Symptom**: Error logs show "Cannot connect to database"

**Solution**:
1. Verify connection string in `.env`
2. Check database is accessible from Droplet IP
3. Test manually: `psql postgresql://USER:PASS@HOST:5432/DATABASE`
4. Check database firewall rules (must include Droplet IP)

```bash
# From Droplet
sudo su - postgres
psql -h YOUR_DB_HOST -U avecaesar -d ave_caesar
# Type password when prompted
```

### Frontend blank page or 404

**Symptom**: Visiting domain shows blank page or 404

**Solution**:
1. Check Nginx is running: `systemctl status nginx`
2. Check frontend files uploaded: `ls /opt/avecaesar/frontend/dist/`
3. Check Nginx logs: `tail -f /var/log/nginx/error.log`
4. Restart Nginx: `systemctl restart nginx`

### API calls from frontend failing (CORS error)

**Symptom**: Browser console shows "CORS error" or "blocked by CORS"

**Solution**:
1. Check backend `.env` has correct `CORS_ORIGINS`
2. Ensure domain is included (http AND https)
3. Restart backend: `systemctl restart avecaesar-backend`
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

```bash
# Verify CORS config is loaded
journalctl -u avecaesar-backend | grep -i cors
```

### SSL Certificate issues

**Symptom**: Browser shows "Not secure" or certificate warnings

**Solution**:
1. Verify certificate exists: `ls /etc/letsencrypt/live/YOUR_DOMAIN.com/`
2. Check Nginx config has correct paths
3. Test config: `nginx -t`
4. Force renewal: `certbot renew --force-renewal`

### Droplet running slowly

**Symptom**: Pages load slowly, backend takes long time

**Solution**:
1. Check CPU/RAM usage: `top` command
2. Check disk space: `df -h`
3. Review logs for errors: `journalctl -u avecaesar-backend -n 50`
4. Increase Droplet size (DigitalOcean dashboard → Resize)
5. Check database queries (enable slow query log)

### Can't SSH into Droplet

**Symptom**: "Permission denied" or "Connection refused"

**Solution**:
1. Verify correct IP: `ssh root@YOUR_IP`
2. Check SSH key: `ls ~/.ssh/id_ed25519`
3. Verify key permissions: `chmod 600 ~/.ssh/id_ed25519`
4. Try explicit key: `ssh -i ~/.ssh/id_ed25519 root@YOUR_IP`
5. Check DigitalOcean firewall allows port 22

---

## Post-Launch Checklist

- [ ] Domain resolves to HTTPS
- [ ] User signup/login works
- [ ] Quiz flow works (read → quiz → progress)
- [ ] Admin panel accessible and functional
- [ ] All content displays correctly
- [ ] Database backups enabled
- [ ] SSL certificate auto-renewal enabled
- [ ] Monitoring alerts configured
- [ ] Error logging working
- [ ] Google Analytics tracking
- [ ] UFW firewall enabled
- [ ] Database firewall restricted to Droplet IP
- [ ] Non-root user created
- [ ] Root SSH disabled (optional)

---

## Maintenance Going Forward

### Weekly
- [ ] Check server logs for errors
- [ ] Monitor disk space
- [ ] Test backup restoration (monthly)

### Monthly
- [ ] Review Google Analytics
- [ ] Check for package updates: `apt update && apt list --upgradable`
- [ ] Test DNS/SSL still working

### Quarterly
- [ ] Scale resources if needed
- [ ] Review security settings
- [ ] Database optimization

---

## Support / Issues

**Common issues contact:**
- DigitalOcean Support: https://www.digitalocean.com/support
- Spring Boot Docs: https://spring.io/projects/spring-boot
- React Docs: https://react.dev
- Let's Encrypt: https://letsencrypt.org/support/

**If deployment fails**, check:
1. All credentials correct
2. All IPs/domains correct
3. All firewall rules allow traffic
4. Backend logs for specific errors
5. Database connectivity

---

**Deployment Guide Version**: 1.0
**Created**: December 21, 2025
**Last Updated**: December 21, 2025
**Status**: Ready for production deployment