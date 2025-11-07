# Olympic Workout Calendar 🏋️

A modern, full-stack fitness tracking application with beautiful glassmorphism UI, embedded video player, comprehensive analytics, and data persistence.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📅 Interactive Workout Calendar
- **12-Week Progressive Program** with 3 phases (Foundation → Building → Athletic Performance)
- **Weekly View** with day-by-day workout breakdown
- **Visual Progress Tracking** with completion indicators and percentage
- **Assessment Weeks** (4, 8, 12) with comprehensive performance stats

### 🎥 Embedded Video Player
- **In-App Video Playback** - Watch exercise demonstrations without leaving the app
- **YouTube Integration** with custom glassmorphism-styled modal player
- **Autoplay & Fullscreen** support for optimal viewing experience

### 📊 Progress Dashboard
- **Overview Stats Cards**: Total workouts, completion rate, avg sleep/energy, personal records
- **Weekly Completion Chart**: Bar chart showing workout consistency over 12 weeks
- **Wellness Trends**: Area charts tracking sleep quality and energy levels
- **Personal Records**: Best push-ups and plank hold times

### 📜 Workout History
- **Searchable Log**: Find workouts by name, notes, week, or day
- **Smart Filters**: View all, completed, or planned workouts
- **Detailed Cards**: See stats, notes, and performance metrics
- **Real-time Results**: Instant search and filter updates

### 💾 Data Persistence
- **PostgreSQL Database** for reliable data storage
- **RESTful API** for workout session management
- **Automatic Sync** - Load and save data seamlessly
- **Error Handling** with user-friendly messages

### 🎨 Modern UI/UX
- **Jeton Theme**: Coral-to-orange gradient (#F85C70 → #F6A85E)
- **Glassmorphism**: Frosted glass effects throughout
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Fade-ins, hover effects, and transitions
- **Dark Theme**: Easy on the eyes with high contrast

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18.2** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite 4.4** - Fast build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Recharts 2.10** - Data visualization library
- **Lucide React** - Modern icon library
- **Axios 1.6** - HTTP client for API calls

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

## 🎯 Development Roadmap

### ✅ Phase 1: Backend Infrastructure (Completed)
- [x] PostgreSQL database schema with 11 tables
- [x] Node.js/Express backend API with TypeScript
- [x] Docker Compose multi-container setup
- [x] Database seed data with 27+ exercises
- [x] RESTful API endpoints for workouts and progress

### ✅ Phase 2: Frontend Refactor & Design System (Completed)
- [x] Modular component architecture (12+ reusable components)
- [x] Jeton Theme implementation with glassmorphism
- [x] Tailwind CSS configuration with custom theme
- [x] Design tokens and global styling
- [x] Responsive layouts for mobile/tablet/desktop

### ✅ Phase 3: API Integration & Data Persistence (Completed)
- [x] Simplified API client for single-user tracking
- [x] Custom React hooks for data management
- [x] Workout session CRUD operations
- [x] Loading and error states with UI feedback
- [x] Automatic data sync and persistence

### ✅ Phase 4: Video Integration & UX (Completed)
- [x] Embedded YouTube video player component
- [x] Modal video player with glassmorphism styling
- [x] Autoplay and fullscreen support
- [x] In-app video viewing for all exercises

### ✅ Phase 5: Progress Tracking & Analytics (Completed)
- [x] Progress dashboard with recharts visualizations
- [x] Stats overview cards (workouts, completion, sleep, energy, PRs)
- [x] Weekly workout completion bar chart
- [x] Sleep and energy trend area charts
- [x] Workout history with search and filtering
- [x] Tab navigation between Calendar/Progress/History views

### 🚧 Phase 6: Testing & Optimization (In Progress)
- [x] Build system validation
- [x] Dependency installation
- [x] Testing documentation
- [ ] Manual feature testing
- [ ] Performance optimization
- [ ] Code splitting for bundle size
- [ ] Production deployment

### 📅 Future Enhancements
- [ ] PWA support for offline functionality
- [ ] Unit and E2E tests (Jest, Playwright)
- [ ] Personal records dedicated page
- [ ] Export workout data to CSV
- [ ] Print view for workout calendar
- [ ] Workout reminders/notifications
- [ ] Multiple user support
- [ ] Custom workout programs

## 📚 Documentation

- [Testing Guide](./TESTING.md) - Comprehensive testing checklist and instructions
- [API Documentation](#-api-documentation) - API endpoints and usage
- [Database Schema](#-database-schema) - Database structure and relationships

---

**Built with ❤️ for fitness enthusiasts**
