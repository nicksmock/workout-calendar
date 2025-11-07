import { Router } from 'express';
import {
  getWorkoutTemplates,
  getWorkoutTemplateById,
  getExercises,
  getWorkoutSessions,
  getWorkoutSessionById,
  createWorkoutSession,
  updateWorkoutSession,
  logExercise,
  deleteWorkoutSession,
} from '../controllers/workoutController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All workout routes require authentication
router.use(authenticateToken);

// Workout templates
router.get('/templates', getWorkoutTemplates);
router.get('/templates/:id', getWorkoutTemplateById);

// Exercises
router.get('/exercises', getExercises);

// Workout sessions
router.get('/sessions', getWorkoutSessions);
router.get('/sessions/:id', getWorkoutSessionById);
router.post('/sessions', createWorkoutSession);
router.put('/sessions/:id', updateWorkoutSession);
router.delete('/sessions/:id', deleteWorkoutSession);

// Exercise logs
router.post('/sessions/:sessionId/exercises', logExercise);

export default router;
