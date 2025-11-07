import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query, transaction } from '../db/connection';

// Get all workout templates
export const getWorkoutTemplates = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await query(`
      SELECT
        wt.id, wt.name, wt.description, wt.workout_type, wt.phase,
        wt.week_number, wt.duration_minutes, wt.warm_up, wt.cool_down, wt.notes
      FROM workout_templates wt
      ORDER BY wt.week_number, wt.workout_type
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout templates:', error);
    res.status(500).json({ error: 'Failed to fetch workout templates' });
  }
};

// Get workout template by ID with exercises
export const getWorkoutTemplateById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Get template details
    const templateResult = await query(
      `SELECT * FROM workout_templates WHERE id = $1`,
      [id]
    );

    if (templateResult.rows.length === 0) {
      res.status(404).json({ error: 'Workout template not found' });
      return;
    }

    // Get exercises for this template
    const exercisesResult = await query(
      `SELECT
        wte.id, wte.order_index, wte.sets, wte.reps, wte.rest_seconds, wte.notes,
        e.id as exercise_id, e.name as exercise_name, e.description, e.category,
        e.equipment, e.muscle_groups, e.video_url, e.difficulty_level
      FROM workout_template_exercises wte
      JOIN exercises e ON wte.exercise_id = e.id
      WHERE wte.workout_template_id = $1
      ORDER BY wte.order_index`,
      [id]
    );

    res.json({
      ...templateResult.rows[0],
      exercises: exercisesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching workout template:', error);
    res.status(500).json({ error: 'Failed to fetch workout template' });
  }
};

// Get all exercises
export const getExercises = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category, difficulty } = req.query;

    let queryText = 'SELECT * FROM exercises WHERE 1=1';
    const params: any[] = [];

    if (category) {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }

    if (difficulty) {
      params.push(difficulty);
      queryText += ` AND difficulty_level = $${params.length}`;
    }

    queryText += ' ORDER BY name';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

// Get user's workout sessions
export const getWorkoutSessions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { week, isCompleted, limit = 50, offset = 0 } = req.query;

    let queryText = `
      SELECT
        ws.id, ws.scheduled_date, ws.completed_date, ws.duration_minutes,
        ws.is_completed, ws.week_number, ws.day_number,
        ws.sleep_quality, ws.energy_level, ws.soreness_level,
        ws.notes, ws.overall_rating,
        wt.name as workout_name, wt.workout_type, wt.phase
      FROM workout_sessions ws
      LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
      WHERE ws.user_id = $1
    `;
    const params: any[] = [userId];

    if (week) {
      params.push(week);
      queryText += ` AND ws.week_number = $${params.length}`;
    }

    if (isCompleted !== undefined) {
      params.push(isCompleted === 'true');
      queryText += ` AND ws.is_completed = $${params.length}`;
    }

    queryText += ' ORDER BY ws.scheduled_date DESC';
    params.push(limit, offset);
    queryText += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    res.status(500).json({ error: 'Failed to fetch workout sessions' });
  }
};

// Get workout session by ID with exercise logs
export const getWorkoutSessionById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Get session details
    const sessionResult = await query(
      `SELECT
        ws.*,
        wt.name as workout_name, wt.workout_type, wt.phase, wt.warm_up, wt.cool_down
      FROM workout_sessions ws
      LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
      WHERE ws.id = $1 AND ws.user_id = $2`,
      [id, userId]
    );

    if (sessionResult.rows.length === 0) {
      res.status(404).json({ error: 'Workout session not found' });
      return;
    }

    // Get exercise logs for this session
    const logsResult = await query(
      `SELECT
        el.id, el.order_index, el.set_number, el.reps, el.weight_lbs,
        el.duration_seconds, el.distance_meters, el.rpe, el.notes,
        e.id as exercise_id, e.name as exercise_name, e.category,
        e.video_url, e.equipment
      FROM exercise_logs el
      JOIN exercises e ON el.exercise_id = e.id
      WHERE el.workout_session_id = $1
      ORDER BY el.order_index, el.set_number`,
      [id]
    );

    res.json({
      ...sessionResult.rows[0],
      exercise_logs: logsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching workout session:', error);
    res.status(500).json({ error: 'Failed to fetch workout session' });
  }
};

// Create workout session
export const createWorkoutSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      workoutTemplateId,
      scheduledDate,
      weekNumber,
      dayNumber,
      sleepQuality,
      energyLevel,
      notes,
    } = req.body;

    const result = await query(
      `INSERT INTO workout_sessions
        (user_id, workout_template_id, scheduled_date, week_number, day_number,
         sleep_quality, energy_level, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        workoutTemplateId || null,
        scheduledDate,
        weekNumber,
        dayNumber,
        sleepQuality || null,
        energyLevel || null,
        notes || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating workout session:', error);
    res.status(500).json({ error: 'Failed to create workout session' });
  }
};

// Update workout session
export const updateWorkoutSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      completedDate,
      durationMinutes,
      isCompleted,
      sleepQuality,
      energyLevel,
      sorenessLevel,
      notes,
      overallRating,
    } = req.body;

    const result = await query(
      `UPDATE workout_sessions
       SET completed_date = COALESCE($1, completed_date),
           duration_minutes = COALESCE($2, duration_minutes),
           is_completed = COALESCE($3, is_completed),
           sleep_quality = COALESCE($4, sleep_quality),
           energy_level = COALESCE($5, energy_level),
           soreness_level = COALESCE($6, soreness_level),
           notes = COALESCE($7, notes),
           overall_rating = COALESCE($8, overall_rating),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [
        completedDate,
        durationMinutes,
        isCompleted,
        sleepQuality,
        energyLevel,
        sorenessLevel,
        notes,
        overallRating,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Workout session not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating workout session:', error);
    res.status(500).json({ error: 'Failed to update workout session' });
  }
};

// Log exercise (create or update exercise log)
export const logExercise = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const {
      exerciseId,
      orderIndex,
      setNumber,
      reps,
      weightLbs,
      durationSeconds,
      distanceMeters,
      rpe,
      notes,
    } = req.body;

    // Verify session belongs to user
    const sessionCheck = await query(
      'SELECT id FROM workout_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionCheck.rows.length === 0) {
      res.status(404).json({ error: 'Workout session not found' });
      return;
    }

    const result = await query(
      `INSERT INTO exercise_logs
        (workout_session_id, exercise_id, order_index, set_number, reps,
         weight_lbs, duration_seconds, distance_meters, rpe, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        sessionId,
        exerciseId,
        orderIndex,
        setNumber,
        reps || null,
        weightLbs || null,
        durationSeconds || null,
        distanceMeters || null,
        rpe || null,
        notes || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging exercise:', error);
    res.status(500).json({ error: 'Failed to log exercise' });
  }
};

// Delete workout session
export const deleteWorkoutSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM workout_sessions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Workout session not found' });
      return;
    }

    res.json({ message: 'Workout session deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout session:', error);
    res.status(500).json({ error: 'Failed to delete workout session' });
  }
};
