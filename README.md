# Olympic Workout Calendar - Docker Setup for Unraid

This guide will help you deploy your Olympic Workout Calendar app on Unraid using Docker.

## File Structure

Create the following directory structure on your Unraid server:

```
/mnt/user/appdata/olympic-workout-calendar/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── vite.config.js
├── index.html
├── .dockerignore
└── src/
    ├── main.jsx
    └── olympic_workout_calendar.tsx
```

## Setup Instructions

### Method 1: Using Docker Compose (Recommended)

1. **Create the app directory:**
   ```bash
   mkdir -p /mnt/user/appdata/olympic-workout-calendar/src
   ```

2. **Copy all the files** from the artifacts into their respective locations.

3. **Copy your workout calendar component:**
   Place your `olympic_workout_calendar.tsx` file in the `src/` directory.

4. **Build and run the container:**
   ```bash
   cd /mnt/user/appdata/olympic-workout-calendar
   docker-compose up -d
   ```

### Method 2: Using Unraid Docker Templates

1. **Add Container in Unraid UI:**
   - Go to Docker tab in Unraid
   - Click "Add Container"
   - Fill in the following:

   **Basic Settings:**
   - Name: `olympic-workout-calendar`
   - Repository: Build from the directory containing your Dockerfile
   - Port: `8080:80`

   **Advanced Settings:**
   - Restart Policy: `unless-stopped`
   - Network Type: `bridge`

2. **Build the image:**
   ```bash
   cd /mnt/user/appdata/olympic-workout-calendar
   docker build -t olympic-workout-calendar .
   ```

## Access Your App

Once running, access your workout calendar at:
- **Local Network:** `http://YOUR-UNRAID-IP:8080`
- **If using reverse proxy:** Configure your proxy to point to port 8080

## Features Included

✅ **Multi-stage Docker build** for optimized image size  
✅ **Nginx web server** for production serving  
✅ **Health checks** for container monitoring  
✅ **Unraid-specific labels** for easy management  
✅ **Volume mounting** for data persistence  
✅ **Security headers** and optimized caching  

## Customization Options

### Change Port
Edit the `docker-compose.yml` file and change `8080:80` to your preferred port.

### Add SSL/TLS
For HTTPS, consider using:
- **Nginx Proxy Manager** (available in Unraid Community Apps)
- **Swag** (Secure Web Application Gateway)
- **Traefik** reverse proxy

### Data Persistence
The workout data is stored in browser localStorage by default. For multi-device sync, you could:
1. Modify the app to use a backend database
2. Set up file-based storage with volume mounts
3. Integrate with a cloud storage solution

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs olympic-workout-calendar

# Rebuild if needed
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Can't access the app
1. Check if port 8080 is available
2. Verify firewall settings on Unraid
3. Check container status: `docker ps`

### Build issues
Ensure all files are in the correct locations and have proper permissions:
```bash
chmod -R 755 /mnt/user/appdata/olympic-workout-calendar
```

## Updates

To update the app:
1. Modify your source files
2. Rebuild the container:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## Performance Notes

- The app is built as a static React SPA
- Nginx serves static files efficiently
- Container uses Alpine Linux for minimal size
- Health checks ensure reliability
- Gzip compression enabled for faster loading

Your Olympic Workout Calendar will now be available as a self-hosted web app on your Unraid server!