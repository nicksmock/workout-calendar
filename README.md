# Olympic Workout Calendar - Redesigned

A comprehensive, production-ready fitness tracking application with video demonstrations, progress analytics, and robust data persistence. Built for personal use by a fitness-focused couple seeking consistent workout routines and measurable progress.

## 🎯 Project Overview

### Business Goals
- Modernize existing React codebase with improved architecture
- Implement production-ready infrastructure with database integration
- Create maintainable, scalable foundation for future enhancements
- Reduce technical debt and improve application performance

### User Goals
- Access clear, high-quality video demonstrations for proper exercise form
- Track workout completion, reps, sets, weights, and personal progress
- Navigate an intuitive, visually appealing interface
- Maintain workout history and analyze fitness progression patterns

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18.2** - Modern UI library with hooks
- **Vite 4.4** - Fast build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Lucide React** - Modern icon library

#### Backend
- **Node.js 18** - JavaScript runtime
- **Express 4** - Web application framework
- **TypeScript 5** - Type-safe JavaScript
- **PostgreSQL 15** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

#### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **Health Checks** - Service monitoring

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Port 8680)               │
│              React SPA + Nginx (Reverse Proxy)          │
│                                                         │
│  - Serves React application                            │
│  - Proxies /api/* requests to backend                  │
│  - Handles static asset caching                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ HTTP Proxy
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API (Port 3001)               │
│               Express + TypeScript + Node.js            │
│                                                         │
│  Endpoints:                                             │
│  - /api/auth      → Authentication & User Management    │
│  - /api/workouts  → Workouts, Sessions, Exercises       │
│  - /api/progress  → Stats, PRs, Analytics, Goals        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ SQL Queries
                  ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Port 5432)            │
│                                                         │
│  Tables:                                                │
│  - users, user_preferences                              │
│  - exercises, workout_templates                         │
│  - workout_sessions, exercise_logs                      │
│  - progress_measurements, user_goals                    │
└─────────────────────────────────────────────────────────┘
```

## 📦 Database Schema

### Core Tables

#### Users & Authentication
- `users` - User accounts with authentication
- `user_preferences` - User settings and preferences

#### Workout System
- `exercises` - Exercise library with videos
- `workout_templates` - Predefined workout programs
- `workout_template_exercises` - Exercises within templates
- `workout_sessions` - User's completed/scheduled workouts
- `exercise_logs` - Set-by-set exercise tracking

#### Progress Tracking
- `progress_measurements` - Body measurements and photos
- `user_goals` - User fitness goals and tracking

### Key Features
- UUID primary keys for scalability
- Automatic timestamp triggers
- Comprehensive indexes for performance
- Pre-built views for common queries
- Foreign key constraints for data integrity

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Port 8680 (frontend) and 3001 (backend) available
- External Docker network named "olympia"

### Quick Start

1. **Clone and navigate to the repository**
```bash
cd /home/user/workout-calendar
```

2. **Create the external network (if not exists)**
```bash
docker network create olympia
```

3. **Build and start all services**
```bash
docker-compose up -d --build
```

4. **Verify services are running**
```bash
docker-compose ps
```

5. **Access the application**
- Frontend: http://localhost:8680
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

### Default Users

Two users are created automatically:

**User 1 (Sarah)**
- Username: `sarah`
- Password: `workout2024`

**User 2 (Partner)**
- Username: `partner`
- Password: `workout2024`

⚠️ **Change these passwords in production!**

## 🔧 Development

### Running Services Individually

**Frontend Development**
```bash
cd /home/user/workout-calendar
npm install
npm run dev
```

**Backend Development**
```bash
cd /home/user/workout-calendar/backend
npm install
npm run dev
```

**Database Only**
```bash
docker-compose up postgres -d
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DB_HOST=postgres
DB_PORT=5432
DB_NAME=workout_calendar
DB_USER=workout_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8680
```

#### Frontend
Set `VITE_API_URL` in docker-compose.yml or .env:
```env
VITE_API_URL=http://localhost:3001/api
```

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with username and password
```json
{
  "username": "sarah",
  "password": "workout2024"
}
```

#### POST /api/auth/register
Register a new user
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "Full Name"
}
```

#### GET /api/auth/profile
Get current user profile (requires JWT token)

### Workout Endpoints

#### GET /api/workouts/templates
Get all workout templates

#### GET /api/workouts/templates/:id
Get specific workout template with exercises

#### GET /api/workouts/exercises
Get all exercises (optional filters: category, difficulty)

#### GET /api/workouts/sessions
Get user's workout sessions (filters: week, isCompleted, limit, offset)

#### POST /api/workouts/sessions
Create a new workout session

#### PUT /api/workouts/sessions/:id
Update workout session

#### POST /api/workouts/sessions/:sessionId/exercises
Log exercise performance (sets, reps, weight)

### Progress Endpoints

#### GET /api/progress/stats
Get user statistics (filters: weekStart, weekEnd)

#### GET /api/progress/weekly
Get weekly summary

#### GET /api/progress/records
Get personal records (PRs)

#### GET /api/progress/exercises/:exerciseId
Get progress history for specific exercise

#### GET /api/progress/measurements
Get body measurements history

#### POST /api/progress/measurements
Create new body measurement

#### GET /api/progress/goals
Get user goals

#### POST /api/progress/goals
Create new goal

## 🗄️ Database Management

### Access PostgreSQL Container
```bash
docker exec -it workout-calendar-db psql -U workout_user -d workout_calendar
```

### Backup Database
```bash
docker exec workout-calendar-db pg_dump -U workout_user workout_calendar > backup.sql
```

### Restore Database
```bash
docker exec -i workout-calendar-db psql -U workout_user workout_calendar < backup.sql
```

### Reset Database
```bash
docker-compose down -v
docker-compose up -d
```

## 📊 Monitoring

### Health Checks

**Frontend Health**
```bash
curl http://localhost:8680/health
```

**Backend Health**
```bash
curl http://localhost:3001/health
```

**Database Health**
```bash
docker exec workout-calendar-db pg_isready -U workout_user -d workout_calendar
```

### Logs

**View all logs**
```bash
docker-compose logs -f
```

**View specific service logs**
```bash
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend
```

## 🔒 Security Considerations

### Production Checklist
- [ ] Change default database password
- [ ] Generate secure JWT secret (min 256-bit)
- [ ] Update CORS_ORIGIN to production domain
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Implement rate limiting
- [ ] Regular database backups
- [ ] Monitor for security updates
- [ ] Use environment variables for secrets
- [ ] Implement log rotation

### Password Requirements
- Minimum 8 characters
- Use bcrypt with 10 rounds
- Consider enforcing complexity rules

## 🎨 Frontend Architecture (To Be Implemented - Phase 2)

The current frontend will be refactored into:
- Component library with reusable UI elements
- State management (Context API or Zustand)
- API client with error handling
- Protected routes with authentication
- Enhanced video player component
- Progress visualization components

## 📈 Progress Tracking Features

### Current Capabilities
- ✅ Workout completion tracking
- ✅ Sleep quality and energy levels
- ✅ Exercise-specific logging (sets, reps, weight, duration)
- ✅ Personal records (PRs) tracking
- ✅ Weekly summaries
- ✅ Body measurements
- ✅ Goal setting and tracking

### Planned Enhancements (Phases 3-4)
- 📊 Interactive progress charts
- 📸 Progress photo management
- 🎯 Advanced analytics
- 📱 Mobile-optimized interface
- 🎥 Embedded video player
- 🔍 Exercise search and filtering

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :8680
lsof -i :3001

# Stop the service or change ports in docker-compose.yml
```

### Database Connection Issues
```bash
# Check if database is ready
docker-compose logs postgres

# Restart services
docker-compose restart backend
```

### Frontend Not Loading
```bash
# Check nginx logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

## 📝 Project Structure

```
workout-calendar/
├── backend/                    # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── db/                # Database utilities
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   └── server.ts          # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   ├── dockerfile
│   └── .env.example
│
├── database/                   # Database schemas and seeds
│   ├── schema.sql             # Database structure
│   └── seed.sql               # Initial data
│
├── src/                       # Frontend React application
│   ├── olympic_workout_calendar.tsx
│   └── main.jsx
│
├── docker-compose.yml         # Multi-container orchestration
├── dockerfile                 # Frontend Dockerfile
├── nginx.conf                 # Nginx configuration
├── package.json               # Frontend dependencies
├── vite.config.js            # Vite configuration
└── README.md                  # This file
```

## 🤝 Contributing

This is a personal project, but the architecture and patterns can serve as a reference for similar fitness tracking applications.

## 📄 License

MIT License - Feel free to use this as a reference for your own projects.

## 🎯 Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] PostgreSQL database schema
- [x] Backend API with TypeScript
- [x] Docker Compose setup
- [x] Authentication system
- [x] Core workout tracking endpoints

### 🚧 Phase 2: Frontend Refactor (Next)
- [ ] Modular component architecture
- [ ] API integration
- [ ] Authentication UI
- [ ] Enhanced workout logging interface

### 📅 Phase 3: Video & UX (Planned)
- [ ] Embedded video player
- [ ] Modern design system
- [ ] Responsive layouts
- [ ] Mobile optimization

### 📊 Phase 4: Analytics (Planned)
- [ ] Progress dashboard with charts
- [ ] Workout history with filtering
- [ ] Goal tracking visualization
- [ ] Advanced statistics

### 🚀 Phase 5: Deployment (Planned)
- [ ] Production optimization
- [ ] Comprehensive testing
- [ ] Performance tuning
- [ ] Documentation finalization

---

**Built with ❤️ for fitness and progress tracking**
