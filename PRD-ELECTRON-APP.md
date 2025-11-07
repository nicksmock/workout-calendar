# Product Requirements Document: Olympic Workout Calendar - Electron Desktop App

**Version:** 1.0
**Date:** November 7, 2025
**Target Platform:** macOS (M1 MacBook Air)
**Architecture:** ARM64 (Apple Silicon)

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
- ✅ < 150MB installer size
- ✅ < 200MB memory footprint during typical usage
- ✅ Zero configuration required for end users
- ✅ All workout data persists locally and reliably

---

## 2. User Stories & Requirements

### 2.1 Core User Stories

**US-1: Easy Installation**
> As a user, I want to download and install the app like any other macOS application, so I don't need Docker or technical setup.

**US-2: Offline Access**
> As a user, I want to access my workouts and log progress without an internet connection, so I can use the app anywhere.

**US-3: Data Ownership**
> As a user, I want all my workout data stored locally on my Mac, so I control my fitness information.

**US-4: Native Experience**
> As a user, I want the app to feel like a native macOS application with proper window controls, menu bar, and keyboard shortcuts.

**US-5: Feature Parity**
> As a user, I want all existing features (calendar, progress tracking, video player, history) to work exactly as before.

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
- Electron Updater integration
- Check for updates on launch
- Download and install updates in background
- Notify user when update ready
- Release notes display

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

## 5. Database Migration

### 5.1 PostgreSQL to SQLite Conversion

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
    "electron-store": "^8.1.0",
    "electron-updater": "^6.1.0"
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
    - target: dmg
      arch:
        - arm64  # M1/M2/M3 chips
    - target: zip
      arch:
        - arm64
  category: public.app-category.healthcare-fitness
  icon: electron/assets/icon.icns
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: electron/entitlements.mac.plist
  entitlementsInherit: electron/entitlements.mac.plist

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

files:
  - dist-frontend/**/*
  - dist-electron/**/*
  - node_modules/**/*
  - package.json

afterSign: electron/notarize.js  # macOS notarization
```

### 6.3 Code Signing & Notarization

**Requirements:**
- Apple Developer account ($99/year)
- Developer ID Application certificate
- App-specific password for notarization

**Process:**
1. Sign app with Developer ID
2. Notarize with Apple (automated in build)
3. Staple notarization ticket to app
4. Distribute DMG

**For Development (No Signing):**
- Users will see "unidentified developer" warning
- Right-click → Open to bypass (one-time)
- Consider signing even for personal use

### 6.4 Installation Experience

**User Journey:**
1. Download `Olympic-Workout-Calendar-1.0.0-arm64.dmg` (estimated 120MB)
2. Double-click DMG to mount
3. Drag app icon to Applications folder
4. Eject DMG
5. Open app from Applications or Spotlight
6. First launch: Database initializes with workout program
7. Start logging workouts immediately

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
  "electron-updater": "^6.1.0",
  "@types/better-sqlite3": "^7.6.8",
  "concurrently": "^8.2.0"
}
```

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

## 16. Open Questions

1. **Code Signing:** Do you have an Apple Developer account, or will this be for personal use only?
2. **Auto-Updates:** Do you want auto-update functionality in v1.0 or defer to v1.1?
3. **App Name:** Keep "Olympic Workout Calendar" or rename for desktop release?
4. **Data Migration:** Do you have existing Docker data to migrate, or starting fresh?
5. **Distribution:** Personal use only, or planning to distribute to others?

---

**Document Owner:** Olympic Workout Calendar Team
**Last Updated:** November 7, 2025
**Next Review:** Start of Phase 1 Implementation
