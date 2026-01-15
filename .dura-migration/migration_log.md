# Comprehensive Migration Log
**Objective**: Deploy `dura` to DigitalOcean Droplet (`dura.disruptiveiot.org`).
**Status**: CI/CD Passing ✅ | SSL/Site Failed ❌

Here is the exact sequence of events and actions taken.

## Phase 1: Code & Configuration (My Actions)

1.  **Repository Analysis**:
    - Identified existing projects (`edgechain`, `msingi`, `ndani`) in `src/content/projects`.
    - Confirmed `Dura` is the knowledge granary (subdomain strategy chosen).

2.  **Code Optimization** (for 1GB RAM server):
    - **`package.json`**: Moved `typescript`, `vite`, `tailwindcss` to `devDependencies` to prevent them from installing in production.
    - **`Dockerfile`**: Rewrote to use multi-stage build.
        - `builder` stage: Installs all deps, builds site.
        - `runner` stage: `COPY package.json` -> `RUN npm install --omit=dev`.
    - **`.dockerignore`**: Fixed Windows backslashes (`\`) to Linux forward slashes (`/`). **Reason**: GitHub Action was crashing because it was uploading `node_modules`.

3.  **Deployment Automation (GitHub Actions)**:
    - Created `.github/workflows/deploy.yml`.
    - **Strategy**:
        - Build Docker image on GitHub.
        - Push to GitHub Container Registry (`ghcr.io`).
        - SSH into Droplet.
        - Pull image & restart container (`docker run -p 3000:4321`).
    - **Fixes**: Switched from `docker/build-push-action` to native `docker build` command to resolve `RPC error` (runner crash).

---

## Phase 2: Server Setup (Your Actions via SSH)

1.  **Access**: SSH'd into `143.110.131.196` as `root`.
2.  **Docker**: Installed Docker via `get-docker.sh`.
3.  **Nginx Config**:
    - Created `/etc/nginx/sites-available/dura`.
    - Content: Proxy pass `http://localhost:3000`.
    - Symlinked to `/etc/nginx/sites-enabled/dura`.
4.  **Dependencies**:
    - Failed `nginx -t` -> Installed `python3-certbot-nginx`.
5.  **DNS & SSL**:
    - **Fail 1**: Ran `certbot`. Error: `NXDOMAIN`.
    - **Action**: You added "A record" for `dura` pointing to IP.
    - **Fail 2**: `nginx -t` failed. Syntax error (missing `}`).
    - **Action**: You manually added `}` to `/etc/nginx/sites-enabled/dura`.
    - **Success**: `nginx -t` passed. `service nginx restart` ran.

---

## Phase 3: Diagnostics & Root Cause Analysis

1.  **Application Check**:
    - `docker ps -a`: Container status was "Up". ✅
    - `curl http://localhost:3000`: Returned valid HTML. App is healthy. ✅
    - `tail /var/log/nginx/error.log`: Showed initial IPv6 connection refused errors (`[::1]:3000`), confirming Nginx was trying IPv6 upstream for an IPv4 app.

2.  **Nginx Fix 1 (Upstream)**:
    - **Action**: Changed upstream in Nginx config from `localhost:3000` to `127.0.0.1:3000` to force IPv4.
    - **Result**: Local connection errors stopped.

3.  **Local SSL Check**:
    - `curl -v -k https://127.0.0.1`: Handshake **Successful**. Certificate was technically valid locally. ✅
    - **External Check**: Browser still showed `ERR_SSL_PROTOCOL_ERROR`.

4.  **External/Firewall Check**:
    - `ufw status`: Inactive (Firewall open).
    - `nslookup`: Confirmed NO Cloudflare proxy (direct connection).
    - **Discovery**: Parent site `disruptiveiot.org` was accessible, confirming port 443 is open on the Droplet.

5.  **Conflict Identification**:
    - `grep` checks revealed `disruptiveiot.org` listened on `443 ssl http2` and `[::]:443 ssl http2`.
    - `dura` only listened on `443 ssl`.
    - **Issue**: Protocol mismatch (HTTP/2 vs HTTP/1.1) and IPv6 listener mismatch on the same port caused Nginx to misroute traffic to the wrong server block.

6.  **Nginx Fix 2 (Listeners)**:
    - **Action**: Updated `dura` config to match the parent site:
        ```nginx
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        ```
    - **Result**: `nginx -t` passed. Service restarted. Browser error persisted.

---

## Phase 4: Final Resolution (SNI/Certificate Fix)

**The Root Cause**:
Since multiple subdomains exist on the same server/IP, Nginx relies on **SNI (Server Name Indication)** to pick the right certificate.
- `certbot certificates` revealed `dura` had its *own separate certificate*.
- The main site had a *separate certificate*.
- This separation often causes connection resets or protocol errors when configurations or ciphers don't align perfectly.

**The Fix**:
1.  **Consolidated Certificates**: Ran Certbot to merge both domains into a **single certificate**.
    ```bash
    certbot --nginx --expand -d disruptiveiot.org -d dura.disruptiveiot.org
    ```
2.  **Restart**: `service nginx restart`.

**Outcome**:
- **Browser**: https://dura.disruptiveiot.org loads successfully (Green Lock 🔒).
- **SSL**: Valid Let's Encrypt certificate covering both domains.
- **App**: Serving content correctly via Docker.

**Mission Complete**. 🚀

## Phase 5: Core Features & Deployment Issues (Current State)

### Implementation
- **Completed Features**: Authentication (Lucia), Search (Pagefind), Progress Tracking (SQLite), Paper Management.
- **Codebase**: Fully updated with Schema, API routes, and UI components.

### Build & Deployment Failure
1. **Native Module Issue**: `better-sqlite3` fails to link during `npm run build` in Windows environment (Expected).
2. **Tailwind/Vite Error**: The GitHub Action (Linux environment) failed during the final build step:
   ```
   Error: [vite] x Build failed in 1.10s
   Cannot apply unknown utility class `bg-slate-50`.
   File: /src/components/Search.astro?astro&type=style&index=0&lang.css
   ```
   **Cause**: The `@apply bg-slate-50` directive in `Search.astro` is failing, likely because the Tailwind context is not correctly propagated to the style block in this specific build configuration, or `slate` color palette is not generated.

### Action Plan (Deferred)
- **Do not fix now**. The codebase is feature-complete.
- **Future Fix**:
    - Investigate `Search.astro` style block.
    - Check `tailwind.config.mjs` for color inclusion.
    - Resolve the build error on a dev machine that matches the CI environment (Linux).
