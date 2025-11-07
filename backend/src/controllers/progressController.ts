import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db/connection';

// Get user statistics
export const getUserStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { weekStart, weekEnd } = req.query;

    let queryText = `
      SELECT
        COUNT(DISTINCT ws.id) as total_workouts,
        COUNT(DISTINCT CASE WHEN ws.is_completed = true THEN ws.id END) as completed_workouts,
        AVG(ws.sleep_quality) as avg_sleep_quality,
        AVG(ws.energy_level) as avg_energy_level,
        AVG(ws.overall_rating) as avg_rating,
        MAX(ws.completed_date) as last_workout_date,
        SUM(ws.duration_minutes) as total_minutes,
        COUNT(DISTINCT el.exercise_id) as unique_exercises
      FROM workout_sessions ws
      LEFT JOIN exercise_logs el ON ws.id = el.workout_session_id
      WHERE ws.user_id = $1
    `;
    const params: any[] = [userId];

    if (weekStart) {
      params.push(weekStart);
      queryText += ` AND ws.week_number >= $${params.length}`;
    }

    if (weekEnd) {
      params.push(weekEnd);
      queryText += ` AND ws.week_number <= $${params.length}`;
    }

    const result = await query(queryText, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};

// Get exercise progress (track improvements over time)
export const getExerciseProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { exerciseId } = req.params;
    const { limit = 20 } = req.query;

    const result = await query(
      `SELECT
        el.id, el.set_number, el.reps, el.weight_lbs, el.duration_seconds,
        el.rpe, el.created_at,
        ws.scheduled_date, ws.week_number,
        e.name as exercise_name
      FROM exercise_logs el
      JOIN workout_sessions ws ON el.workout_session_id = ws.id
      JOIN exercises e ON el.exercise_id = e.id
      WHERE ws.user_id = $1 AND el.exercise_id = $2 AND ws.is_completed = true
      ORDER BY ws.scheduled_date DESC, el.set_number
      LIMIT $3`,
      [userId, exerciseId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercise progress:', error);
    res.status(500).json({ error: 'Failed to fetch exercise progress' });
  }
};

// Get weekly summary
export const getWeeklySummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { weeks = 12 } = req.query;

    const result = await query(
      `SELECT
        ws.week_number,
        COUNT(DISTINCT ws.id) as total_sessions,
        COUNT(DISTINCT CASE WHEN ws.is_completed = true THEN ws.id END) as completed_sessions,
        AVG(ws.sleep_quality) as avg_sleep,
        AVG(ws.energy_level) as avg_energy,
        AVG(ws.overall_rating) as avg_rating,
        SUM(ws.duration_minutes) as total_duration
      FROM workout_sessions ws
      WHERE ws.user_id = $1 AND ws.week_number <= $2
      GROUP BY ws.week_number
      ORDER BY ws.week_number`,
      [userId, weeks]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
};

// Get personal records (PRs)
export const getPersonalRecords = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get max weight for each exercise
    const weightPRs = await query(
      `SELECT DISTINCT ON (e.name)
        e.id as exercise_id,
        e.name as exercise_name,
        el.weight_lbs as max_weight,
        el.reps,
        ws.scheduled_date as achieved_date
      FROM exercise_logs el
      JOIN exercises e ON el.exercise_id = e.id
      JOIN workout_sessions ws ON el.workout_session_id = ws.id
      WHERE ws.user_id = $1 AND el.weight_lbs IS NOT NULL AND ws.is_completed = true
      ORDER BY e.name, el.weight_lbs DESC, ws.scheduled_date DESC`,
      [userId]
    );

    // Get max reps for bodyweight exercises
    const repPRs = await query(
      `SELECT DISTINCT ON (e.name)
        e.id as exercise_id,
        e.name as exercise_name,
        el.reps as max_reps,
        ws.scheduled_date as achieved_date
      FROM exercise_logs el
      JOIN exercises e ON el.exercise_id = e.id
      JOIN workout_sessions ws ON el.workout_session_id = ws.id
      WHERE ws.user_id = $1 AND el.reps IS NOT NULL AND ws.is_completed = true
      ORDER BY e.name, el.reps DESC, ws.scheduled_date DESC`,
      [userId]
    );

    // Get max duration for timed exercises
    const durationPRs = await query(
      `SELECT DISTINCT ON (e.name)
        e.id as exercise_id,
        e.name as exercise_name,
        el.duration_seconds as max_duration,
        ws.scheduled_date as achieved_date
      FROM exercise_logs el
      JOIN exercises e ON el.exercise_id = e.id
      JOIN workout_sessions ws ON el.workout_session_id = ws.id
      WHERE ws.user_id = $1 AND el.duration_seconds IS NOT NULL AND ws.is_completed = true
      ORDER BY e.name, el.duration_seconds DESC, ws.scheduled_date DESC`,
      [userId]
    );

    res.json({
      weightRecords: weightPRs.rows,
      repRecords: repPRs.rows,
      durationRecords: durationPRs.rows,
    });
  } catch (error) {
    console.error('Error fetching personal records:', error);
    res.status(500).json({ error: 'Failed to fetch personal records' });
  }
};

// Get body measurements
export const getProgressMeasurements = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { limit = 12 } = req.query;

    const result = await query(
      `SELECT *
      FROM progress_measurements
      WHERE user_id = $1
      ORDER BY measurement_date DESC
      LIMIT $2`,
      [userId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching progress measurements:', error);
    res.status(500).json({ error: 'Failed to fetch progress measurements' });
  }
};

// Create progress measurement
export const createProgressMeasurement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      measurementDate,
      bodyWeightLbs,
      bodyFatPercentage,
      chestInches,
      waistInches,
      hipsInches,
      armsInches,
      thighsInches,
      notes,
    } = req.body;

    const result = await query(
      `INSERT INTO progress_measurements
        (user_id, measurement_date, body_weight_lbs, body_fat_percentage,
         chest_inches, waist_inches, hips_inches, arms_inches, thighs_inches, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        userId,
        measurementDate,
        bodyWeightLbs || null,
        bodyFatPercentage || null,
        chestInches || null,
        waistInches || null,
        hipsInches || null,
        armsInches || null,
        thighsInches || null,
        notes || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating progress measurement:', error);
    res.status(500).json({ error: 'Failed to create progress measurement' });
  }
};

// Get user goals
export const getUserGoals = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { isAchieved } = req.query;

    let queryText = 'SELECT * FROM user_goals WHERE user_id = $1';
    const params: any[] = [userId];

    if (isAchieved !== undefined) {
      params.push(isAchieved === 'true');
      queryText += ` AND is_achieved = $${params.length}`;
    }

    queryText += ' ORDER BY target_date, created_at';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user goals:', error);
    res.status(500).json({ error: 'Failed to fetch user goals' });
  }
};

// Create user goal
export const createUserGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { goalType, targetValue, currentValue, unit, targetDate, notes } = req.body;

    const result = await query(
      `INSERT INTO user_goals
        (user_id, goal_type, target_value, current_value, unit, target_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, goalType, targetValue, currentValue || null, unit, targetDate, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user goal:', error);
    res.status(500).json({ error: 'Failed to create user goal' });
  }
};

// Update user goal
export const updateUserGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { currentValue, isAchieved, achievedDate, notes } = req.body;

    const result = await query(
      `UPDATE user_goals
       SET current_value = COALESCE($1, current_value),
           is_achieved = COALESCE($2, is_achieved),
           achieved_date = COALESCE($3, achieved_date),
           notes = COALESCE($4, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [currentValue, isAchieved, achievedDate, notes, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user goal:', error);
    res.status(500).json({ error: 'Failed to update user goal' });
  }
};
