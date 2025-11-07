import axios, { AxiosInstance, AxiosError } from 'axios';

// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server');
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// WORKOUT SESSION API
// ============================================================================

export interface WorkoutSession {
  id?: string;
  user_id: string;
  workout_template_id?: string;
  scheduled_date: string;
  completed_date?: string;
  duration_minutes?: number;
  is_completed: boolean;
  week_number: number;
  day_number: number;
  sleep_quality?: number;
  energy_level?: number;
  soreness_level?: number;
  notes?: string;
  overall_rating?: number;
}

export interface ExerciseLog {
  id?: string;
  workout_session_id: string;
  exercise_id: string;
  order_index: number;
  set_number: number;
  reps?: number;
  weight_lbs?: number;
  duration_seconds?: number;
  distance_meters?: number;
  rpe?: number;
  notes?: string;
}

export const workoutApi = {
  // Get all workout sessions for a user
  getSessions: async (userId: string, params?: { week?: number; isCompleted?: boolean; limit?: number; offset?: number }) => {
    const response = await apiClient.get<WorkoutSession[]>('/workouts/sessions', {
      params: { ...params },
      headers: { 'X-User-ID': userId }, // Simple user identification without auth
    });
    return response.data;
  },

  // Get specific workout session by ID
  getSession: async (userId: string, sessionId: string) => {
    const response = await apiClient.get<WorkoutSession>(`/workouts/sessions/${sessionId}`, {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Create new workout session
  createSession: async (userId: string, session: Partial<WorkoutSession>) => {
    const response = await apiClient.post<WorkoutSession>('/workouts/sessions', session, {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Update workout session
  updateSession: async (userId: string, sessionId: string, updates: Partial<WorkoutSession>) => {
    const response = await apiClient.put<WorkoutSession>(`/workouts/sessions/${sessionId}`, updates, {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Delete workout session
  deleteSession: async (userId: string, sessionId: string) => {
    const response = await apiClient.delete(`/workouts/sessions/${sessionId}`, {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Log exercise performance
  logExercise: async (userId: string, sessionId: string, exerciseLog: Partial<ExerciseLog>) => {
    const response = await apiClient.post<ExerciseLog>(
      `/workouts/sessions/${sessionId}/exercises`,
      exerciseLog,
      {
        headers: { 'X-User-ID': userId },
      }
    );
    return response.data;
  },

  // Get workout templates
  getTemplates: async () => {
    const response = await apiClient.get('/workouts/templates');
    return response.data;
  },

  // Get exercises
  getExercises: async (params?: { category?: string; difficulty?: string }) => {
    const response = await apiClient.get('/workouts/exercises', { params });
    return response.data;
  },
};

// ============================================================================
// PROGRESS API
// ============================================================================

export interface UserStats {
  total_workouts: number;
  completed_workouts: number;
  avg_sleep_quality: number;
  avg_energy_level: number;
  avg_rating: number;
  last_workout_date: string;
  total_minutes: number;
  unique_exercises: number;
}

export interface PersonalRecords {
  weightRecords: Array<{
    exercise_id: string;
    exercise_name: string;
    max_weight: number;
    reps: number;
    achieved_date: string;
  }>;
  repRecords: Array<{
    exercise_id: string;
    exercise_name: string;
    max_reps: number;
    achieved_date: string;
  }>;
  durationRecords: Array<{
    exercise_id: string;
    exercise_name: string;
    max_duration: number;
    achieved_date: string;
  }>;
}

export const progressApi = {
  // Get user statistics
  getStats: async (userId: string, params?: { weekStart?: number; weekEnd?: number }) => {
    const response = await apiClient.get<UserStats>('/progress/stats', {
      params,
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Get weekly summary
  getWeeklySummary: async (userId: string, weeks: number = 12) => {
    const response = await apiClient.get('/progress/weekly', {
      params: { weeks },
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Get personal records
  getPersonalRecords: async (userId: string) => {
    const response = await apiClient.get<PersonalRecords>('/progress/records', {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Get exercise progress history
  getExerciseProgress: async (userId: string, exerciseId: string, limit: number = 20) => {
    const response = await apiClient.get(`/progress/exercises/${exerciseId}`, {
      params: { limit },
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Get body measurements
  getMeasurements: async (userId: string, limit: number = 12) => {
    const response = await apiClient.get('/progress/measurements', {
      params: { limit },
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Create body measurement
  createMeasurement: async (userId: string, measurement: any) => {
    const response = await apiClient.post('/progress/measurements', measurement, {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Get user goals
  getGoals: async (userId: string, isAchieved?: boolean) => {
    const response = await apiClient.get('/progress/goals', {
      params: { isAchieved },
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Create goal
  createGoal: async (userId: string, goal: any) => {
    const response = await apiClient.post('/progress/goals', goal, {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },

  // Update goal
  updateGoal: async (userId: string, goalId: string, updates: any) => {
    const response = await apiClient.put(`/progress/goals/${goalId}`, updates, {
      headers: { 'X-User-ID': userId },
    });
    return response.data;
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return error.response.data?.error || error.response.statusText;
    } else if (error.request) {
      return 'Network error: Unable to reach the server';
    }
  }
  return 'An unexpected error occurred';
};

export default {
  workout: workoutApi,
  progress: progressApi,
  handleApiError,
};
