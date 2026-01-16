# Dura Migration Task List

## Phase 6: Build Fixes & Deployment Verification ✅

### Build Errors Fixed
- [x] `src/components/Search.astro` - Replaced `@apply` with standard CSS
- [x] `src/auth.ts` - Fixed `DrizzleSQLiteAdapter` import
- [x] `src/pages/papers/[slug].astro` - Fixed data collection routing (`.id` not `.slug`)
- [x] `src/pages/papers/index.astro` - Fixed authors rendering and links
- [x] `src/pages/projects/[...slug].astro` - Implemented `getStaticPaths`
- [x] All API routes - Added `prerender = false` for SSR

### SSL/HTTPS Configuration
- [x] Consolidated certificates with `certbot --expand`
- [x] Created separate nginx server block for dura subdomain
- [x] Removed duplicate/conflicting nginx configs
- [ ] **SSL still intermittent** - needs further investigation

### Database & Auth
- [x] SQLite database initialized on server (`/app/local.db`)
- [x] User, session, user_progress, user_stars tables created
- [x] Signup flow verified working
- [x] Login flow verified working

---

## Remaining Work

### SSL Issue (Priority: High)
- [ ] Debug intermittent `ERR_SSL_PROTOCOL_ERROR`
- [ ] Check nginx logs: `tail -f /var/log/nginx/error.log`
- [ ] Consider regenerating SSL certificate

### Database Persistence (Priority: Medium)
- [x] Add volume mount to Dockerfile for `/app/data`
- [x] Set `DB_URL=/app/data/dura.db` environment variable
- [x] Add database migration/init script to container startup

### Future Enhancements
- [ ] Add Pagefind search index generation
- [ ] Set up monitoring/uptime checks
- [ ] Configure auto-renewal for SSL certificates

---

## Server Access Info
- **Server IP**: `143.110.131.196`
- **Direct Access**: `http://143.110.131.196:3000`
- **Domain**: `https://dura.disruptiveiot.org` (SSL intermittent)
- **Container**: `docker ps` shows `dura` running on port 3000→4321
