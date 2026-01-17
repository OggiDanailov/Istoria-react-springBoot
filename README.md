# Ave Caesar - Roman History Quiz Application

## 📋 Project Overview

A full-stack educational quiz application with reading materials organized by historical periods and topics. Users can read content and test their knowledge through multiple-choice quizzes. Administrators can manage topics, chapters, and questions.

**Live Site:** http://avecaesar.org

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

## 📁 Project Structure

```
Istoria-react-springBoot/
├── backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── config/
│   │   │   ├── CorsConfig.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   ├── filter/
│   │   │   └── JwtAuthenticationFilter.java
│   │   ├── model/
│   │   ├── repository/
│   │   └── DemoApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/
│   ├── Dockerfile
│   └── build.gradle
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites
- Java 21
- Node.js 18+
- Docker & Docker Compose
- Yarn or npm

### Option 1: Docker (Recommended)

Run the entire stack with Docker:

```bash
docker-compose up --build
```

This starts:
- PostgreSQL on port 5555
- Spring Boot backend on port 8081
- React frontend (via Nginx) on port 80

Access the app at: http://localhost

### Option 2: Manual Setup

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

## 🐳 Docker Configuration

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

### Backend Dockerfile

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

### Frontend Dockerfile

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
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Frontend nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

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

## 🌐 Production Deployment (Digital Ocean)

### Prerequisites
- Digital Ocean account
- Domain name (optional)
- SSH key configured

### Step 1: Create a Droplet

1. Go to Digital Ocean → Create → Droplets
2. Choose Ubuntu 24.04
3. Select Basic plan ($6/mo - 1GB RAM is sufficient)
4. Choose a datacenter region
5. Add your SSH key
6. Create Droplet

### Step 2: SSH into the Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 3: Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Step 4: Clone and Deploy

```bash
git clone https://github.com/OggiDanailov/Istoria-react-springBoot.git
cd Istoria-react-springBoot
docker compose up --build -d
```

### Step 5: Import Database (if needed)

```bash
# Copy your SQL backup to the server first, then:
docker exec -i avecaesar-db psql -U avecaesar -d ave_caesar < ave_caesar_complete.sql
```

### Step 6: Configure Domain (Optional)

**At your domain registrar (e.g., Namecheap):**

Add these DNS records:

| Type | Host | Value |
|------|------|-------|
| A | @ | YOUR_DROPLET_IP |
| A | www | YOUR_DROPLET_IP |

**Update CorsConfig.java:**

```java
.allowedOrigins(
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
    "http://YOUR_DROPLET_IP",
    "http://yourdomain.org",
    "http://www.yourdomain.org"
)
```

Then redeploy:

```bash
git add .
git commit -m "Add domain to CORS"
git push origin master
```

On the Droplet:

```bash
cd /root/Istoria-react-springBoot
git pull
docker compose down
docker compose up --build -d
```

## ⚙️ Configuration

### CORS Configuration (CorsConfig.java)

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
                    "http://www.avecaesar.org"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Application Properties

```properties
spring.application.name=demo
server.port=8081

# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5555/ave_caesar
spring.datasource.username=avecaesar
spring.datasource.password=Zelda214!
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Hibernate Settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
```

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error in Browser

**Error:** `Access-Control-Allow-Origin header missing`

**Solution:**
1. Check `CorsConfig.java` includes your origin
2. Check `JwtAuthenticationFilter.java` does NOT have hardcoded CORS headers (remove any `httpResponse.setHeader("Access-Control-Allow-Origin", ...)`)
3. Rebuild and restart

### Issue 2: Docker Container Can't Reach Backend (502 Bad Gateway)

**Error:** Nginx returns 502, `wget` from frontend container shows "Connection refused"

**Cause:** `server.address=127.0.0.1` in application.properties makes Spring Boot only listen on localhost inside the container.

**Solution:** Add `SERVER_ADDRESS: 0.0.0.0` to docker-compose.yml environment, or remove `server.address` from application.properties.

### Issue 3: Database Connection Refused

**Error:** `Connection to localhost:5555 refused`

**Solution:**
- For Docker: Make sure PostgreSQL container is running
- For local dev: Start the PostgreSQL container first:
  ```bash
  docker start avecaesar-db
  ```

### Issue 4: esbuild Version Mismatch (Frontend Build)

**Error:** `Host version "0.25.9" does not match binary version "0.27.2"`

**Solution:** Add `RUN npm rebuild esbuild` in frontend Dockerfile after `yarn install`

### Issue 5: Frontend Shows "Failed to fetch periods"

**Possible causes:**
1. Backend not running
2. CORS blocking request
3. Wrong API URL in frontend config

**Debug steps:**
```bash
# Test backend directly
curl http://localhost:8081/api/periods

# Check browser console for specific error
# Check if CORS origin is allowed
```

### Issue 6: Changes Not Reflected After Deploy

**Solution:** Rebuild containers with no cache:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

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

### Useful SQL Commands
```sql
-- Check table counts
SELECT COUNT(*) FROM periods;
SELECT COUNT(*) FROM topics;
SELECT COUNT(*) FROM chapters;
SELECT COUNT(*) FROM questions;

-- List all tables
\dt

-- Describe a table
\d periods
```

## 🔧 Useful Docker Commands

```bash
# View running containers
docker compose ps

# View logs
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Stop all containers
docker compose down

# Rebuild and start
docker compose up --build -d

# Rebuild specific service
docker compose build --no-cache frontend

# Enter a container
docker exec -it avecaesar-backend /bin/sh
docker exec -it avecaesar-frontend /bin/sh

# Test internal networking
docker exec avecaesar-frontend wget -qO- http://backend:8081/api/periods
```

## 📝 Development Notes

### Key Configuration Points

1. **CORS must be configured in CorsConfig.java only** - Do not add CORS headers manually in filters
2. **Docker networking uses service names** - `backend` not `localhost`
3. **SERVER_ADDRESS must be 0.0.0.0 for Docker** - Otherwise containers can't communicate
4. **Frontend API URL is empty in Docker** - Nginx proxies `/api` requests to backend

### Environment Variables (Docker)

| Variable | Description |
|----------|-------------|
| SERVER_PORT | Backend port (8081) |
| SERVER_ADDRESS | Bind address (0.0.0.0 for Docker) |
| SPRING_DATASOURCE_URL | PostgreSQL connection URL |
| JWT_SECRET | Secret key for JWT tokens |
| JWT_EXPIRATION | Token expiration in ms |

---

**Last Updated:** January 2026
**Version:** 2.0.0