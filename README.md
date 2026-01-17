# Ave Caesar - Roman History Quiz Application

## 📋 Project Overview

A full-stack educational quiz application with reading materials organized by historical periods and topics. Users can read content and test their knowledge through multiple-choice quizzes. Administrators can manage topics, chapters, and questions.

**Live Site:** https://avecaesar.org

---

## 🎓 Deployment Explained (For Full-Stack Developers)

This section explains how the app goes from your local machine to being live on the internet. If you're primarily a full-stack developer and DevOps feels like a black box, this is for you.

### The Big Picture

```
LOCAL DEVELOPMENT          PRODUCTION (Digital Ocean)
─────────────────          ─────────────────────────

Your Computer              Droplet (Virtual Server)
┌─────────────┐            ┌─────────────────────────────┐
│             │            │                             │
│  Frontend   │            │  ┌─────────────────────┐   │
│  (Vite)     │            │  │      Nginx          │   │
│  Port 5173  │            │  │   (Port 80/443)     │   │
│             │            │  │                     │   │
│  Backend    │   ──────►  │  │  Routes requests:   │   │
│  (Spring)   │   Deploy   │  │  /     → Frontend   │   │
│  Port 8081  │            │  │  /api → Backend     │   │
│             │            │  └─────────────────────┘   │
│  Database   │            │           │                │
│  (Postgres) │            │           ▼                │
│  Port 5555  │            │  ┌─────────────────────┐   │
│             │            │  │  Backend (8081)     │   │
└─────────────┘            │  │  Frontend (static)  │   │
                           │  │  Database (5432)    │   │
                           │  └─────────────────────┘   │
                           │                             │
                           └─────────────────────────────┘
                                        │
                                        │ DNS
                                        ▼
                           ┌─────────────────────────────┐
                           │  avecaesar.org              │
                           │  (points to 45.55.34.96)    │
                           └─────────────────────────────┘
```

### What Each Piece Does

#### 1. **Docker & Docker Compose**
Think of Docker as a "shipping container" for your app. Instead of saying "install Java 21, install Node 20, install PostgreSQL 15...", you define everything in files and Docker creates identical environments everywhere.

- **Dockerfile** = Recipe for building one container (e.g., backend or frontend)
- **docker-compose.yml** = Orchestrates multiple containers to work together

**Why use it?**
- "Works on my machine" → "Works everywhere"
- One command (`docker compose up`) starts everything
- Same setup locally and in production

#### 2. **Nginx (The Traffic Cop)**
Nginx is a web server that sits in front of your app and routes traffic. When someone visits `avecaesar.org`:

```
User Request                    Nginx Decision
────────────                    ──────────────
https://avecaesar.org/          → Serve React app (index.html)
https://avecaesar.org/quiz      → Serve React app (React Router handles it)
https://avecaesar.org/api/...   → Forward to Spring Boot backend
```

**Why not just expose the backend directly?**
- Nginx handles SSL/HTTPS certificates
- Nginx serves static files (React) much faster than Spring Boot
- Nginx can handle thousands of connections efficiently
- One entry point (port 80/443) instead of multiple ports

#### 3. **The Domain Name System (DNS)**
DNS translates human-readable names to IP addresses:

```
avecaesar.org  →  45.55.34.96  (Your Droplet's IP)
```

**Where this is configured:** Your domain registrar (Namecheap)

| Record Type | Host | Value | What it means |
|-------------|------|-------|---------------|
| A | @ | 45.55.34.96 | "avecaesar.org points to this IP" |
| A | www | 45.55.34.96 | "www.avecaesar.org points to this IP" |

#### 4. **SSL/HTTPS (Let's Encrypt)**
SSL encrypts traffic between users and your server. Without it:
- Browsers show "Not Secure" warning
- Passwords sent in plain text
- Google ranks you lower

**Let's Encrypt** gives free SSL certificates. **Certbot** is the tool that gets them.

Certificates live at: `/etc/letsencrypt/live/avecaesar.org/` on the Droplet

---

### Files You Need to Understand

#### **docker-compose.yml** - The Orchestra Conductor
Defines all your containers and how they connect:

```yaml
services:
  postgres:      # Database container
  backend:       # Spring Boot container
  frontend:      # Nginx + React container
```

**Key settings:**
- `ports: "80:80"` = Expose container's port 80 to the outside world
- `depends_on` = Start postgres before backend
- `networks` = Containers on same network can talk to each other by name
- `volumes` = Persist data (database) or share files (SSL certs)

#### **frontend/nginx.conf** - The Traffic Rules
```nginx
server {
    listen 80;                                    # Listen on port 80 (HTTP)
    listen 443 ssl;                               # Listen on port 443 (HTTPS)
    server_name localhost avecaesar.org;          # Respond to these domains

    location / {                                  # For all requests...
        root /usr/share/nginx/html;               # Serve files from here
        try_files $uri $uri/ /index.html;         # SPA fallback for React Router
    }

    location /api {                               # For /api requests...
        proxy_pass http://backend:8081;           # Forward to backend container
    }
}
```

#### **CorsConfig.java** - Who Can Talk to Your Backend
Browsers block requests from different origins (domains/ports). CORS says "these origins are allowed":

```java
.allowedOrigins(
    "http://localhost",           // Local Docker
    "http://localhost:5173",      // Local Vite dev server
    "https://avecaesar.org",      // Production
    "https://www.avecaesar.org"   // Production with www
)
```

**When to update:** Whenever you add a new domain or change how you access the app.

---

### The Deployment Flow

#### Step 1: Local Development
```
You code → Test on localhost:5173 (frontend) + localhost:8081 (backend)
```

#### Step 2: Test with Docker Locally
```bash
docker compose up --build
# Visit http://localhost - does it work like production will?
```

#### Step 3: Push to GitHub
```bash
git add .
git commit -m "Your changes"
git push origin master
```

#### Step 4: Deploy to Production
```bash
ssh root@45.55.34.96                    # Connect to Droplet
cd /root/Istoria-react-springBoot       # Go to project
git pull                                 # Get latest code
docker compose down                      # Stop old containers
docker compose up --build -d             # Build & start new ones
```

#### What Happens on `docker compose up --build`:
1. Docker reads `docker-compose.yml`
2. Builds backend image (compiles Java, creates JAR)
3. Builds frontend image (runs `yarn build`, copies to Nginx)
4. Starts PostgreSQL container
5. Starts Backend container (waits for Postgres)
6. Starts Frontend/Nginx container (waits for Backend)
7. Nginx listens on ports 80 and 443

---

### Common "Why Isn't It Working?" Scenarios

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| CORS error in browser | Origin not in CorsConfig.java | Add the origin, rebuild, redeploy |
| 502 Bad Gateway | Backend not reachable from Nginx | Check backend logs, check `SERVER_ADDRESS: 0.0.0.0` |
| "Connection refused" | Database not running | `docker compose ps` to check, restart if needed |
| Changes not showing | Old Docker cache | `docker compose build --no-cache` |
| SSL certificate error | Wrong domain or expired cert | Check domain spelling, run `certbot renew` |

---

### Quick Reference: What to Update Where

| Change | Files to Update |
|--------|-----------------|
| Add new domain | `CorsConfig.java`, `nginx.conf` (server_name), DNS records |
| Change backend port | `docker-compose.yml`, `nginx.conf` (proxy_pass) |
| Add HTTPS origins | `CorsConfig.java` (add https:// versions) |
| Change database password | `docker-compose.yml` (both postgres and backend env vars) |

---

## 🏗️ Architecture

### Data Model Hierarchy

```
Period (e.g., "Antiquity", "Medieval")
  └── Topic (e.g., "Roman History", "Greek History")
      └── Chapter (e.g., "Kingdom Period", "Early Empire")
          └── Question (multiple choice with multiple correct answers)
```

### Technology Stack

**Backend:**
- Java 21
- Spring Boot 3.5.5
- Spring Data JPA
- PostgreSQL Database
- Flyway Migrations
- Gradle
- JWT Authentication

**Frontend:**
- React
- Vite
- CSS3

**Deployment:**
- Docker & Docker Compose
- Digital Ocean Droplet
- Nginx (reverse proxy)
- Let's Encrypt SSL

---

## 🚀 Local Development Setup

### Prerequisites
- Java 21
- Node.js 18+
- Docker & Docker Compose
- Yarn or npm

### Option 1: Docker (Recommended)

Run the entire stack with Docker:

```bash
docker compose up --build
```

This starts:
- PostgreSQL on port 5555
- Spring Boot backend on port 8081
- React frontend (via Nginx) on port 80

Access the app at: http://localhost

### Option 2: Manual Setup (Frontend Hot Reload)

**1. Start PostgreSQL container:**

```bash
docker run -d \
  --name avecaesar-db \
  -e POSTGRES_USER=avecaesar \
  -e POSTGRES_PASSWORD=Zelda214! \
  -e POSTGRES_DB=ave_caesar \
  -p 5555:5432 \
  postgres:15-alpine
```

**2. Import database (if you have a backup):**

```bash
docker exec -i avecaesar-db psql -U avecaesar -d ave_caesar < ave_caesar_complete.sql
```

**3. Run the backend:**

```bash
cd backend
./gradlew bootRun
```

Backend runs on: http://localhost:8081

**4. Run the frontend:**

```bash
cd frontend
yarn install
yarn dev
```

Frontend runs on: http://localhost:5173

---

## 🌐 Production Deployment (Digital Ocean)

### Initial Setup (One Time)

#### Step 1: Create a Droplet
1. Go to Digital Ocean → Create → Droplets
2. Choose Ubuntu 24.04
3. Select Basic plan ($6/mo - 1GB RAM)
4. Add your SSH key
5. Create Droplet

#### Step 2: Install Docker on Droplet
```bash
ssh root@YOUR_DROPLET_IP
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

#### Step 3: Clone and Deploy
```bash
git clone https://github.com/OggiDanailov/Istoria-react-springBoot.git
cd Istoria-react-springBoot
docker compose up --build -d
```

#### Step 4: Configure Domain (at Namecheap)
Add DNS records:

| Type | Host | Value |
|------|------|-------|
| A | @ | YOUR_DROPLET_IP |
| A | www | YOUR_DROPLET_IP |

#### Step 5: Setup SSL
```bash
apt update && apt install certbot -y
docker compose stop frontend
certbot certonly --standalone -d avecaesar.org -d www.avecaesar.org
docker compose up -d
```

#### Step 6: Auto-Renewal (Cron Job)
```bash
crontab -e
# Add this line:
0 3 1 * * cd /root/Istoria-react-springBoot && docker compose stop frontend && certbot renew && docker compose start frontend
```

### Ongoing Deployments

After making changes locally:

```bash
# Local
git add .
git commit -m "Your changes"
git push origin master

# On Droplet
ssh root@45.55.34.96
cd /root/Istoria-react-springBoot
git pull
docker compose down
docker compose up --build -d
```

---

## 🐳 Docker Configuration Files

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: avecaesar-db
    environment:
      POSTGRES_USER: avecaesar
      POSTGRES_PASSWORD: Zelda214!
      POSTGRES_DB: ave_caesar
    ports:
      - "5555:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - avecaesar-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: avecaesar-backend
    ports:
      - "8081:8081"
    environment:
      SERVER_PORT: 8081
      SERVER_ADDRESS: 0.0.0.0
      CORS_ORIGINS: http://localhost,http://localhost:80
      JWT_SECRET: "your-jwt-secret-here"
      JWT_EXPIRATION: 86400000
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/ave_caesar
      SPRING_DATASOURCE_USERNAME: avecaesar
      SPRING_DATASOURCE_PASSWORD: Zelda214!
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate
      SPRING_FLYWAY_ENABLED: "true"
      SPRING_FLYWAY_LOCATIONS: classpath:db/migration
    depends_on:
      - postgres
    networks:
      - avecaesar-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: avecaesar-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend
    networks:
      - avecaesar-network

volumes:
  postgres_data:

networks:
  avecaesar-network:
    driver: bridge
```

### backend/Dockerfile

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### frontend/Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn install
RUN npm rebuild esbuild
COPY . .
ENV VITE_API_BASE_URL=
RUN yarn build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
```

### frontend/nginx.conf

```nginx
server {
    listen 80;
    server_name localhost avecaesar.org www.avecaesar.org;

    # Redirect HTTP to HTTPS (except localhost for local dev)
    if ($host != localhost) {
        return 301 https://$host$request_uri;
    }

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        expires 1h;
    }

    location /api {
        proxy_pass http://backend:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    server_name avecaesar.org www.avecaesar.org;

    ssl_certificate /etc/letsencrypt/live/avecaesar.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avecaesar.org/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        expires 1h;
    }

    location /api {
        proxy_pass http://backend:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## ⚙️ Configuration

### CorsConfig.java

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost",
                    "http://localhost:80",
                    "http://localhost:5173",
                    "http://45.55.34.96",
                    "http://avecaesar.org",
                    "http://www.avecaesar.org",
                    "https://avecaesar.org",
                    "https://www.avecaesar.org"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

---

## 🐛 Common Issues & Solutions

### CORS Error in Browser
**Error:** `Access-Control-Allow-Origin header missing`

**Solution:**
1. Check `CorsConfig.java` includes your origin (http AND https)
2. Make sure `JwtAuthenticationFilter.java` does NOT have hardcoded CORS headers
3. Rebuild and redeploy

### 502 Bad Gateway
**Error:** Nginx returns 502

**Cause:** Backend not reachable from Nginx container

**Solution:**
- Check `docker compose logs backend` for errors
- Ensure `SERVER_ADDRESS: 0.0.0.0` is in docker-compose.yml
- Test: `docker exec avecaesar-frontend wget -qO- http://backend:8081/api/periods`

### Database Connection Refused
**Error:** `Connection to localhost:5555 refused`

**Solution:**
- For Docker: `docker compose ps` - is postgres running?
- For local dev: `docker start avecaesar-db`

### SSL Certificate Issues
**Error:** `NET::ERR_CERT_AUTHORITY_INVALID`

**Solution:**
- Check you're using the right domain (.org not .com)
- Certificates exist: `ls /etc/letsencrypt/live/avecaesar.org/`
- Renew if expired: `certbot renew`

### Changes Not Showing After Deploy
**Solution:**
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## 🔌 API Endpoints

### Periods
```
GET    /api/periods              - Get all periods
GET    /api/periods/{id}         - Get specific period
POST   /api/periods              - Create period
PUT    /api/periods/{id}         - Update period
DELETE /api/periods/{id}         - Delete period
```

### Topics
```
GET    /api/topics                      - Get all topics
GET    /api/topics/{id}                 - Get specific topic
GET    /api/periods/{periodId}/topics   - Get topics by period
POST   /api/periods/{periodId}/topics   - Create topic for period
PUT    /api/topics/{id}                 - Update topic
DELETE /api/topics/{id}                 - Delete topic
```

### Chapters
```
GET    /api/chapters                    - Get all chapters
GET    /api/chapters/{id}               - Get specific chapter
GET    /api/topics/{topicId}/chapters   - Get chapters by topic
POST   /api/topics/{topicId}/chapters   - Create chapter for topic
PUT    /api/chapters/{id}               - Update chapter
DELETE /api/chapters/{id}               - Delete chapter
```

### Questions
```
GET    /api/questions                        - Get all questions
GET    /api/questions/{id}                   - Get specific question
GET    /api/chapters/{chapterId}/questions   - Get questions by chapter
POST   /api/chapters/{chapterId}/questions   - Create question for chapter
PUT    /api/questions/{id}                   - Update question
DELETE /api/questions/{id}                   - Delete question
```

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login and get JWT token
```

---

## 🗄️ Database Management

### Export Database
```bash
docker exec avecaesar-db pg_dump -U avecaesar ave_caesar > ave_caesar_backup.sql
```

### Import Database
```bash
docker exec -i avecaesar-db psql -U avecaesar -d ave_caesar < ave_caesar_backup.sql
```

### Connect to Database
```bash
docker exec -it avecaesar-db psql -U avecaesar -d ave_caesar
```

---

## 🔧 Useful Docker Commands

```bash
# View running containers
docker compose ps

# View logs
docker compose logs backend
docker compose logs frontend

# Stop all containers
docker compose down

# Rebuild and start
docker compose up --build -d

# Rebuild without cache
docker compose build --no-cache

# Enter a container
docker exec -it avecaesar-backend /bin/sh

# Test internal networking
docker exec avecaesar-frontend wget -qO- http://backend:8081/api/periods
```

---

## 🔐 SSL Certificate Management

### Certificate Location
```
/etc/letsencrypt/live/avecaesar.org/fullchain.pem  (certificate)
/etc/letsencrypt/live/avecaesar.org/privkey.pem    (private key)
```

### Manual Renewal
```bash
docker compose stop frontend
certbot renew
docker compose start frontend
```

### Auto-Renewal (Cron)
Already configured to run monthly at 3am:
```
0 3 1 * * cd /root/Istoria-react-springBoot && docker compose stop frontend && certbot renew && docker compose start frontend
```

### Check Expiration
```bash
certbot certificates
```

---

**Last Updated:** January 2026
**Version:** 2.1.0