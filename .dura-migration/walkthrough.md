# Dura Migration Walkthrough (Phases 2 & 3)

This walkthrough documents the completion of **Phase 2 (Content Reorganization)** and **Phase 3 (CMS Configuration)** of the Dura migration.

## Achieved Goals

- [x] **New Content Structure**: Created domain-specific folders (`learn/midnight`, `learn/iot-edge`, etc.)
- [x] **Content Migration**: Moved existing concepts to new locations and updated frontmatter
- [x] **Papers Collection**: Converted MDX papers to JSON data format
- [x] **Dynamic Routing**: Implemented `/learn/[domain]/[slug]` routing system
- [x] **CMS Configuration**: Updated `admin/config.yml` with new collections and repo settings

## Changes Overview

### 1. Directory Structure
Created the following structure in `src/content/`:
```text
src/content/
├── learn/
│   ├── midnight/
│   │   ├── concepts/
│   │   └── protocols/
│   ├── federated-learning/
│   │   └── concepts/
│   └── iot-edge/
│       └── concepts/
└── papers/
```

### 2. Content Collections (`src/content/config.ts`)
Added two new collections:
- `learn`: For educational content (concepts, protocols)
- `papers`: For research paper metadata (JSON)

### 3. CMS Configuration (`public/admin/config.yml`)
Updated the Decap CMS config:
- Changed repo to `solkem/dura`
- Added new `learn-*` collections
- Added `papers` collection
- Retained legacy collections (`concepts`, `projects`) for safety

## Validation

### Build Verification
Ran `npm run build` successfully (after fixing Node adapter version for Fly.io compatibility).

### CMS Verification
The CMS configuration at `/admin/index.html` (which loads `config.yml`) is now pointing to the new repository and defines the new content schemas.

## Deployment Setup

### 3. DigitalOcean Deployment (Completed)

Successfully deployed the application to a 1GB Droplet using GitHub Actions for CI/CD.
- **URL**: [https://dura.disruptiveiot.org](https://dura.disruptiveiot.org) (Live ✅)
- **Repo**: [solkem/dura](https://github.com/solkem/dura)
- **Infrastructure**:
    - **Host**: DigitalOcean Droplet (Ubuntu 24.04)
    - **Container**: `ghcr.io/solkem/dura:latest` (Node 20 Alpine)
    - **Reverse Proxy**: Nginx (handling SSL termination and routing)

#### Troubleshooting Resolution
Users may encounter `ERR_SSL_PROTOCOL_ERROR` if hosting multiple subdomains on the same Droplet.
- **Known Issue (Deployment Build)**: The deployment pipeline is currently failing due to a Tailwind CSS error in `Search.astro` (`Cannot apply unknown utility class bg-slate-50`). This needs to be resolved before the new features will appear on the live site.
- **Known Issue (Local Build)**: `npm run build` on Windows may fail due to `better-sqlite3`.
- **Fix**: Consolidate certificates into a single file to handle SNI correctly.
    ```bash
    certbot --nginx --expand -d disruptiveiot.org -d dura.disruptiveiot.org
    ```
- **Nginx Config**: Ensure both sites listen on IPv4 (`listen 443 ssl http2;`) and IPv6 (`listen [::]:443 ssl http2;`).

![Deployment Success](dura_homepage_1768499889472.png)

### How to Deploy
The system is fully automated.
1.  **Trigger**: Just push to the `main` branch.
2.  **Monitor**: Watch the "Deploy to DigitalOcean" action in GitHub.

### Troubleshooting
If deployment fails, check:
1.  **Secrets**: Ensure `DO_HOST`, `DO_USERNAME`, `DO_SSH_KEY` are correct.
2.  **Server**: SSH in (`ssh root@...`) and check `docker ps` to see if the container is running.
3.  **Logs**: Run `docker logs dura` on the server to see application logs.

## Next Steps

1.  **Verify**: Visit `https://dura.disruptiveiot.org` to see your new site!
2.  **Future Phases**: 
    - Phase 4: Infrastructure (Database, Auth)
    - Phase 5: Core Features (Search, Workspace)
