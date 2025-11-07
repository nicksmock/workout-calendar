# Product Requirements Document: Olympic Workout Calendar - Electron Desktop App

**Version:** 1.0
**Date:** November 7, 2025
**Target Platform:** macOS (M1 MacBook Air)
**Architecture:** ARM64 (Apple Silicon)
**Use Case:** Personal use only (no distribution/code signing required)

> **Note:** This PRD is designed to be moved to a new, empty repository where the Electron app will be built from scratch, referencing the original Docker/web codebase as source material.

---

## 1. Executive Summary

### 1.1 Purpose
Transform the Olympic Workout Calendar from a Docker/Unraid web application into a standalone Electron desktop application for macOS, maintaining all existing functionality and design while optimizing for native desktop performance and user experience on Apple Silicon.

### 1.2 Current State
- Full-stack web application (React + Express + PostgreSQL)
- Docker-based deployment requiring Unraid or Docker infrastructure
- Multi-container architecture with separate frontend, backend, and database services
- Browser-based access via HTTP/HTTPS
- Server-oriented configuration and networking

### 1.3 Target State
- Native macOS desktop application
- Single executable bundle (.app) for easy installation
- Local SQLite database (no external database server required)
- Offline-first architecture with all data stored locally
- Native macOS integrations (menu bar, notifications, file system)
- Optimized for M1 chip performance

### 1.4 Success Metrics
- ✅ 100% feature parity with current web application
- ✅ Identical UI/UX with glassmorphism design preserved
- ✅ App launches in < 3 seconds on M1 MacBook Air
- ✅ < 150MB app bundle size
- ✅ < 200MB memory footprint during typical usage
- ✅ Zero configuration required (just open and use)
- ✅ All workout data persists locally and reliably

---

## 2. User Stories & Requirements

### 2.1 Core User Stories

**US-1: Zero Setup**
> I want to open the app without any Docker, server, or database setup - just double-click and go.

**US-2: Offline First**
> I want to access my workouts and log progress without an internet connection, so I can use the app anywhere on my MacBook.

**US-3: Local Data**
> I want all my workout data stored locally on my Mac under my control, with easy backup/export options.

**US-4: Native macOS Feel**
> I want the app to feel like a native Mac application with proper window controls, menu bar, and familiar keyboard shortcuts.

**US-5: Keep Everything**
> I want all existing features (calendar, progress tracking, video player, history) to work exactly as they do in the web version.

---

## 2.2 New Repository Setup

Since this PRD will move to a new, empty repository, here's the recommended initial structure:

```
olympic-workout-calendar-electron/     # New repo
├── README.md                          # Setup and build instructions
├── PRD-ELECTRON-APP.md               # This document
├── package.json                       # Electron project configuration
├── package-lock.json
├── tsconfig.json                      # TypeScript config
├── electron-builder.yml               # Build configuration
│
├── frontend/                          # Copy from original repo
│   ├── src/
│   │   ├── components/               # All React components
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── data/
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── electron/                          # New Electron-specific code
│   ├── main.ts                       # Main process entry point
│   ├── preload.ts                    # Preload script for security
│   ├── menu.ts                       # Native menu configuration
│   ├── db/
│   │   ├── schema.sqlite.sql        # SQLite schema (converted)
│   │   ├── seeds.sql                # Initial data
│   │   └── connection.ts            # Database connection
│   ├── api/                          # API handlers (from backend)
│   │   ├── workouts.ts
│   │   ├── progress.ts
│   │   └── index.ts
│   └── assets/
│       ├── icon.icns                # macOS app icon
│       └── icon.png
│
└── scripts/                          # Build and utility scripts
    ├── build.sh
    └── convert-schema.js            # PostgreSQL → SQLite converter
```

**Migration from Original Repo:**
1. Copy `frontend/` directory entirely (no changes needed)
2. Copy React components, hooks, services (100% reusable)
3. Adapt `backend/src/controllers/` → `electron/api/`
4. Convert `backend/src/db/schema.sql` → `electron/db/schema.sqlite.sql`
5. Copy `backend/src/db/seeds/` data files

**What NOT to copy:**
- ❌ Docker files (Dockerfile, docker-compose.yml)
- ❌ Nginx configuration
- ❌ Traefik configuration
- ❌ UNRAID-SETUP.md
- ❌ PostgreSQL-specific code

---

## 3. Technical Architecture

### 3.1 Technology Stack

#### Desktop Framework
- **Electron 28+** - Cross-platform desktop framework
- **Electron Forge** - Build, package, and distribution tooling
- **Electron Builder** - macOS app packaging and code signing

#### Frontend (Renderer Process)
- **React 18.2** - UI library (unchanged)
- **TypeScript** - Type safety (unchanged)
- **Vite 4.4** - Build tool (unchanged)
- **Tailwind CSS 3.3** - Styling (unchanged)
- **Recharts 2.10** - Charts (unchanged)
- **Lucide React** - Icons (unchanged)

#### Backend (Main Process)
- **Node.js 18+** - JavaScript runtime (bundled with Electron)
- **TypeScript 5** - Type-safe backend code
- **better-sqlite3** - SQLite database driver (native ARM64 binary)
- **Express** (optional) - Can use IPC instead of HTTP

#### Database
- **SQLite 3** - Embedded relational database
- **Migration path** - Convert PostgreSQL schema to SQLite-compatible DDL
- **Storage location** - `~/Library/Application Support/Olympic-Workout-Calendar/workout.db`

#### Native Integrations
- **electron-store** - Persistent user preferences
- **electron-updater** - Auto-update functionality
- **@electron/notarize** - macOS app notarization

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Application                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │     Renderer Process (React SPA)                   │    │
│  │     - All existing React components                │    │
│  │     - Glassmorphism UI (preserved)                 │    │
│  │     - Vite dev server (dev) / bundled (prod)       │    │
│  └───────────────────┬────────────────────────────────┘    │
│                      │ IPC (Inter-Process Communication)    │
│                      │ or HTTP (localhost:3001)             │
│  ┌───────────────────▼────────────────────────────────┐    │
│  │     Main Process (Node.js)                         │    │
│  │     - Express API server (optional)                │    │
│  │     - IPC handlers for data operations             │    │
│  │     - Window management                            │    │
│  │     - Native menu & tray integration               │    │
│  │     - Auto-update manager                          │    │
│  └───────────────────┬────────────────────────────────┘    │
│                      │ SQL queries                          │
│  ┌───────────────────▼────────────────────────────────┐    │
│  │     SQLite Database                                │    │
│  │     ~/Library/Application Support/...              │    │
│  │     - workout.db (single file)                     │    │
│  │     - All tables migrated from PostgreSQL          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

macOS Integration:
- Dock icon with badge notifications
- Menu bar (File, Edit, View, Window, Help)
- Keyboard shortcuts (Cmd+W, Cmd+Q, etc.)
- System dialogs (file picker, alerts)
- Touch Bar support (if applicable)
```

### 3.3 Process Communication

**Option 1: IPC (Recommended)**
- Renderer → Main: `electron.ipcRenderer.invoke('get-workouts')`
- Main → Renderer: `ipcMain.handle('get-workouts', async () => { ... })`
- Benefits: Type-safe, no HTTP overhead, true native experience
- Requires: Preload script for security

**Option 2: HTTP (Minimal changes)**
- Keep Express server running in main process
- Renderer makes HTTP requests to `localhost:3001`
- Benefits: Minimal code changes, existing API works as-is
- Drawbacks: Slight overhead, less "native"

**Recommended Approach:** Start with Option 2 (HTTP) for quick migration, refactor to Option 1 (IPC) in v2.0.

---

## 4. Feature Requirements

### 4.1 Must-Have Features (MVP)

#### 4.1.1 Application Lifecycle
- ✅ **Launch:** App opens main window on startup
- ✅ **Window State:** Remember window size, position, and maximized state
- ✅ **Single Instance:** Only one instance of app runs at a time
- ✅ **Quit:** Cmd+Q closes app properly, saving all data

#### 4.1.2 Core Functionality (100% Parity)
- ✅ **Interactive Workout Calendar** - All 12 weeks with 3 phases
- ✅ **Workout Logging** - Complete/partial/skip with sleep, energy, stats, notes
- ✅ **Embedded Video Player** - YouTube integration in modal
- ✅ **Progress Dashboard** - Charts, stats, personal records
- ✅ **Workout History** - Search and filter all workouts
- ✅ **Data Persistence** - SQLite with automatic saves

#### 4.1.3 Native macOS Integration
- ✅ **Menu Bar:**
  - File: New Workout, Export Data, Preferences, Quit
  - Edit: Undo, Redo, Cut, Copy, Paste
  - View: Toggle Fullscreen, Actual Size, Zoom In/Out
  - Window: Minimize, Zoom, Close
  - Help: Documentation, About

- ✅ **Keyboard Shortcuts:**
  - Cmd+W: Close window
  - Cmd+Q: Quit app
  - Cmd+M: Minimize
  - Cmd+F: Search workouts
  - Cmd+N: Log new workout

- ✅ **System Integration:**
  - Dock icon with app name
  - Proper About dialog with version info
  - Native file picker for data export
  - System notifications (optional)

#### 4.1.4 Data Management
- ✅ **SQLite Database:**
  - Location: `~/Library/Application Support/Olympic-Workout-Calendar/workout.db`
  - Schema: 11 tables migrated from PostgreSQL
  - Views: 3 views preserved
  - Indexes: All performance indexes maintained

- ✅ **Data Import:**
  - On first launch, create empty database with schema
  - Pre-populate exercises and workout templates

- ✅ **Data Export:**
  - Export to JSON (full backup)
  - Export to CSV (workout history)
  - Save to user-selected location

#### 4.1.5 Performance
- ✅ **Startup Time:** < 3 seconds cold start on M1
- ✅ **Memory Usage:** < 200MB during typical use
- ✅ **Database Queries:** < 100ms for all queries
- ✅ **UI Responsiveness:** 60fps animations, no jank

### 4.2 Should-Have Features (v1.1)

#### 4.2.1 Auto-Updates
**Not needed for personal use** - Skip this entirely. When you want to update:
1. Pull latest code from repo
2. Rebuild with `npm run electron:build`
3. Copy new `.app` to Applications (overwrite old one)

#### 4.2.2 Enhanced Native Integration
- Menu bar extra (icon in top-right menu bar)
- Quick log workout from menu bar
- Badge count on dock icon (workouts this week)
- Touch Bar support for MacBook Pro users
- System notifications for workout reminders

#### 4.2.3 Data Backup & Sync
- Automatic local backups (daily)
- Backup location: `~/Library/Application Support/Olympic-Workout-Calendar/backups/`
- Keep last 7 days of backups
- Manual backup trigger in menu
- Import/restore from backup file

### 4.3 Nice-to-Have Features (v2.0)

#### 4.3.1 iCloud Sync
- Optional iCloud Drive sync
- Share database across user's Macs
- Conflict resolution for simultaneous edits
- Privacy-first (user controls sync)

#### 4.3.2 Widgets & Extensions
- macOS widget for Today's workout
- Apple Watch companion (separate project)
- Shortcuts app integration
- Share extension for logging workouts

#### 4.3.3 Advanced Features
- Dark mode support (system preference aware)
- Multiple user profiles (family sharing)
- Custom workout programs
- Exercise video library expansion
- Social sharing (export workout summaries)

---

## 5. Detailed Database Schema

### 5.1 Complete Table Definitions (SQLite)

This section provides the complete database schema that the Electron app will use. All tables have been adapted from PostgreSQL to SQLite-compatible syntax.

#### Table 1: users
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,  -- UUID stored as TEXT
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,  -- ISO 8601 format
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT,
    is_active INTEGER DEFAULT 1  -- 1 = true, 0 = false
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

**Purpose:** Store user account information. For personal use, only one user record needed.

**Key Fields:**
- `id`: UUID as TEXT (e.g., "550e8400-e29b-41d4-a716-446655440000")
- `is_active`: INTEGER (1 or 0 instead of BOOLEAN)
- Timestamps as TEXT in ISO 8601 format: "2025-11-07T10:30:00Z"

---

#### Table 2: exercises
```sql
CREATE TABLE exercises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,  -- 'strength', 'cardio', 'mobility', 'core'
    equipment TEXT,  -- 'kettlebell', 'bodyweight', 'dumbbells'
    muscle_groups TEXT,  -- JSON array string: '["chest","triceps"]'
    video_url TEXT,  -- YouTube URL
    video_embed_code TEXT,  -- iframe embed code
    instructions TEXT,
    difficulty_level TEXT,  -- 'beginner', 'intermediate', 'advanced'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);
```

**Purpose:** Exercise library with video links and instructions.

**Example Row:**
```json
{
  "id": "ex-001",
  "name": "Goblet Squats",
  "category": "strength",
  "equipment": "kettlebell",
  "muscle_groups": "[\"quads\",\"glutes\",\"core\"]",
  "video_url": "https://www.youtube.com/watch?v=MeIiIdhvXT4",
  "difficulty_level": "beginner"
}
```

---

#### Table 3: workout_templates
```sql
CREATE TABLE workout_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    workout_type TEXT,  -- 'A', 'B', 'Power', 'Metabolic', 'High', etc.
    phase TEXT,  -- 'Foundation', 'Building', 'Athletic Performance'
    week_number INTEGER,
    duration_minutes INTEGER,
    warm_up TEXT,  -- JSON array of warmup exercises
    cool_down TEXT,  -- JSON array of cooldown exercises
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_templates_type ON workout_templates(workout_type);
CREATE INDEX idx_workout_templates_phase ON workout_templates(phase);
CREATE INDEX idx_workout_templates_week ON workout_templates(week_number);
```

**Purpose:** Pre-defined workout programs (Foundation A/B, Power, Metabolic, etc.)

**Example Row:**
```json
{
  "id": "wt-foundation-a",
  "name": "Strength Foundation",
  "workout_type": "A",
  "phase": "Foundation",
  "duration_minutes": 20,
  "warm_up": "[\"Arm circles: 10 each direction\",\"Leg swings: 10 each leg\"]"
}
```

---

#### Table 4: workout_template_exercises
```sql
CREATE TABLE workout_template_exercises (
    id TEXT PRIMARY KEY,
    workout_template_id TEXT NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,  -- Order in workout (1, 2, 3, ...)
    sets INTEGER,
    reps TEXT,  -- "10-12" or "AMRAP" or "30 seconds"
    rest_seconds INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wt_exercises_template ON workout_template_exercises(workout_template_id);
CREATE INDEX idx_wt_exercises_exercise ON workout_template_exercises(exercise_id);
```

**Purpose:** Many-to-many relationship between templates and exercises.

---

#### Table 5: workout_sessions
```sql
CREATE TABLE workout_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_template_id TEXT REFERENCES workout_templates(id) ON DELETE SET NULL,
    scheduled_date TEXT,  -- DATE format: "2025-11-07"
    completed_date TEXT,  -- TIMESTAMP: "2025-11-07T10:30:00Z"
    duration_minutes INTEGER,
    is_completed INTEGER DEFAULT 0,
    week_number INTEGER,
    day_number INTEGER,  -- 1-7 (Mon-Sun)

    -- Subjective metrics (1-10 scale)
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    soreness_level INTEGER CHECK (soreness_level >= 1 AND soreness_level <= 10),

    -- Notes and feedback
    notes TEXT,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(scheduled_date);
CREATE INDEX idx_workout_sessions_completed ON workout_sessions(is_completed);
CREATE INDEX idx_workout_sessions_week ON workout_sessions(week_number);
```

**Purpose:** Actual workout sessions (logged or scheduled).

**Example Row (Completed Workout):**
```json
{
  "id": "ws-20251107-001",
  "user_id": "user-001",
  "workout_template_id": "wt-foundation-a",
  "scheduled_date": "2025-11-07",
  "completed_date": "2025-11-07T10:30:00Z",
  "duration_minutes": 22,
  "is_completed": 1,
  "week_number": 1,
  "day_number": 1,
  "sleep_quality": 7,
  "energy_level": 8,
  "soreness_level": 3,
  "notes": "Felt strong today, increased KB weight",
  "overall_rating": 5
}
```

---

#### Table 6: exercise_logs
```sql
CREATE TABLE exercise_logs (
    id TEXT PRIMARY KEY,
    workout_session_id TEXT NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight_lbs REAL,  -- DECIMAL → REAL in SQLite
    duration_seconds INTEGER,  -- For timed exercises (planks, holds)
    distance_meters REAL,  -- For cardio exercises
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),  -- Rate of Perceived Exertion
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercise_logs_session ON exercise_logs(workout_session_id);
CREATE INDEX idx_exercise_logs_exercise ON exercise_logs(exercise_id);
CREATE INDEX idx_exercise_logs_set ON exercise_logs(set_number);
```

**Purpose:** Detailed set-by-set tracking for each exercise in a session.

**Example Rows (3 sets of squats):**
```json
[
  {
    "id": "el-001",
    "workout_session_id": "ws-20251107-001",
    "exercise_id": "ex-goblet-squat",
    "set_number": 1,
    "reps": 12,
    "weight_lbs": 35.0,
    "rpe": 7
  },
  {
    "id": "el-002",
    "workout_session_id": "ws-20251107-001",
    "exercise_id": "ex-goblet-squat",
    "set_number": 2,
    "reps": 10,
    "weight_lbs": 35.0,
    "rpe": 8
  },
  {
    "id": "el-003",
    "workout_session_id": "ws-20251107-001",
    "exercise_id": "ex-goblet-squat",
    "set_number": 3,
    "reps": 8,
    "weight_lbs": 35.0,
    "rpe": 9
  }
]
```

---

#### Table 7: progress_measurements
```sql
CREATE TABLE progress_measurements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    measurement_date TEXT NOT NULL,  -- DATE: "2025-11-07"
    body_weight_lbs REAL,
    body_fat_percentage REAL,

    -- Body measurements in inches
    chest_inches REAL,
    waist_inches REAL,
    hips_inches REAL,
    arms_inches REAL,
    thighs_inches REAL,

    -- Progress photos (file paths)
    front_photo_url TEXT,
    side_photo_url TEXT,
    back_photo_url TEXT,

    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_measurements_user ON progress_measurements(user_id);
CREATE INDEX idx_progress_measurements_date ON progress_measurements(measurement_date);
```

**Purpose:** Track body measurements and progress photos over time.

---

#### Table 8: user_goals
```sql
CREATE TABLE user_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL,  -- 'weight_loss', 'strength_gain', 'endurance'
    target_value REAL,
    current_value REAL,
    unit TEXT,  -- 'lbs', 'kg', 'reps', 'minutes'
    target_date TEXT,  -- DATE
    is_achieved INTEGER DEFAULT 0,
    achieved_date TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_goals_user ON user_goals(user_id);
CREATE INDEX idx_user_goals_achieved ON user_goals(is_achieved);
```

**Purpose:** User goal setting and tracking.

---

#### Table 9: user_preferences
```sql
CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark',  -- 'light', 'dark', 'auto'
    notifications_enabled INTEGER DEFAULT 1,
    email_notifications INTEGER DEFAULT 0,
    weight_unit TEXT DEFAULT 'lbs',  -- 'lbs' or 'kg'
    distance_unit TEXT DEFAULT 'miles',  -- 'miles' or 'km'
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** User application preferences.

---

### 5.2 Database Views (Optional - for complex queries)

```sql
-- View: Recent workouts summary
CREATE VIEW recent_workouts_view AS
SELECT
    ws.id AS session_id,
    ws.scheduled_date,
    ws.completed_date,
    ws.is_completed,
    wt.name AS workout_name,
    wt.workout_type,
    wt.phase,
    ws.duration_minutes,
    ws.sleep_quality,
    ws.energy_level,
    ws.overall_rating,
    COUNT(DISTINCT el.exercise_id) AS exercises_count
FROM workout_sessions ws
LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
LEFT JOIN exercise_logs el ON ws.id = el.workout_session_id
GROUP BY ws.id
ORDER BY ws.scheduled_date DESC;
```

---

## 6. Complete Workout Program Structure

### 6.1 12-Week Program Overview

**Phase 1: Foundation (Weeks 1-4)**
- Focus: Build movement patterns, establish routine
- Frequency: 3x/week (Mon/Wed/Fri or similar)
- Workouts: Foundation A & B (alternating)
- Duration: 15-20 minutes per session
- Assessment: Week 4, Day 6

**Phase 2: Building (Weeks 5-8)**
- Focus: Increase intensity, add variety
- Frequency: 4-5x/week
- Workouts: Power, Metabolic, Recovery
- Duration: 20-25 minutes per session
- Assessment: Week 8, Day 6

**Phase 3: Athletic Performance (Weeks 9-12)**
- Focus: Peak performance, high intensity
- Frequency: 5-6x/week
- Workouts: High Intensity, Moderate, Assessment
- Duration: 25-30 minutes per session
- Final Assessment: Week 12, Day 5
- Celebration: Week 12, Day 6

### 6.2 Weekly Workout Schedule

```javascript
// Week-by-week workout assignment
const PROGRAM_STRUCTURE = {
  // Phase 1: Foundation (Weeks 1-4)
  1: { phase: 'Foundation', workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
  2: { phase: 'Foundation', workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Rest', 'Rest'] },
  3: { phase: 'Foundation', workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
  4: { phase: 'Foundation', workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Assessment', 'Rest'] },

  // Phase 2: Building (Weeks 5-8)
  5: { phase: 'Building', workouts: ['Power', 'Rest', 'Metabolic', 'Rest', 'Power', 'Recovery', 'Rest'] },
  6: { phase: 'Building', workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Recovery', 'Rest'] },
  7: { phase: 'Building', workouts: ['Power', 'Rest', 'Metabolic', 'Recovery', 'Power', 'Rest', 'Rest'] },
  8: { phase: 'Building', workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Assessment', 'Rest'] },

  // Phase 3: Athletic Performance (Weeks 9-12)
  9: { phase: 'Athletic Performance', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
  10: { phase: 'Athletic Performance', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
  11: { phase: 'Athletic Performance', workouts: ['High', 'Moderate', 'Rest', 'High', 'Rest', 'Moderate', 'Rest'] },
  12: { phase: 'Athletic Performance', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'Assessment', 'Celebration', 'Rest'] }
};
```

### 6.3 Workout Type Details

#### Foundation A - "Strength Foundation"
- **Duration:** 15-20 minutes
- **Equipment:** Kettlebell (light to moderate)
- **Warmup:** Arm circles, leg swings, bodyweight squats, cat-cow stretches
- **Exercises:**
  1. Goblet Squats - 3 sets of 8-12 reps
  2. Push-ups (modified as needed) - 3 sets of 5-10 reps
  3. Single-arm KB Row - 3 sets of 8 each arm
  4. Plank Hold - 3 sets of 15-30 seconds
  5. Glute Bridges - 2 sets of 12-15 reps
- **Cooldown:** Hip flexor stretch, seated spinal twist, deep breathing
- **Video:** All exercises have YouTube links for demonstrations

#### Foundation B - "Movement & Mobility"
- **Duration:** 15-20 minutes
- **Equipment:** Kettlebell, resistance band
- **Exercises:**
  1. KB Deadlifts - 3 sets of 8-10 reps
  2. Band Pull-aparts - 3 sets of 12-15 reps
  3. Reverse Lunges - 2 sets of 6 each leg
  4. KB Overhead Hold - 3 sets of 20-30 seconds each arm
  5. Bird Dogs - 2 sets of 8 each side

#### Power - "Power & Strength"
- **Duration:** 20-25 minutes
- **Exercises:**
  1. KB Swings - 4 sets of 15-20 reps
  2. Push-up to T - 3 sets of 6-8 each side
  3. Goblet Squats - 4 sets of 10-15 reps
  4. Single-arm KB Press - 3 sets of 6-8 each arm
  5. Renegade Rows - 3 sets of 6 each arm
  6. Wall Sit - 3 sets of 30-45 seconds

#### Metabolic - "Metabolic Circuit"
- **Duration:** 20-25 minutes
- **Format:** 3 rounds, 45 seconds work / 15 seconds rest
- **Circuit:**
  1. KB Swings
  2. Push-ups
  3. Reverse Lunges (alternating)
  4. Band Rows
  5. Plank Hold
  6. Glute Bridges
  7. Rest 2 minutes between rounds

#### Recovery - "Recovery & Mobility"
- **Duration:** 15-20 minutes
- **Focus:** Active recovery, flexibility
- **Exercises:**
  1. Gentle yoga flow
  2. Foam rolling (if available)
  3. Breathing exercises
  4. Light stretching

#### High Intensity Day
- **Duration:** 25-30 minutes
- **Components:**
  1. Power Circuit - 4 rounds, 40 sec work / 20 sec rest
  2. Strength Superset - 3 sets compound movements
  3. Finisher - 2 minutes high-intensity

#### Moderate Day
- **Duration:** 20-25 minutes
- **Focus:** Longer holds, tempo work, skill development, movement quality

#### Assessment Day
- **Duration:** 20-30 minutes
- **Tests:**
  1. Push-ups test - Maximum reps
  2. Plank hold test - Maximum time
  3. Strength measurements
  4. Progress photos
  5. Record improvements vs baseline

#### Celebration Recovery
- **Duration:** 20 minutes
- **Focus:** Gentle mobility, reflection, program completion celebration

---

## 7. Complete API Specification

### 7.1 Base URL & Authentication

**Local Base URL:** `http://localhost:3001/api` (when using HTTP approach)

**Authentication:** Simple header-based for single user
```
X-User-ID: user-001
```

**Response Format:** All responses return JSON with camelCase keys (converted from snake_case database)

---

### 7.2 Workout Endpoints

#### GET /api/workouts/templates
**Description:** Get all workout templates

**Response:**
```json
[
  {
    "id": "wt-foundation-a",
    "name": "Strength Foundation",
    "workoutType": "A",
    "phase": "Foundation",
    "durationMinutes": 20,
    "warmUp": "[\"Arm circles\",\"Leg swings\"]",
    "coolDown": "[\"Hip flexor stretch\"]"
  }
]
```

---

#### GET /api/workouts/templates/:id
**Description:** Get specific workout template with exercises

**Response:**
```json
{
  "id": "wt-foundation-a",
  "name": "Strength Foundation",
  "exercises": [
    {
      "id": "ex-goblet-squat",
      "name": "Goblet Squats",
      "sets": 3,
      "reps": "8-12",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "orderIndex": 1
    }
  ]
}
```

---

#### GET /api/workouts/exercises
**Description:** Get all exercises in library

**Response:**
```json
[
  {
    "id": "ex-001",
    "name": "Goblet Squats",
    "category": "strength",
    "equipment": "kettlebell",
    "videoUrl": "https://www.youtube.com/watch?v=MeIiIdhvXT4",
    "difficultyLevel": "beginner"
  }
]
```

---

#### GET /api/workouts/sessions
**Description:** Get all workout sessions for user

**Query Params:**
- `weekNumber`: Filter by week (1-12)
- `isCompleted`: Filter by completion status (true/false)
- `limit`: Pagination limit
- `offset`: Pagination offset

**Response:**
```json
[
  {
    "id": "ws-001",
    "workoutTemplateId": "wt-foundation-a",
    "scheduledDate": "2025-11-07",
    "completedDate": "2025-11-07T10:30:00Z",
    "isCompleted": true,
    "weekNumber": 1,
    "dayNumber": 1,
    "sleepQuality": 7,
    "energyLevel": 8,
    "notes": "Felt strong today",
    "overallRating": 5
  }
]
```

---

#### GET /api/workouts/sessions/:id
**Description:** Get specific workout session with exercise logs

**Response:**
```json
{
  "id": "ws-001",
  "workoutTemplate": {
    "name": "Strength Foundation",
    "workoutType": "A"
  },
  "exerciseLogs": [
    {
      "exerciseId": "ex-goblet-squat",
      "exerciseName": "Goblet Squats",
      "setNumber": 1,
      "reps": 12,
      "weightLbs": 35.0,
      "rpe": 7
    }
  ],
  "sleepQuality": 7,
  "energyLevel": 8,
  "notes": "Felt strong today"
}
```

---

#### POST /api/workouts/sessions
**Description:** Create new workout session (log or schedule)

**Request Body:**
```json
{
  "workoutTemplateId": "wt-foundation-a",
  "scheduledDate": "2025-11-07",
  "weekNumber": 1,
  "dayNumber": 1,
  "isCompleted": true,
  "completedDate": "2025-11-07T10:30:00Z",
  "durationMinutes": 22,
  "sleepQuality": 7,
  "energyLevel": 8,
  "sorenessLevel": 3,
  "notes": "First workout of the program!",
  "overallRating": 5
}
```

**Response:**
```json
{
  "id": "ws-new-001",
  "...": "all fields from request"
}
```

---

#### PUT /api/workouts/sessions/:id
**Description:** Update existing workout session

**Request Body:** Same as POST (partial updates allowed)

---

#### DELETE /api/workouts/sessions/:id
**Description:** Delete workout session

**Response:**
```json
{
  "success": true,
  "message": "Workout session deleted"
}
```

---

#### POST /api/workouts/sessions/:sessionId/exercises
**Description:** Log exercise sets for a workout session

**Request Body:**
```json
{
  "exerciseId": "ex-goblet-squat",
  "orderIndex": 1,
  "sets": [
    { "setNumber": 1, "reps": 12, "weightLbs": 35.0, "rpe": 7 },
    { "setNumber": 2, "reps": 10, "weightLbs": 35.0, "rpe": 8 },
    { "setNumber": 3, "reps": 8, "weightLbs": 35.0, "rpe": 9 }
  ]
}
```

---

### 7.3 Progress Endpoints

#### GET /api/progress/stats
**Description:** Get overall user statistics

**Response:**
```json
{
  "totalWorkouts": 45,
  "completedWorkouts": 42,
  "avgSleepQuality": 7.2,
  "avgEnergyLevel": 7.8,
  "avgWorkoutRating": 4.5,
  "lastWorkoutDate": "2025-11-07",
  "currentWeek": 6,
  "completionRate": 93.3
}
```

---

#### GET /api/progress/weekly
**Description:** Get weekly completion summary (all 12 weeks)

**Response:**
```json
[
  { "weekNumber": 1, "completedWorkouts": 3, "scheduledWorkouts": 3, "completionRate": 100 },
  { "weekNumber": 2, "completedWorkouts": 2, "scheduledWorkouts": 3, "completionRate": 66.7 },
  ...
]
```

---

#### GET /api/progress/records
**Description:** Get personal records (max push-ups, longest plank, etc.)

**Response:**
```json
{
  "maxPushups": {
    "value": 42,
    "date": "2025-11-07",
    "weekNumber": 4
  },
  "longestPlank": {
    "value": 90,
    "unit": "seconds",
    "date": "2025-11-07",
    "weekNumber": 8
  }
}
```

---

#### GET /api/progress/exercises/:exerciseId
**Description:** Get progress over time for specific exercise

**Response:**
```json
[
  {
    "date": "2025-11-01",
    "weekNumber": 1,
    "maxWeight": 35.0,
    "totalReps": 30,
    "avgRpe": 7.3
  },
  {
    "date": "2025-11-03",
    "weekNumber": 1,
    "maxWeight": 40.0,
    "totalReps": 32,
    "avgRpe": 7.8
  }
]
```

---

## 8. Feature Workflows & UI Requirements

### 8.1 Calendar View Workflow

**User Story:** View 12-week program at a glance, navigate weeks, see workout completion status

**UI Components:**
1. **Week Selector**
   - Dropdown or horizontal scroll
   - Shows: "Week 1: Foundation" to "Week 12: Athletic Performance"
   - Highlight current week

2. **Week View Grid**
   - 7 columns (Mon-Sun)
   - Each day shows:
     - Day name
     - Workout name (or "Rest")
     - Completion indicator (✓ green border if completed)
     - Duration (if completed)
     - Click to open details

3. **Workout Day Card**
   - Display: Workout name, duration, exercises count
   - Border color matches workout type
   - Opacity reduced if not completed

**User Actions:**
- Click week to navigate
- Click workout card → Opens Workout Details modal
- Click "Log Workout" → Opens Workout Edit Form

---

### 8.2 Workout Details Modal

**Triggered:** Click workout card from calendar

**Modal Content:**
1. **Header**
   - Workout name (e.g., "Strength Foundation")
   - Phase badge (Foundation/Building/Athletic Performance)
   - Duration
   - Date

2. **Workout Stats** (if completed)
   - Sleep quality: 7/10
   - Energy level: 8/10
   - Overall rating: 5 stars
   - Notes display

3. **Exercise List**
   - Each exercise shows:
     - Exercise name
     - Sets × Reps (e.g., "3 × 8-12")
     - Video thumbnail/link
     - Click exercise name → Play video in modal

4. **Exercise Logs** (if completed)
   - Set-by-set breakdown:
     - Set 1: 12 reps @ 35 lbs (RPE 7)
     - Set 2: 10 reps @ 35 lbs (RPE 8)
     - Set 3: 8 reps @ 35 lbs (RPE 9)

5. **Action Buttons**
   - "Log Workout" (if not completed)
   - "Edit Workout" (if completed)
   - "Delete" (with confirmation)
   - "Close"

---

### 8.3 Log Workout Flow

**Triggered:** Click "Log Workout" button

**Form Fields:**
1. **Completion Status**
   - Radio buttons: Complete / Partial / Skip
   - If "Skip", only show notes field

2. **Subjective Metrics** (if Complete or Partial)
   - Sleep quality: Slider 1-10
   - Energy level: Slider 1-10
   - Soreness level: Slider 1-10 (optional)

3. **Workout Stats** (if Complete)
   - Duration: Number input (minutes)
   - Overall rating: 1-5 stars

4. **Personal Records** (if applicable)
   - Push-ups (max reps): Number input
   - Plank hold (seconds): Number input

5. **Notes**
   - Text area for freeform notes

6. **Action Buttons**
   - "Save" → Creates/updates workout session
   - "Cancel" → Close without saving

**Validation:**
- Sleep quality, energy level must be 1-10
- Duration must be positive integer
- On save, show success toast notification

---

### 8.4 Progress Dashboard

**Tabs:** Overview | Weekly | Sleep & Energy | Personal Records

#### Tab 1: Overview
**Top Row Cards:**
- Total Workouts: 45
- Completion Rate: 93%
- Avg Sleep: 7.2/10
- Avg Energy: 7.8/10

**Charts:**
- Weekly Completion (Bar Chart)
  - X-axis: Weeks 1-12
  - Y-axis: Completed workouts count
  - Color gradient by phase

#### Tab 2: Weekly Breakdown
- List view of all 12 weeks
- Each week shows:
  - Completed: 3/3 workouts
  - Progress bar
  - Click to jump to calendar week view

#### Tab 3: Sleep & Energy Trends
- Area chart with two lines:
  - Blue line: Sleep quality over time
  - Green line: Energy level over time
- X-axis: Workout date
- Y-axis: 1-10 scale
- Tooltips show exact values

#### Tab 4: Personal Records
**Cards showing:**
- Max Push-ups: 42 (Week 4)
- Longest Plank: 90 seconds (Week 8)
- Heaviest Goblet Squat: 50 lbs (Week 10)

---

### 8.5 Workout History

**Search & Filter:**
- Search bar: Search by workout name or notes
- Filter dropdown:
  - All workouts
  - Completed only
  - Planned only
  - By phase (Foundation/Building/Athletic)

**Workout Cards (List View):**
- Each card shows:
  - Date
  - Workout name
  - Week X, Day Y
  - Duration
  - Sleep, Energy indicators
  - Rating stars
  - Snippet of notes
  - Click → Opens Workout Details modal

**Pagination:**
- Show 20 workouts per page
- Infinite scroll or "Load More" button

---

### 8.6 Video Player Modal

**Triggered:** Click exercise video link

**Modal Content:**
- YouTube iframe embed (autoplay enabled)
- Exercise name header
- Sets × Reps info
- "Close" button

**Implementation:**
```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
  frameborder="0"
  allowfullscreen>
</iframe>
```

---

### 8.7 Data Export

**Menu:** File → Export Data

**Export Options:**
1. **Full Backup (JSON)**
   - All tables exported as JSON
   - Filename: `olympic-workout-backup-2025-11-07.json`

2. **Workout History (CSV)**
   - Columns: Date, Week, Day, Workout, Duration, Sleep, Energy, Rating, Notes
   - Filename: `workout-history-2025-11-07.csv`

**Native File Picker:**
- Use Electron dialog to choose save location
- Default: ~/Documents/Olympic Workout Backups/

---

## 9. PostgreSQL to SQLite Migration

### 9.1 Type Conversions

#### Changes Required

**Data Types:**
```sql
PostgreSQL → SQLite
-----------------------
UUID        → TEXT (store as string)
TIMESTAMP   → TEXT (ISO 8601 format: "2025-11-07T10:30:00Z")
SERIAL      → INTEGER PRIMARY KEY AUTOINCREMENT
BOOLEAN     → INTEGER (0 or 1)
JSONB       → TEXT (JSON string)
```

**Removed Features:**
- Remove schema namespaces (SQLite has no schemas)
- Remove `pg_trgm` extension (use basic LIKE)
- Simplify views (SQLite has limited view features)

**Preserved:**
- All 11 tables structure
- Foreign key constraints (enabled via pragma)
- Indexes for performance
- Triggers for updated_at timestamps

#### Migration Strategy

1. **Schema Conversion Script:**
   - Parse `backend/src/db/schema.sql`
   - Convert PostgreSQL DDL to SQLite DDL
   - Generate `electron/db/schema.sqlite.sql`

2. **Seed Data:**
   - Pre-populate exercises table
   - Pre-populate workout_templates
   - Create default user record

3. **First Launch:**
   - Check if database exists
   - If not, create from schema
   - Run seed data scripts
   - Set database version for future migrations

### 5.2 Data Storage Locations

```
~/Library/Application Support/Olympic-Workout-Calendar/
├── workout.db              # Main database
├── workout.db-wal          # Write-Ahead Log
├── workout.db-shm          # Shared memory file
├── backups/
│   ├── workout-2025-11-07.db
│   ├── workout-2025-11-06.db
│   └── ...
├── logs/
│   └── app.log             # Application logs
└── preferences.json        # Electron-store config
```

---

## 6. Build & Distribution

### 6.1 Development Setup

```bash
# Project structure
olympic-workout-calendar/
├── frontend/               # Existing React app (unchanged)
├── backend/               # Existing Express app (migrate to main process)
├── electron/              # New Electron-specific code
│   ├── main.ts           # Main process entry point
│   ├── preload.ts        # Preload script for IPC security
│   ├── db/
│   │   ├── schema.sqlite.sql
│   │   ├── seeds.sql
│   │   └── connection.ts  # SQLite connection manager
│   └── menu.ts           # Native menu configuration
├── package.json          # Add Electron & builder dependencies
└── electron-builder.yml  # Build configuration
```

### 6.2 Build Configuration

**package.json additions:**
```json
{
  "name": "olympic-workout-calendar",
  "version": "1.0.0",
  "main": "dist-electron/main.js",
  "author": "Your Name",
  "description": "12-week Olympic workout tracking application",
  "scripts": {
    "electron:dev": "concurrently \"npm run dev:frontend\" \"npm run dev:electron\"",
    "electron:build": "electron-builder --mac --arm64",
    "electron:build:universal": "electron-builder --mac --universal"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1",
    "@electron-forge/cli": "^7.0.0",
    "concurrently": "^8.2.0"
  },
  "dependencies": {
    "better-sqlite3": "^9.2.0",
    "electron-store": "^8.1.0"
    // electron-updater not needed for personal use
  }
}
```

**electron-builder.yml:**
```yaml
appId: com.olympicworkout.calendar
productName: Olympic Workout Calendar
copyright: Copyright © 2025
directories:
  output: dist-electron-build
  buildResources: electron/assets

mac:
  target:
    - target: dir  # Just creates .app in a directory (no DMG needed for personal use)
      arch:
        - arm64  # M1/M2/M3 chips
  category: public.app-category.healthcare-fitness
  icon: electron/assets/icon.icns
  # No code signing for personal use - remove these lines:
  # hardenedRuntime: true
  # gatekeeperAssess: false
  # entitlements: electron/entitlements.mac.plist

files:
  - dist-frontend/**/*
  - dist-electron/**/*
  - node_modules/**/*
  - package.json

# No notarization needed for personal use
# afterSign: electron/notarize.js
```

**Alternative: If you want a DMG (optional):**
```yaml
mac:
  target:
    - target: dmg
      arch:
        - arm64

dmg:
  title: ${productName} ${version}
  icon: electron/assets/icon.icns
  window:
    width: 540
    height: 380
  contents:
    - x: 140
      y: 180
    - x: 400
      y: 180
      type: link
      path: /Applications
```

### 6.3 Code Signing & Notarization

**For Personal Use: NOT REQUIRED ✅**

Since this app is for personal use only, you can skip all code signing and notarization steps:

- ✅ **No Apple Developer account needed** ($99/year saved)
- ✅ **No code signing certificates required**
- ✅ **No notarization process**

**Opening the Unsigned App:**

When you first launch the app, macOS Gatekeeper will block it with "cannot be opened because it is from an unidentified developer."

**To bypass (one-time only):**
1. Right-click (or Control+click) the app
2. Select "Open" from context menu
3. Click "Open" in the dialog
4. App will launch and be trusted from now on

**Alternatively:**
```bash
# Remove the quarantine flag
xattr -cr /Applications/Olympic\ Workout\ Calendar.app
```

### 6.4 Installation Experience

**Personal Use - Simple Installation:**

After building with `npm run electron:build`, you'll find your app at:
```
dist-electron-build/mac-arm64/Olympic Workout Calendar.app
```

**Install:**
1. Copy the `.app` to `/Applications/`
2. Right-click → Open (first time only to bypass Gatekeeper)
3. Database automatically initializes on first launch
4. Start logging workouts immediately

**Or if you build a DMG:**
1. Double-click `Olympic-Workout-Calendar-1.0.0-arm64.dmg`
2. Drag app to Applications folder
3. Eject DMG
4. Right-click app → Open (first time only)
5. Ready to use!

---

## 7. User Interface Changes

### 7.1 Minimal UI Adjustments

**Preserved (100%):**
- All React components unchanged
- Glassmorphism design system
- Jeton theme colors and gradients
- Typography and spacing
- Animations and transitions
- Responsive layouts

**New Elements:**
- **Native Window Controls:** macOS traffic lights (red/yellow/green)
- **Title Bar:** Optional custom title bar with drag region
- **Native Menu Bar:** Replaces any web-based menu
- **Keyboard Shortcut Hints:** Display shortcuts in tooltips

### 7.2 Window Configuration

```typescript
// Electron main.ts
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  titleBarStyle: 'hiddenInset', // macOS style with traffic lights
  backgroundColor: '#1a1a2e',   // Match app background
  webPreferences: {
    nodeIntegration: false,     // Security best practice
    contextIsolation: true,     // Security best practice
    preload: path.join(__dirname, 'preload.js')
  }
});
```

---

## 8. Migration Strategy

### 8.1 Phase 1: Foundation (Week 1-2)
- ✅ Set up Electron project structure
- ✅ Configure Electron Forge or Electron Builder
- ✅ Create main process with window management
- ✅ Set up IPC or localhost HTTP server
- ✅ Test basic React app loading in Electron

### 8.2 Phase 2: Database Migration (Week 2-3)
- ✅ Convert PostgreSQL schema to SQLite
- ✅ Implement better-sqlite3 integration
- ✅ Create database initialization script
- ✅ Test all CRUD operations
- ✅ Verify data integrity and constraints

### 8.3 Phase 3: Feature Integration (Week 3-4)
- ✅ Wire up all API endpoints to SQLite
- ✅ Test workout logging end-to-end
- ✅ Test progress dashboard with real data
- ✅ Test workout history search and filters
- ✅ Verify video player functionality

### 8.4 Phase 4: Native Integration (Week 4-5)
- ✅ Implement native menu bar
- ✅ Add keyboard shortcuts
- ✅ Configure window state persistence
- ✅ Add data export functionality
- ✅ Test all native integrations

### 8.5 Phase 5: Polish & Packaging (Week 5-6)
- ✅ Create app icon and assets
- ✅ Configure build scripts
- ✅ Test ARM64 builds on M1
- ✅ Optimize bundle size
- ✅ Performance testing and optimization
- ✅ User acceptance testing

### 8.6 Phase 6: Distribution (Week 6-7)
- ✅ Set up code signing (if applicable)
- ✅ Create DMG installer
- ✅ Write installation documentation
- ✅ Prepare release notes
- ✅ Test installation on clean M1 Mac

---

## 9. Testing Requirements

### 9.1 Functional Testing
- All existing 300+ test cases from TESTING.md still apply
- Additional Electron-specific tests:
  - Window lifecycle (open/close/minimize/maximize)
  - Menu item actions
  - Keyboard shortcuts
  - IPC communication
  - Database persistence across app restarts
  - Data export/import

### 9.2 Platform Testing
- ✅ macOS 12 Monterey (M1)
- ✅ macOS 13 Ventura (M1)
- ✅ macOS 14 Sonoma (M1)
- ✅ macOS 15 Sequoia (M1) - current target

### 9.3 Performance Testing
- Cold start time: < 3s
- Warm start time: < 1s
- Memory usage after 1 hour: < 250MB
- Database query performance: < 100ms
- UI frame rate: 60fps during animations

---

## 10. Security Considerations

### 10.1 Electron Security Best Practices
- ✅ `nodeIntegration: false` - Prevent Node.js access in renderer
- ✅ `contextIsolation: true` - Isolate preload scripts
- ✅ `webSecurity: true` - Enable web security features
- ✅ Content Security Policy (CSP) headers
- ✅ Validate all IPC messages
- ✅ Sanitize user input before database queries

### 10.2 Data Security
- ✅ SQLite database stored in user's home directory
- ✅ No network transmission of workout data
- ✅ No analytics or telemetry (privacy-first)
- ✅ Optional database encryption (future enhancement)

---

## 11. Documentation Updates

### 11.1 New Documentation Needed
- **ELECTRON-SETUP.md** - Local development setup
- **BUILDING.md** - Build and packaging instructions
- **INSTALLATION.md** - End-user installation guide
- **MIGRATION-FROM-DOCKER.md** - For existing users

### 11.2 Updated Documentation
- **README.md** - Replace Docker instructions with Electron setup
- Remove **UNRAID-SETUP.md** (no longer relevant)
- Update **TESTING.md** with Electron-specific tests

---

## 12. Success Criteria

### 12.1 MVP Launch Criteria
- ✅ App builds successfully for ARM64 macOS
- ✅ All 17 React components render correctly
- ✅ All workout features work identically to web version
- ✅ Database persists data across app restarts
- ✅ Native menu bar and shortcuts functional
- ✅ Performance meets targets (< 3s launch, < 200MB RAM)
- ✅ No console errors or warnings
- ✅ Installer (DMG) works on clean M1 Mac

### 12.2 User Acceptance
- ✅ User can install without technical knowledge
- ✅ User can log workouts offline
- ✅ User can view all historical data
- ✅ User can export data as backup
- ✅ User feels app is fast and responsive
- ✅ User finds app intuitive (no learning curve from web version)

---

## 13. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SQLite performance slower than PostgreSQL | Medium | Low | Use indexes, WAL mode, optimize queries |
| better-sqlite3 ARM64 binary issues | High | Low | Use prebuilt binaries, test early |
| App bundle size too large (>200MB) | Low | Medium | Tree-shake dependencies, optimize assets |
| YouTube video player blocked | High | Low | Use iframe embed (same as web version) |
| Database corruption | High | Low | Implement auto-backups, WAL mode |
| macOS Gatekeeper blocks app | Medium | Medium | Code signing and notarization |
| Memory leaks in long sessions | Medium | Low | Profile with Chrome DevTools, fix leaks |

---

## 14. Future Considerations

### 14.1 Windows & Linux Support
- Electron is cross-platform
- Could build for Windows and Linux with minimal changes
- SQLite works identically on all platforms
- UI may need minor tweaks for platform conventions

### 14.2 Mobile Apps
- React Native app using same data model
- Sync via iCloud or custom backend
- Simplified UI for phone screens

### 14.3 Multi-User Support
- Add user authentication
- Multiple user profiles in same database
- User switching in app menu

---

## 15. Appendix

### 15.1 Key Dependencies

```json
{
  "electron": "^28.0.0",
  "better-sqlite3": "^9.2.0",
  "electron-builder": "^24.9.1",
  "electron-store": "^8.1.0",
  "@types/better-sqlite3": "^7.6.8",
  "concurrently": "^8.2.0"
}
```

**Note:** `electron-updater` removed - not needed for personal use

### 15.2 Estimated Timeline
- **Phase 1:** 1-2 weeks (Electron setup)
- **Phase 2:** 1-2 weeks (Database migration)
- **Phase 3:** 1-2 weeks (Feature integration)
- **Phase 4:** 1 week (Native integration)
- **Phase 5:** 1-2 weeks (Polish & packaging)
- **Phase 6:** 1 week (Distribution setup)

**Total: 6-9 weeks for full MVP**

### 15.3 Resources
- Electron Documentation: https://www.electronjs.org/docs
- Electron Builder: https://www.electron.build/
- better-sqlite3: https://github.com/WiseLibs/better-sqlite3
- macOS Code Signing: https://developer.apple.com/support/code-signing/

---

## 16. Decisions Made ✅

1. **Code Signing:** ❌ Not needed - personal use only
2. **Auto-Updates:** ❌ Not needed - manual rebuild when updating
3. **App Name:** Keep "Olympic Workout Calendar" ✅
4. **Distribution:** Personal use only ✅

## 17. Open Questions

1. **Data Migration:** Do you have existing workout data from the Docker version to migrate?
2. **Database Location Preference:** Default to `~/Library/Application Support/` or custom location?
3. **Video Player:** Keep YouTube iframe embed, or explore native video player?
4. **Build Target:** Just `dir` output, or do you want DMG creation for cleaner installs?
5. **Development Priority:** Start with minimal viable electron setup, or include menu bar extras from the start?

---

**Document Owner:** Olympic Workout Calendar Team
**Last Updated:** November 7, 2025
**Next Review:** Start of Phase 1 Implementation
