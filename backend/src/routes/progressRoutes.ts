import { Router } from 'express';
import {
  getUserStats,
  getExerciseProgress,
  getWeeklySummary,
  getPersonalRecords,
  getProgressMeasurements,
  createProgressMeasurement,
  getUserGoals,
  createUserGoal,
  updateUserGoal,
} from '../controllers/progressController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All progress routes require authentication
router.use(authenticateToken);

// User statistics
router.get('/stats', getUserStats);
router.get('/weekly', getWeeklySummary);
router.get('/records', getPersonalRecords);

// Exercise progress
router.get('/exercises/:exerciseId', getExerciseProgress);

// Body measurements
router.get('/measurements', getProgressMeasurements);
router.post('/measurements', createProgressMeasurement);

// Goals
router.get('/goals', getUserGoals);
router.post('/goals', createUserGoal);
router.put('/goals/:id', updateUserGoal);

export default router;
