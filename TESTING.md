# Olympic Workout Calendar - Testing Guide

## Test Environment Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose (for backend)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Starting the Application

1. **Start Backend Services (Docker)**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - PostgreSQL database on port 5432
   - Backend API on port 3001

2. **Start Frontend Development Server**
   ```bash
   npm install
   npm run dev
   ```
   Frontend will be available at http://localhost:5173

3. **Production Build Test**
   ```bash
   npm run build
   npm run preview
   ```

## Feature Testing Checklist

### 1. Calendar View ✓

#### Week Navigation
- [ ] Click "Next Week" button - should increment week number
- [ ] Click "Previous Week" button - should decrement week number
- [ ] Week 1: Previous button should be disabled
- [ ] Week 12: Next button should be disabled
- [ ] Current week indicator should update
- [ ] Phase name should change (Foundation, Building, Athletic Performance)

#### Workout Day Cards
- [ ] All 7 days of week are displayed
- [ ] Day names show correctly (Mon-Sun)
- [ ] Workout names display for each day
- [ ] Workout duration shows
- [ ] Rest days have different styling
- [ ] Hover effect works (scale up)
- [ ] Completed workouts have green border indicator
- [ ] Click on day card opens workout details

#### Overall Progress
- [ ] Circular progress ring displays
- [ ] Percentage updates as workouts are completed
- [ ] Animation is smooth

### 2. Workout Details Modal ✓

#### Display
- [ ] Modal opens when clicking workout day
- [ ] Week and day badges show correctly
- [ ] Workout name and duration display
- [ ] Warm-up exercises listed
- [ ] Main exercises listed
- [ ] Cool-down exercises listed
- [ ] Close button works
- [ ] Click outside modal closes it (if enabled)

#### Video Player
- [ ] "Watch Video" buttons appear for exercises with videos
- [ ] Click video button opens modal
- [ ] YouTube video embeds correctly
- [ ] Video plays automatically
- [ ] Video controls work (play, pause, volume, fullscreen)
- [ ] Close video modal works
- [ ] ESC key closes video modal

#### Completion Status
- [ ] If workout completed, green checkmark banner shows
- [ ] Logged stats display (sleep, energy, push-ups, plank)
- [ ] Notes display if present

### 3. Workout Logging Form ✓

#### Form Display
- [ ] Click "Log Workout" button opens form
- [ ] All form fields display correctly
- [ ] Cancel button returns to details view

#### Form Fields
- [ ] Workout Completed checkbox works
- [ ] Sleep Quality input (1-10) validates
- [ ] Energy Level input (1-10) validates
- [ ] Push-ups input accepts numbers
- [ ] Plank Hold input accepts numbers
- [ ] Weight input accepts text
- [ ] Reps/Sets input accepts text
- [ ] Notes textarea accepts text

#### Form Submission
- [ ] Click "Save Workout" submits form
- [ ] Loading state shows during save (if implemented)
- [ ] Success: form closes and data appears in details
- [ ] Success: workout card shows completed indicator
- [ ] Success: progress percentage updates
- [ ] Error: error message displays if API fails
- [ ] Saved data persists after page reload

### 4. Progress Dashboard ✓

#### Navigation
- [ ] Click "Progress" tab switches view
- [ ] Tab has active styling (gradient background)

#### Stats Cards
- [ ] Total Workouts count displays
- [ ] Completion Rate percentage calculates correctly
- [ ] Average Sleep displays (out of 10)
- [ ] Average Energy displays (out of 10)
- [ ] Best Push-ups shows highest recorded
- [ ] Best Plank shows longest time
- [ ] Card hover effects work

#### Weekly Workout Chart
- [ ] Bar chart displays for all 12 weeks
- [ ] X-axis shows week labels (W1-W12)
- [ ] Y-axis shows workout count
- [ ] Bars have gradient coloring
- [ ] Hover shows tooltip with count
- [ ] Chart is responsive on mobile

#### Sleep Quality Chart
- [ ] Area chart displays for all 12 weeks
- [ ] Purple gradient styling
- [ ] Shows weekly averages
- [ ] Hover shows tooltip with value
- [ ] Y-axis range is 0-10
- [ ] Chart is responsive

#### Energy Level Chart
- [ ] Area chart displays for all 12 weeks
- [ ] Yellow gradient styling
- [ ] Shows weekly averages
- [ ] Hover shows tooltip with value
- [ ] Y-axis range is 0-10
- [ ] Chart is responsive

### 5. Workout History ✓

#### Navigation
- [ ] Click "History" tab switches view
- [ ] Tab has active styling

#### Search Functionality
- [ ] Search box displays
- [ ] Type in search box filters results in real-time
- [ ] Search matches workout names
- [ ] Search matches notes
- [ ] Search matches week numbers
- [ ] Search matches day names
- [ ] Result count updates (e.g., "15 of 84 workouts")

#### Filter Buttons
- [ ] "All" button shows all workouts
- [ ] "Completed" button shows only completed workouts
- [ ] "Planned" button shows only incomplete workouts
- [ ] Active filter has gradient background
- [ ] Filters work with search

#### Workout Cards
- [ ] All workouts display in chronological order (newest first)
- [ ] Week and day badges show
- [ ] Workout name displays
- [ ] Completed workouts have green border
- [ ] Completed workouts show checkmark icon
- [ ] Stats display for completed workouts (sleep, energy, etc.)
- [ ] Notes display if present
- [ ] Rest days have sleep emoji
- [ ] Workout days have muscle emoji

#### Empty State
- [ ] When no results match, empty state shows
- [ ] Empty state has appropriate message
- [ ] Empty state icon displays

### 6. Assessment Week Stats ✓

#### Display Conditions
- [ ] Stats appear only on weeks 4, 8, and 12
- [ ] Stats don't appear on other weeks

#### Stats Display
- [ ] Total workouts for period
- [ ] Average sleep quality
- [ ] Average energy level
- [ ] Best push-ups
- [ ] Best plank hold
- [ ] Weeks completed count

### 7. Data Persistence & API ✓

#### Local State
- [ ] Workout data loads from API on page load
- [ ] Loading spinner shows while fetching
- [ ] Error banner shows if API fails

#### Save Operations
- [ ] Save workout creates new session if none exists
- [ ] Save workout updates existing session
- [ ] Data persists after page refresh
- [ ] Changes reflect in all views (calendar, progress, history)

#### API Error Handling
- [ ] Network errors show user-friendly message
- [ ] Server errors show user-friendly message
- [ ] User can retry failed operations

### 8. Responsive Design ✓

#### Mobile (< 640px)
- [ ] Header text readable
- [ ] Progress circle sized appropriately
- [ ] Tab navigation works
- [ ] Week navigation buttons accessible
- [ ] Workout cards display in 2-column grid
- [ ] Modals are full-width
- [ ] Charts are scrollable/responsive
- [ ] Search bar full width
- [ ] Filter buttons wrap appropriately

#### Tablet (640px - 1024px)
- [ ] Workout cards display in 3-4 column grid
- [ ] Stats cards display in 2-3 columns
- [ ] Charts display at comfortable size
- [ ] All functionality accessible

#### Desktop (> 1024px)
- [ ] Workout cards display in 7-column grid
- [ ] Stats cards display in 6 columns
- [ ] Charts display at optimal size
- [ ] All content within max-width container

### 9. Visual Design & Theme ✓

#### Jeton Theme
- [ ] Coral-to-orange gradient background
- [ ] Glassmorphism effects on cards (blur, transparency)
- [ ] White text with shadow for readability
- [ ] Pill-shaped buttons (rounded-full)
- [ ] Gradient primary buttons
- [ ] Consistent spacing and padding

#### Animations
- [ ] Fade-in animations on page load
- [ ] Hover scale effects on interactive elements
- [ ] Smooth transitions between views
- [ ] Floating animation on trophy icon
- [ ] Loading spinner animates smoothly

#### Icons
- [ ] Lucide React icons display correctly
- [ ] Icon sizes consistent
- [ ] Icons have appropriate colors

### 10. Browser Compatibility ✓

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, macOS/iOS)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 11. Performance ✓

#### Load Times
- [ ] Initial page load < 3 seconds
- [ ] API calls complete < 1 second
- [ ] View switches are instantaneous
- [ ] Chart rendering is smooth

#### Bundle Size
- [ ] Main bundle < 1 MB
- [ ] CSS bundle < 50 KB
- [ ] Images optimized

## Known Issues & Future Enhancements

### Current Limitations
1. **Backend not running**: API will fail gracefully with error message
2. **Bundle size**: 611 KB (can be optimized with code splitting)
3. **No offline support**: Requires network connection

### Future Enhancements
1. **Code Splitting**: Dynamic imports for charts library
2. **PWA Support**: Service worker for offline functionality
3. **Image Optimization**: Lazy load images
4. **Accessibility**: ARIA labels, keyboard navigation
5. **Unit Tests**: Component tests with Jest/Vitest
6. **E2E Tests**: Playwright or Cypress tests
7. **Personal Records**: Dedicated PR tracking page
8. **Export Data**: Download workout history as CSV
9. **Print View**: Printable workout calendar

## Test Results

### Build Test
✅ **PASSED** - Build completed successfully in 9.82s
- No TypeScript errors
- No compilation errors
- Warning: Large bundle size (611 KB) - can be optimized later

### Manual Testing
To be completed by running through checklist above

## Deployment Checklist

Before deploying to production:
- [ ] All tests in checklist pass
- [ ] Build succeeds without errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Backend health checks pass
- [ ] HTTPS configured
- [ ] CORS settings correct
- [ ] Error logging configured
- [ ] Performance monitoring set up
- [ ] Backup strategy in place
