-- PostgreSQL Database Schema for Olympic Workout Calendar
-- Version: 1.0
-- Description: Comprehensive schema for workout tracking, user management, and progress analytics

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Index for faster user lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- EXERCISES TABLE
-- ============================================================================
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- e.g., 'strength', 'cardio', 'mobility', 'core'
    equipment VARCHAR(100), -- e.g., 'kettlebell', 'bodyweight', 'dumbbells'
    muscle_groups TEXT[], -- Array of muscle groups targeted
    video_url VARCHAR(500), -- YouTube or other video URL
    video_embed_code TEXT, -- Embedded video HTML/iframe
    instructions TEXT,
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for exercise searches
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);

-- ============================================================================
-- WORKOUT TEMPLATES TABLE
-- ============================================================================
CREATE TABLE workout_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    workout_type VARCHAR(50), -- e.g., 'Foundation A', 'Power', 'Metabolic', 'High'
    phase VARCHAR(50), -- e.g., 'Foundation', 'Building', 'Athletic Performance'
    week_number INTEGER,
    duration_minutes INTEGER,
    warm_up TEXT,
    cool_down TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for workout template lookups
CREATE INDEX idx_workout_templates_type ON workout_templates(workout_type);
CREATE INDEX idx_workout_templates_phase ON workout_templates(phase);
CREATE INDEX idx_workout_templates_week ON workout_templates(week_number);

-- ============================================================================
-- WORKOUT TEMPLATE EXERCISES (Many-to-Many Relationship)
-- ============================================================================
CREATE TABLE workout_template_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL, -- Order of exercise in the workout
    sets INTEGER,
    reps VARCHAR(50), -- Can be "10-12" or "AMRAP" or "30 seconds"
    rest_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workout template exercise lookups
CREATE INDEX idx_wt_exercises_template ON workout_template_exercises(workout_template_id);
CREATE INDEX idx_wt_exercises_exercise ON workout_template_exercises(exercise_id);

-- ============================================================================
-- WORKOUT SESSIONS TABLE (Actual Completed Workouts)
-- ============================================================================
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL,
    scheduled_date DATE,
    completed_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    is_completed BOOLEAN DEFAULT false,
    week_number INTEGER,
    day_number INTEGER, -- Day of the week (1-7)

    -- Subjective metrics
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    soreness_level INTEGER CHECK (soreness_level >= 1 AND soreness_level <= 10),

    -- Notes and feedback
    notes TEXT,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workout session queries
CREATE INDEX idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(scheduled_date);
CREATE INDEX idx_workout_sessions_completed ON workout_sessions(is_completed);
CREATE INDEX idx_workout_sessions_week ON workout_sessions(week_number);

-- ============================================================================
-- EXERCISE LOGS (Sets/Reps/Weight for Each Exercise in a Session)
-- ============================================================================
CREATE TABLE exercise_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight_lbs DECIMAL(6, 2), -- Weight in pounds (can be decimal for fractional plates)
    duration_seconds INTEGER, -- For timed exercises like planks
    distance_meters DECIMAL(8, 2), -- For cardio exercises
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for exercise log queries
CREATE INDEX idx_exercise_logs_session ON exercise_logs(workout_session_id);
CREATE INDEX idx_exercise_logs_exercise ON exercise_logs(exercise_id);
CREATE INDEX idx_exercise_logs_set ON exercise_logs(set_number);

-- ============================================================================
-- PROGRESS MEASUREMENTS (Body Measurements, Weight, Photos)
-- ============================================================================
CREATE TABLE progress_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    body_weight_lbs DECIMAL(5, 2),
    body_fat_percentage DECIMAL(4, 2),

    -- Body measurements in inches
    chest_inches DECIMAL(4, 2),
    waist_inches DECIMAL(4, 2),
    hips_inches DECIMAL(4, 2),
    arms_inches DECIMAL(4, 2),
    thighs_inches DECIMAL(4, 2),

    -- Progress photos (file paths or URLs)
    front_photo_url VARCHAR(500),
    side_photo_url VARCHAR(500),
    back_photo_url VARCHAR(500),

    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for progress measurement queries
CREATE INDEX idx_progress_measurements_user ON progress_measurements(user_id);
CREATE INDEX idx_progress_measurements_date ON progress_measurements(measurement_date);

-- ============================================================================
-- USER GOALS TABLE
-- ============================================================================
CREATE TABLE user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- e.g., 'weight_loss', 'strength_gain', 'endurance'
    target_value DECIMAL(10, 2),
    current_value DECIMAL(10, 2),
    unit VARCHAR(20), -- e.g., 'lbs', 'kg', 'reps', 'minutes'
    target_date DATE,
    is_achieved BOOLEAN DEFAULT false,
    achieved_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for user goals
CREATE INDEX idx_user_goals_user ON user_goals(user_id);
CREATE INDEX idx_user_goals_achieved ON user_goals(is_achieved);

-- ============================================================================
-- USER PREFERENCES TABLE
-- ============================================================================
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark', -- 'light', 'dark', 'auto'
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT false,
    weight_unit VARCHAR(10) DEFAULT 'lbs', -- 'lbs' or 'kg'
    distance_unit VARCHAR(10) DEFAULT 'miles', -- 'miles' or 'km'
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at BEFORE UPDATE ON workout_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Recent workouts with exercise details
CREATE VIEW recent_workouts_view AS
SELECT
    ws.id AS session_id,
    ws.user_id,
    u.full_name AS user_name,
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
    COUNT(DISTINCT el.exercise_id) AS exercises_count,
    SUM(el.reps) AS total_reps
FROM workout_sessions ws
JOIN users u ON ws.user_id = u.id
LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
LEFT JOIN exercise_logs el ON ws.id = el.workout_session_id
GROUP BY ws.id, u.id, wt.id
ORDER BY ws.scheduled_date DESC;

-- View: Exercise progress over time
CREATE VIEW exercise_progress_view AS
SELECT
    el.exercise_id,
    e.name AS exercise_name,
    ws.user_id,
    ws.scheduled_date,
    el.set_number,
    el.reps,
    el.weight_lbs,
    el.duration_seconds,
    el.rpe,
    ws.week_number
FROM exercise_logs el
JOIN exercises e ON el.exercise_id = e.id
JOIN workout_sessions ws ON el.workout_session_id = ws.id
WHERE ws.is_completed = true
ORDER BY e.name, ws.scheduled_date, el.set_number;

-- View: User statistics summary
CREATE VIEW user_stats_view AS
SELECT
    u.id AS user_id,
    u.full_name,
    COUNT(DISTINCT ws.id) AS total_workouts,
    COUNT(DISTINCT CASE WHEN ws.is_completed = true THEN ws.id END) AS completed_workouts,
    AVG(ws.sleep_quality) AS avg_sleep_quality,
    AVG(ws.energy_level) AS avg_energy_level,
    AVG(ws.overall_rating) AS avg_workout_rating,
    MAX(ws.completed_date) AS last_workout_date,
    COUNT(DISTINCT el.exercise_id) AS unique_exercises_performed
FROM users u
LEFT JOIN workout_sessions ws ON u.id = ws.user_id
LEFT JOIN exercise_logs el ON ws.id = el.workout_session_id
GROUP BY u.id;

-- ============================================================================
-- SEED DATA COMMENTS
-- ============================================================================
-- NOTE: Initial seed data (exercises, workout templates) will be inserted
-- via a separate seed.sql file to keep this schema file clean.
