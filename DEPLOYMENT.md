# Dura Deployment Guide

This guide documents the deployment process and common issues for deploying Dura to production.

## Architecture Overview

```
Internet → NGINX (SSL Termination) → Docker Container (Astro/Node.js)
                ↓                            ↓
         Port 443 (HTTPS)             Port 3000 → 4321
```

## Prerequisites

- DigitalOcean Droplet (or similar VPS)
- Docker installed
- NGINX installed
- SSL certificate (Let's Encrypt recommended)
- GitHub Container Registry access

## Deployment Steps

### 1. Build and Push Docker Image

From your local machine (Mac with Apple Silicon):

```bash
# Login to GitHub Container Registry
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Build for amd64 (important for x86 servers!)
docker buildx build --platform linux/amd64 -t ghcr.io/solkem/dura:latest --push .
```

**⚠️ Important:** Apple Silicon Macs build ARM images by default. Always use `--platform linux/amd64` for x86 servers.

### 2. Deploy on Server

SSH into your Droplet:

```bash
# Login to registry
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Pull latest image
docker pull ghcr.io/solkem/dura:latest

# Stop and remove old container
docker stop dura && docker rm dura

# Run new container with environment variables
docker run -d \
  --name dura \
  -p 3000:4321 \
  -v /app/data:/app/data \
  -e GOOGLE_AI_API_KEY=your_api_key_here \
  ghcr.io/solkem/dura:latest
```

### 3. NGINX Configuration

Create `/etc/nginx/sites-enabled/dura`:

```nginx
server {
    listen 80;
    server_name dura.disruptiveiot.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dura.disruptiveiot.org;
    
    ssl_certificate /etc/letsencrypt/live/disruptiveiot.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/disruptiveiot.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # IMPORTANT: Allow larger file uploads (default is 1MB)
    client_max_body_size 50m;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and reload:
```bash
nginx -t
systemctl reload nginx
```

## Common Issues & Solutions

### 1. "Unexpected token '<'" Error / API Returns HTML

**Cause:** The API endpoint is returning an error page instead of JSON.

**Debug steps:**
```bash
# Check container logs
docker logs dura --tail 50

# Test API directly
docker exec dura sh -c "wget -qO- --post-data='' http://localhost:4321/api/agents/process-pdf 2>&1"
```

**Common causes:**
- Missing environment variable (GOOGLE_AI_API_KEY)
- Missing npm package (dotenv was in devDependencies)
- Wrong architecture (ARM image on x86 server)

### 2. File Upload Fails Silently

**Cause:** NGINX's default `client_max_body_size` is 1MB. Large PDFs get rejected.

**Solution:** Add to NGINX config:
```nginx
client_max_body_size 50m;
```

### 3. "Cannot find package 'dotenv'" in Production

**Cause:** `dotenv` was in `devDependencies`, not `dependencies`. Production only installs production deps.

**Solution:** Either:
- Move `dotenv` to `dependencies` in package.json, OR
- Remove `import 'dotenv/config'` and pass env vars via Docker `-e` flag

### 4. Wrong Architecture Warning

**Cause:** Image built on Apple Silicon Mac but server is x86.

**Error:**
```
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64)
```

**Solution:** Always build with `--platform linux/amd64`:
```bash
docker buildx build --platform linux/amd64 -t ghcr.io/solkem/dura:latest --push .
```

### 5. Database Lost After Container Restart

**Cause:** Database wasn't persisted in a volume.

**Solution:** Always mount the data volume:
```bash
-v /app/data:/app/data
```

### 6. User Can't Login After Deployment

**Cause:** Production database is empty/different from local.

**Solution:** Create an invite token:
```bash
sqlite3 /app/data/dura.db "INSERT INTO invitation (id, email, role, token, expires_at) VALUES ('invite1', 'admin@dura.dev', 'admin', 'your-token', $(($(date +%s) + 86400))000);"
```

Then signup at: `https://your-domain/signup?invite=your-token`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_AI_API_KEY` | Yes | Gemini API key for AI agents |
| `DB_URL` | No | Database path (default: `/app/data/dura.db`) |
| `HOST` | No | Server host (default: `0.0.0.0`) |
| `PORT` | No | Server port (default: `4321`) |

## Useful Commands

```bash
# View container logs
docker logs -f dura

# Check if container is running
docker ps

# Execute command in container
docker exec -it dura sh

# Check database
sqlite3 /app/data/dura.db "SELECT username FROM user;"

# Test NGINX config
nginx -t

# Reload NGINX
systemctl reload nginx
```
