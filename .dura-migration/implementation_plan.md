# DigitalOcean Migration Plan

Goal: Switch deployment target from Fly.io to a DigitalOcean Droplet (`dura.disruptiveiot.org`) to optimize costs and leverage existing infrastructure.

## 1. Codebase Optimization (Memory & Size)
Since the target server has 1GB RAM and hosts another site, we must minimize footprint.

### [MODIFY] `package.json`
- **Move to `devDependencies`**: `typescript`, `vite`, `tailwindcss`, `@types/*`, `@astrojs/check`.
- **Remove**: `@astrojs/vercel` (unused).
- **Result**: Smaller `node_modules` in production.

### [MODIFY] `Dockerfile`
- **Optimization**: Currently copies *all* `node_modules` (including devDeps) to the runner.
- **Change**: In `runner` stage, run `npm install --omit=dev` instead of copying `node_modules`.
- **Env**: Set `NODE_ENV=production`.

## 2. Deployment Workflow (GitHub Actions)
We will use **GHCR (GitHub Container Registry)** to store images and **SSH** to deploy them.

### [MODIFY] `.github/workflows/deploy.yml`
- **Builder**: Use `docker/build-push-action` to push to `ghcr.io/solkem/dura:latest`.
- **Deployer**: Use `appleboy/ssh-action` to execute commands on DigitalOcean:
  1. `docker login ghcr.io` (using `GITHUB_TOKEN`)
  2. `docker pull ghcr.io/solkem/dura:latest`
  3. `docker stop dura || true`
  4. `docker rm dura || true`
  5. `docker run -d --restart always -p 3000:4321 --name dura ghcr.io/solkem/dura:latest`
  6. `docker image prune -f` (save disk space)

## 3. Server Configuration (Manual User Steps)
Since we cannot automate server setup without SSH access, we will provide a **Setup Script** for the user.

### New Artifact: `deployment-guide.md`
- **Secrets to Add**: `DO_HOST`, `DO_USERNAME`, `DO_SSH_KEY`.
- **Nginx Config**:
  ```nginx
  server {
      server_name dura.disruptiveiot.org;
      location / {
          proxy_pass http://localhost:3000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }
  }
  ```

## Verification Plan
1. **Local Build**: Verify `docker build` works with new dependency structure.
2. **Workflow Check**: Verify `.github/workflows/deploy.yml` syntax.
3. **Dry Run**: User will need to add secrets and verify the first run.
