# Olympic Workout Calendar - Unraid Deployment Guide

This guide will help you deploy the Olympic Workout Calendar on Unraid with Traefik as your reverse proxy.

## Prerequisites

- Unraid server with Docker enabled
- Traefik container already running
- Domain name pointing to your Unraid server
- Traefik configured with SSL/TLS certificates (Cloudflare, Let's Encrypt, etc.)

## Quick Setup

### 1. Create the Traefik Network (if not exists)

SSH into your Unraid server and run:
```bash
docker network create traefik
```

To verify:
```bash
docker network ls | grep traefik
```

### 2. Clone or Upload the Repository

Option A - Clone via Git:
```bash
cd /mnt/user/appdata
git clone <repository-url> workout-calendar
cd workout-calendar
```

Option B - Upload manually:
- Upload the project folder to `/mnt/user/appdata/workout-calendar`

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cd /mnt/user/appdata/workout-calendar
cp .env.example .env
```

Edit the `.env` file with your settings:
```bash
nano .env
```

**Required Changes:**
```env
# Your domain
DOMAIN=workout.yourdomain.com

# Secure database password
POSTGRES_PASSWORD=your_secure_password_here

# JWT secret (min 32 characters)
JWT_SECRET=your_very_long_random_jwt_secret_min_32_chars

# Traefik settings (match your Traefik config)
TRAEFIK_ENTRYPOINT=https
TRAEFIK_CERTRESOLVER=cloudflare  # or letsencrypt, etc.
```

### 4. Build and Start the Containers

```bash
cd /mnt/user/appdata/workout-calendar
docker-compose -f docker-compose.traefik.yml up -d --build
```

### 5. Verify Deployment

Check container status:
```bash
docker-compose -f docker-compose.traefik.yml ps
```

Check logs:
```bash
docker-compose -f docker-compose.traefik.yml logs -f
```

### 6. Access Your Application

Navigate to your domain in a browser:
```
https://workout.yourdomain.com
```

**Note:** This application uses single-user tracking without authentication. No login is required - the app automatically tracks workouts for the seeded user.

## Network Architecture

```
Internet
    ↓
Traefik (Port 443)
    ↓
    ├─→ workout-calendar-frontend (Port 80) → React App
    │   Rule: Host(`workout.yourdomain.com`)
    │
    └─→ workout-calendar-backend (Port 3001) → API
        Rule: Host(`workout.yourdomain.com`) && PathPrefix(`/api`)

    Backend connects to:
    └─→ workout-calendar-db (Port 5432) → PostgreSQL
        (Internal network only, not exposed)
```

## Traefik Configuration Explained

### Frontend Labels
```yaml
- "traefik.enable=true"
- "traefik.http.routers.workout-frontend.rule=Host(`workout.yourdomain.com`)"
- "traefik.http.routers.workout-frontend.entrypoints=https"
- "traefik.http.routers.workout-frontend.tls=true"
- "traefik.http.routers.workout-frontend.tls.certresolver=cloudflare"
- "traefik.http.services.workout-frontend.loadbalancer.server.port=80"
```

### Backend API Labels
```yaml
- "traefik.enable=true"
- "traefik.http.routers.workout-api.rule=Host(`workout.yourdomain.com`) && PathPrefix(`/api`)"
- "traefik.http.routers.workout-api.entrypoints=https"
- "traefik.http.routers.workout-api.tls=true"
- "traefik.http.routers.workout-api.tls.certresolver=cloudflare"
- "traefik.http.services.workout-api.loadbalancer.server.port=3001"
```

## Customization

### Change the Domain

1. Update your `.env` file:
   ```env
   DOMAIN=newdomain.com
   ```

2. Rebuild the frontend (API URL is baked into build):
   ```bash
   docker-compose -f docker-compose.traefik.yml up -d --build frontend
   ```

### Change Port Exposure (Optional)

If you want to access services directly (not through Traefik), uncomment in `docker-compose.traefik.yml`:

```yaml
backend:
  ports:
    - "3001:3001"  # Expose backend directly

frontend:
  ports:
    - "8680:80"    # Expose frontend directly
```

### Use Different Traefik Settings

Update in `.env`:
```env
TRAEFIK_ENTRYPOINT=websecure    # If your Traefik uses 'websecure' instead of 'https'
TRAEFIK_CERTRESOLVER=letsencrypt # If using Let's Encrypt
```

## Management Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.traefik.yml logs -f

# Specific service
docker-compose -f docker-compose.traefik.yml logs -f backend
docker-compose -f docker-compose.traefik.yml logs -f frontend
docker-compose -f docker-compose.traefik.yml logs -f postgres
```

### Restart Services
```bash
# All services
docker-compose -f docker-compose.traefik.yml restart

# Specific service
docker-compose -f docker-compose.traefik.yml restart backend
```

### Stop Services
```bash
docker-compose -f docker-compose.traefik.yml down
```

### Update Application
```bash
cd /mnt/user/appdata/workout-calendar
git pull  # or upload new files
docker-compose -f docker-compose.traefik.yml up -d --build
```

### Backup Database
```bash
docker exec workout-calendar-db pg_dump -U workout_user workout_calendar > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker exec -i workout-calendar-db psql -U workout_user workout_calendar < backup_20240101.sql
```

### Reset Database (⚠️ Deletes all data!)
```bash
docker-compose -f docker-compose.traefik.yml down -v
docker-compose -f docker-compose.traefik.yml up -d
```

## Troubleshooting

### Service Not Accessible via Domain

1. **Check Traefik logs:**
   ```bash
   docker logs traefik
   ```

2. **Verify Traefik network:**
   ```bash
   docker network inspect traefik
   ```
   Both `workout-calendar-frontend` and `workout-calendar-backend` should be listed.

3. **Check Traefik dashboard** (if enabled) to see if routes are registered.

### CORS Errors

If you see CORS errors in the browser console:

1. Verify `CORS_ORIGIN` in `.env` matches your domain:
   ```env
   CORS_ORIGIN=https://workout.yourdomain.com
   ```

2. Rebuild backend:
   ```bash
   docker-compose -f docker-compose.traefik.yml up -d --build backend
   ```

### Database Connection Errors

1. **Check if database is healthy:**
   ```bash
   docker-compose -f docker-compose.traefik.yml ps
   ```

2. **View database logs:**
   ```bash
   docker-compose -f docker-compose.traefik.yml logs postgres
   ```

3. **Verify credentials match** between `.env` and backend environment.

### Frontend Shows API Errors

1. **Check if API is accessible:**
   ```bash
   curl -k https://workout.yourdomain.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Verify VITE_API_URL is correct:**
   The frontend needs to be rebuilt if you change domains:
   ```bash
   docker-compose -f docker-compose.traefik.yml up -d --build frontend
   ```

### SSL Certificate Issues

1. **Verify Traefik certificate resolver is working:**
   - Check Traefik logs for certificate generation
   - Ensure DNS is pointing to your server
   - Check firewall allows ports 80 and 443

2. **Test with HTTP temporarily:**
   In `.env`, change:
   ```env
   TRAEFIK_ENTRYPOINT=http
   ```
   Then rebuild.

## Security Best Practices

1. **Use strong database password** in your .env file
2. **Keep containers updated** regularly
3. **Enable Traefik authentication** if exposing to internet (recommended for single-user apps)
4. **Set up regular database backups**
5. **Monitor logs** for suspicious activity
6. **Restrict network access** via firewall rules if needed

**Note:** This app has no built-in authentication. For internet exposure, consider adding Traefik BasicAuth or OAuth middleware for access control.

## Unraid-Specific Tips

### Auto-Start on Boot

In Unraid Docker settings for each container:
- Set **Autostart:** `Yes`

### Resource Limits

Add to `docker-compose.traefik.yml` for each service:
```yaml
services:
  postgres:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 256M
```

### Appdata Backup

Ensure `/mnt/user/appdata/workout-calendar` is included in your Unraid backup strategy.

## Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.traefik.yml logs -f`
2. Review [TESTING.md](./TESTING.md) for feature testing
3. Check [README.md](./README.md) for general documentation

---

**Enjoy your workout tracking! 💪**
