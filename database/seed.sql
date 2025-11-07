-- PostgreSQL Seed Data for Olympic Workout Calendar
-- Version: 1.0
-- This file populates the database with initial users, exercises, and workout templates

-- ============================================================================
-- DEFAULT USERS (for the couple)
-- ============================================================================
-- Default password for both users: "workout2024" (hashed with bcrypt)
-- Password hash: $2b$10$rZ7zK8X9L3tYvN5mE2wH7u4QJ6pF1sC8dW0aR9bT5yX7vM6nE4gH8

INSERT INTO users (id, username, email, password_hash, full_name, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah', 'sarah@workout.local', '$2b$10$rZ7zK8X9L3tYvN5mE2wH7u4QJ6pF1sC8dW0aR9bT5yX7vM6nE4gH8', 'Sarah', true),
('550e8400-e29b-41d4-a716-446655440002', 'partner', 'partner@workout.local', '$2b$10$rZ7zK8X9L3tYvN5mE2wH7u4QJ6pF1sC8dW0aR9bT5yX7vM6nE4gH8', 'Partner', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- USER PREFERENCES
-- ============================================================================
INSERT INTO user_preferences (user_id, theme, weight_unit) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'dark', 'lbs'),
('550e8400-e29b-41d4-a716-446655440002', 'dark', 'lbs')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- EXERCISES
-- ============================================================================

-- Foundation Phase Exercises
INSERT INTO exercises (name, description, category, equipment, muscle_groups, video_url, difficulty_level) VALUES
-- Goblet Squats
('Goblet Squats', 'Hold a kettlebell or dumbbell at chest level and perform a deep squat. Keep your chest up and core engaged.', 'strength', 'kettlebell', ARRAY['quadriceps', 'glutes', 'core'], 'https://www.youtube.com/watch?v=MeIiIdhvXT4', 'beginner'),

-- Push-ups
('Push-ups', 'Classic push-up with hands slightly wider than shoulder width. Can be modified on knees if needed.', 'strength', 'bodyweight', ARRAY['chest', 'triceps', 'shoulders', 'core'], 'https://www.youtube.com/watch?v=IODxDxX7oi4', 'beginner'),

-- Single-arm KB Row
('Single-arm Kettlebell Row', 'Bent-over row with one kettlebell. Keep your back flat and pull to your hip.', 'strength', 'kettlebell', ARRAY['back', 'lats', 'biceps'], 'https://www.youtube.com/watch?v=8QTjp8n5suM', 'beginner'),

-- Plank Hold
('Plank Hold', 'Hold a plank position on forearms with body in a straight line. Engage core and glutes.', 'core', 'bodyweight', ARRAY['core', 'shoulders', 'abs'], 'https://www.youtube.com/watch?v=ASdvN_XEl_c', 'beginner'),

-- Glute Bridges
('Glute Bridges', 'Lie on back with knees bent, lift hips up while squeezing glutes. Hold at the top.', 'strength', 'bodyweight', ARRAY['glutes', 'hamstrings', 'core'], 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', 'beginner'),

-- KB Deadlifts
('Kettlebell Deadlifts', 'Hip hinge movement with kettlebell between feet. Keep back flat and drive through heels.', 'strength', 'kettlebell', ARRAY['hamstrings', 'glutes', 'back'], 'https://www.youtube.com/watch?v=2gZlPqiN1q4', 'beginner'),

-- Band Pull-aparts
('Band Pull-aparts', 'Hold resistance band with arms extended, pull apart engaging upper back and shoulders.', 'strength', 'resistance band', ARRAY['upper back', 'shoulders', 'rear delts'], 'https://www.youtube.com/watch?v=ak4VWkKBgKQ', 'beginner'),

-- Reverse Lunges
('Reverse Lunges', 'Step back into lunge position, drop back knee toward ground, return to standing.', 'strength', 'bodyweight', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'https://www.youtube.com/watch?v=xXA3gSHFuGU', 'beginner'),

-- KB Overhead Hold
('Kettlebell Overhead Hold', 'Hold kettlebell overhead with locked-out arm. Maintain shoulder stability.', 'strength', 'kettlebell', ARRAY['shoulders', 'core', 'stability'], 'https://www.youtube.com/watch?v=TQqgf8kB6R8', 'beginner'),

-- Bird Dogs
('Bird Dogs', 'On hands and knees, extend opposite arm and leg while maintaining balance and core stability.', 'core', 'bodyweight', ARRAY['core', 'stability', 'lower back'], 'https://www.youtube.com/watch?v=wiFNA3sqjCA', 'beginner'),

-- Building Phase Exercises
-- KB Swings
('Kettlebell Swings', 'Powerful hip hinge movement swinging kettlebell to shoulder height. Focus on hip drive, not arms.', 'power', 'kettlebell', ARRAY['glutes', 'hamstrings', 'core', 'shoulders'], 'https://www.youtube.com/watch?v=yeMXdkZ18EA', 'intermediate'),

-- Push-up to T
('Push-up to T', 'Perform a push-up, then rotate into a side plank with arm extended overhead in a T position.', 'strength', 'bodyweight', ARRAY['chest', 'core', 'shoulders', 'obliques'], 'https://www.youtube.com/watch?v=qp6AlHMM_5o', 'intermediate'),

-- Single-arm KB Press
('Single-arm Kettlebell Press', 'Press kettlebell overhead with one arm. Keep core tight and avoid leaning.', 'strength', 'kettlebell', ARRAY['shoulders', 'triceps', 'core'], 'https://www.youtube.com/watch?v=Ya1GeNlPKz0', 'intermediate'),

-- Renegade Rows
('Renegade Rows', 'In plank position on kettlebells or dumbbells, row one weight up while maintaining plank.', 'strength', 'kettlebell', ARRAY['back', 'core', 'shoulders'], 'https://www.youtube.com/watch?v=PKmZICy4wl0', 'intermediate'),

-- Wall Sit
('Wall Sit', 'Sit against wall with thighs parallel to ground. Hold the position maintaining tension.', 'strength', 'bodyweight', ARRAY['quadriceps', 'glutes'], 'https://www.youtube.com/watch?v=y-wV4Venusw', 'beginner'),

-- Band Rows
('Resistance Band Rows', 'Seated or standing rows with resistance band. Pull to chest engaging back muscles.', 'strength', 'resistance band', ARRAY['back', 'lats', 'biceps'], 'https://www.youtube.com/watch?v=ak4VWkKBgKQ', 'beginner'),

-- Athletic Phase Exercises
-- Yoga Flow
('Gentle Yoga Flow', 'Flowing sequence of yoga poses focusing on flexibility and mobility.', 'mobility', 'bodyweight', ARRAY['full body', 'flexibility'], 'https://www.youtube.com/watch?v=v7AYKMP6rOE', 'beginner'),

-- Foam Rolling
('Foam Rolling', 'Self-myofascial release using foam roller on major muscle groups.', 'recovery', 'foam roller', ARRAY['recovery', 'mobility'], 'https://www.youtube.com/watch?v=_5HI8AtTfc0', 'beginner'),

-- Breathing Exercises
('Breathing Exercises', 'Focused breathing techniques for recovery and stress management.', 'recovery', 'bodyweight', ARRAY['cardio', 'recovery'], 'https://www.youtube.com/watch?v=tybOi4hjZFQ', 'beginner'),

-- Light Stretching
('Light Stretching', 'General flexibility and mobility stretching routine.', 'mobility', 'bodyweight', ARRAY['full body', 'flexibility'], 'https://www.youtube.com/watch?v=g_tea8ZNk5A', 'beginner'),

-- High-Intensity Exercises
('Power Circuit', 'High-intensity circuit combining multiple movements for cardiovascular and strength conditioning.', 'power', 'mixed', ARRAY['full body', 'cardio'], 'https://www.youtube.com/watch?v=ml6cT4AZdqI', 'advanced'),

('Strength Superset', 'Compound strength movements performed back-to-back for maximum muscle engagement.', 'strength', 'mixed', ARRAY['full body', 'strength'], 'https://www.youtube.com/watch?v=vc1E5CfRfos', 'advanced'),

('HIIT Finisher', 'Short burst of maximum intensity exercise to finish the workout.', 'cardio', 'bodyweight', ARRAY['cardio', 'full body'], 'https://www.youtube.com/watch?v=cZnsLVArIt8', 'advanced'),

-- Moderate Day Exercises
('Longer Holds', 'Extended isometric holds for building endurance and stability.', 'strength', 'bodyweight', ARRAY['full body', 'stability'], 'https://www.youtube.com/watch?v=U2M-m5TgsS8', 'intermediate'),

('Tempo Work', 'Exercises performed with controlled tempo for time under tension.', 'strength', 'mixed', ARRAY['full body'], 'https://www.youtube.com/watch?v=GXjKWyXzFJU', 'intermediate'),

('Skill Development', 'Focus on technique and movement quality rather than intensity.', 'skill', 'mixed', ARRAY['full body'], 'https://www.youtube.com/watch?v=sw8QtE6vEhQ', 'intermediate'),

('Movement Quality Focus', 'Deliberate practice of movement patterns with attention to form.', 'mobility', 'mixed', ARRAY['full body'], 'https://www.youtube.com/watch?v=E3h-T3KQNys', 'intermediate'),

-- Mobility and Recovery
('Gentle Mobility', 'Low-intensity mobility work for joint health and recovery.', 'mobility', 'bodyweight', ARRAY['full body', 'joints'], 'https://www.youtube.com/watch?v=g_tea8ZNk5A', 'beginner')

ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- WORKOUT TEMPLATES
-- ============================================================================

-- Foundation Phase Templates
INSERT INTO workout_templates (name, description, workout_type, phase, week_number, duration_minutes, warm_up, cool_down) VALUES
('Strength Foundation', 'Building foundational strength with basic compound movements', 'A', 'Foundation', 1, 20,
'Arm circles: 10 each direction, Leg swings: 10 each leg each direction, Bodyweight squats: 10 slow reps, Cat-cow stretches: 10 reps',
'Hip flexor stretch: 30s each side, Seated spinal twist: 30s each side, Deep breathing: 2 minutes'),

('Movement & Mobility', 'Focus on movement patterns and joint mobility', 'B', 'Foundation', 1, 20,
'Marching in place: 1 minute, Arm swings: 20 total, Hip circles: 10 each direction',
'Child''s pose: 1 minute, Pigeon pose: 1 minute each side, Relaxation breathing: 2 minutes'),

-- Building Phase Templates
('Power & Strength', 'Developing explosive power and building strength', 'Power', 'Building', 5, 25,
'Dynamic movement flow from Phase 1, KB swings: 2 sets of 10 (light weight)',
'Light stretching, Deep breathing'),

('Metabolic Circuit', 'High-rep circuit for metabolic conditioning', 'Metabolic', 'Building', 5, 25,
'Dynamic movement prep, Light activation exercises',
'Walking cool-down, Light stretching'),

('Recovery & Mobility', 'Active recovery focusing on mobility and flexibility', 'Recovery', 'Building', 5, 20,
'Gentle movement, Deep breathing',
'Relaxation pose, Meditation'),

-- Athletic Phase Templates
('High-Intensity Day', 'Maximum intensity training for athletic performance', 'High', 'Athletic Performance', 9, 30,
'Movement prep: 5 minutes, Activation exercises',
'Walking cool-down, Thorough stretching'),

('Moderate Day', 'Moderate intensity focusing on quality and technique', 'Moderate', 'Athletic Performance', 9, 25,
'Gentle movement prep, Joint mobility',
'Extended stretching, Breathing exercises'),

-- Assessment & Special Days
('Assessment Day', 'Testing progress and measuring improvements', 'Assessment', 'Foundation', 4, 30,
'Light movement prep, Joint mobility',
'Light stretching, Reflection notes'),

('Celebration Recovery', 'Final celebration and recovery session', 'Celebration', 'Athletic Performance', 12, 20,
'Gentle movement',
'Relaxation, Gratitude practice'),

('Rest Day', 'Complete rest or very light activity', 'Rest', 'All Phases', NULL, 15,
'Optional gentle movement',
'Relaxation')

ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- WORKOUT TEMPLATE EXERCISES (Linking exercises to workout templates)
-- ============================================================================

-- Get exercise and template IDs for linking
DO $$
DECLARE
    template_id_a UUID;
    template_id_b UUID;
    template_id_power UUID;
    template_id_metabolic UUID;
    template_id_recovery UUID;
    template_id_high UUID;
    template_id_moderate UUID;
    template_id_assessment UUID;

    ex_goblet_squats UUID;
    ex_pushups UUID;
    ex_kb_row UUID;
    ex_plank UUID;
    ex_glute_bridges UUID;
    ex_kb_deadlifts UUID;
    ex_band_pullaparts UUID;
    ex_reverse_lunges UUID;
    ex_kb_overhead UUID;
    ex_bird_dogs UUID;
    ex_kb_swings UUID;
    ex_pushup_to_t UUID;
    ex_kb_press UUID;
    ex_renegade_rows UUID;
    ex_wall_sit UUID;
    ex_band_rows UUID;
    ex_yoga_flow UUID;
    ex_foam_rolling UUID;
    ex_breathing UUID;
    ex_stretching UUID;
    ex_power_circuit UUID;
    ex_strength_superset UUID;
    ex_hiit_finisher UUID;
    ex_longer_holds UUID;
    ex_tempo_work UUID;
    ex_skill_dev UUID;
    ex_movement_quality UUID;

BEGIN
    -- Get template IDs
    SELECT id INTO template_id_a FROM workout_templates WHERE workout_type = 'A' LIMIT 1;
    SELECT id INTO template_id_b FROM workout_templates WHERE workout_type = 'B' LIMIT 1;
    SELECT id INTO template_id_power FROM workout_templates WHERE workout_type = 'Power' LIMIT 1;
    SELECT id INTO template_id_metabolic FROM workout_templates WHERE workout_type = 'Metabolic' LIMIT 1;
    SELECT id INTO template_id_recovery FROM workout_templates WHERE workout_type = 'Recovery' LIMIT 1;
    SELECT id INTO template_id_high FROM workout_templates WHERE workout_type = 'High' LIMIT 1;
    SELECT id INTO template_id_moderate FROM workout_templates WHERE workout_type = 'Moderate' LIMIT 1;
    SELECT id INTO template_id_assessment FROM workout_templates WHERE workout_type = 'Assessment' LIMIT 1;

    -- Get exercise IDs
    SELECT id INTO ex_goblet_squats FROM exercises WHERE name = 'Goblet Squats' LIMIT 1;
    SELECT id INTO ex_pushups FROM exercises WHERE name = 'Push-ups' LIMIT 1;
    SELECT id INTO ex_kb_row FROM exercises WHERE name = 'Single-arm Kettlebell Row' LIMIT 1;
    SELECT id INTO ex_plank FROM exercises WHERE name = 'Plank Hold' LIMIT 1;
    SELECT id INTO ex_glute_bridges FROM exercises WHERE name = 'Glute Bridges' LIMIT 1;
    SELECT id INTO ex_kb_deadlifts FROM exercises WHERE name = 'Kettlebell Deadlifts' LIMIT 1;
    SELECT id INTO ex_band_pullaparts FROM exercises WHERE name = 'Band Pull-aparts' LIMIT 1;
    SELECT id INTO ex_reverse_lunges FROM exercises WHERE name = 'Reverse Lunges' LIMIT 1;
    SELECT id INTO ex_kb_overhead FROM exercises WHERE name = 'Kettlebell Overhead Hold' LIMIT 1;
    SELECT id INTO ex_bird_dogs FROM exercises WHERE name = 'Bird Dogs' LIMIT 1;
    SELECT id INTO ex_kb_swings FROM exercises WHERE name = 'Kettlebell Swings' LIMIT 1;
    SELECT id INTO ex_pushup_to_t FROM exercises WHERE name = 'Push-up to T' LIMIT 1;
    SELECT id INTO ex_kb_press FROM exercises WHERE name = 'Single-arm Kettlebell Press' LIMIT 1;
    SELECT id INTO ex_renegade_rows FROM exercises WHERE name = 'Renegade Rows' LIMIT 1;
    SELECT id INTO ex_wall_sit FROM exercises WHERE name = 'Wall Sit' LIMIT 1;
    SELECT id INTO ex_band_rows FROM exercises WHERE name = 'Resistance Band Rows' LIMIT 1;
    SELECT id INTO ex_yoga_flow FROM exercises WHERE name = 'Gentle Yoga Flow' LIMIT 1;
    SELECT id INTO ex_foam_rolling FROM exercises WHERE name = 'Foam Rolling' LIMIT 1;
    SELECT id INTO ex_breathing FROM exercises WHERE name = 'Breathing Exercises' LIMIT 1;
    SELECT id INTO ex_stretching FROM exercises WHERE name = 'Light Stretching' LIMIT 1;
    SELECT id INTO ex_power_circuit FROM exercises WHERE name = 'Power Circuit' LIMIT 1;
    SELECT id INTO ex_strength_superset FROM exercises WHERE name = 'Strength Superset' LIMIT 1;
    SELECT id INTO ex_hiit_finisher FROM exercises WHERE name = 'HIIT Finisher' LIMIT 1;
    SELECT id INTO ex_longer_holds FROM exercises WHERE name = 'Longer Holds' LIMIT 1;
    SELECT id INTO ex_tempo_work FROM exercises WHERE name = 'Tempo Work' LIMIT 1;
    SELECT id INTO ex_skill_dev FROM exercises WHERE name = 'Skill Development' LIMIT 1;
    SELECT id INTO ex_movement_quality FROM exercises WHERE name = 'Movement Quality Focus' LIMIT 1;

    -- Workout A: Strength Foundation
    IF template_id_a IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_a, ex_goblet_squats, 1, 3, '8-12', 60, 'Focus on depth and control'),
        (template_id_a, ex_pushups, 2, 3, '5-10', 60, 'Modified on knees if needed'),
        (template_id_a, ex_kb_row, 3, 3, '8', 45, 'Each arm'),
        (template_id_a, ex_plank, 4, 3, '15-30 seconds', 45, 'Maintain straight line'),
        (template_id_a, ex_glute_bridges, 5, 2, '12-15', 45, 'Squeeze at the top')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Workout B: Movement & Mobility
    IF template_id_b IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_b, ex_kb_deadlifts, 1, 3, '8-10', 60, 'Hip hinge pattern'),
        (template_id_b, ex_band_pullaparts, 2, 3, '12-15', 45, 'Squeeze shoulder blades'),
        (template_id_b, ex_reverse_lunges, 3, 2, '6', 45, 'Each leg'),
        (template_id_b, ex_kb_overhead, 4, 3, '20-30 seconds', 60, 'Each arm'),
        (template_id_b, ex_bird_dogs, 5, 2, '8', 45, 'Each side, controlled movement')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Workout Power: Power & Strength
    IF template_id_power IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_power, ex_kb_swings, 1, 4, '15-20', 60, 'Explosive hip drive'),
        (template_id_power, ex_pushup_to_t, 2, 3, '6-8', 60, 'Each side'),
        (template_id_power, ex_goblet_squats, 3, 4, '10-15', 60, 'Increase weight if possible'),
        (template_id_power, ex_kb_press, 4, 3, '6-8', 60, 'Each arm, strict form'),
        (template_id_power, ex_renegade_rows, 5, 3, '6', 45, 'Each arm, maintain plank'),
        (template_id_power, ex_wall_sit, 6, 3, '30-45 seconds', 45, 'Thighs parallel to ground')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Workout Metabolic: Metabolic Circuit
    IF template_id_metabolic IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_metabolic, ex_kb_swings, 1, 3, '45 seconds', 15, 'Circuit: 45s work / 15s rest'),
        (template_id_metabolic, ex_pushups, 2, 3, '45 seconds', 15, 'Circuit format'),
        (template_id_metabolic, ex_reverse_lunges, 3, 3, '45 seconds', 15, 'Alternating legs'),
        (template_id_metabolic, ex_band_rows, 4, 3, '45 seconds', 15, 'Circuit format'),
        (template_id_metabolic, ex_plank, 5, 3, '45 seconds', 15, 'Hold strong'),
        (template_id_metabolic, ex_glute_bridges, 6, 3, '45 seconds', 120, '2 min rest between rounds')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Workout Recovery: Recovery & Mobility
    IF template_id_recovery IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_recovery, ex_yoga_flow, 1, 1, '10 minutes', 0, 'Gentle flowing movements'),
        (template_id_recovery, ex_foam_rolling, 2, 1, '5 minutes', 0, 'If foam roller available'),
        (template_id_recovery, ex_breathing, 3, 1, '5 minutes', 0, 'Deep breathing practice'),
        (template_id_recovery, ex_stretching, 4, 1, '10 minutes', 0, 'Full body stretching')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Workout High: High-Intensity Day
    IF template_id_high IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_high, ex_power_circuit, 1, 4, '40 seconds', 20, '40s work / 20s rest'),
        (template_id_high, ex_strength_superset, 2, 3, 'To fatigue', 90, 'Compound movements'),
        (template_id_high, ex_hiit_finisher, 3, 1, '2 minutes', 0, 'Maximum intensity')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Workout Moderate: Moderate Day
    IF template_id_moderate IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_moderate, ex_longer_holds, 1, 3, '45-60 seconds', 60, 'Isometric holds'),
        (template_id_moderate, ex_tempo_work, 2, 3, '8-10', 60, '3-1-3 tempo'),
        (template_id_moderate, ex_skill_dev, 3, 3, 'Quality reps', 60, 'Focus on technique'),
        (template_id_moderate, ex_movement_quality, 4, 3, 'Slow reps', 60, 'Perfect form')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Workout Assessment: Assessment Day
    IF template_id_assessment IS NOT NULL THEN
        INSERT INTO workout_template_exercises (workout_template_id, exercise_id, order_index, sets, reps, rest_seconds, notes) VALUES
        (template_id_assessment, ex_pushups, 1, 1, 'Max reps', 180, 'Test maximum push-ups'),
        (template_id_assessment, ex_plank, 2, 1, 'Max time', 180, 'Test maximum plank hold'),
        (template_id_assessment, ex_goblet_squats, 3, 1, 'Max weight', 180, 'Test maximum weight for 8 reps')
        ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE 'Database seed completed successfully!';
    RAISE NOTICE 'Created 2 users (sarah/partner) with password: workout2024';
    RAISE NOTICE 'Created % exercises', (SELECT COUNT(*) FROM exercises);
    RAISE NOTICE 'Created % workout templates', (SELECT COUNT(*) FROM workout_templates);
    RAISE NOTICE 'Created % workout template exercises', (SELECT COUNT(*) FROM workout_template_exercises);
END $$;
