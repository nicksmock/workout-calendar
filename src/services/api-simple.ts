import axios, { AxiosInstance, AxiosError } from 'axios';

// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Single user ID (Sarah from seed data) - no auth needed
const USER_ID = '550e8400-e29b-41d4-a716-446655440001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': USER_ID, // Include user ID in all requests
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response from server');
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// TYPES
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
  // Custom fields for simplified tracking
  pushups?: number;
  plank_hold?: number;
  weight?: string;
  reps?: string;
}

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

// ============================================================================
// WORKOUT SESSION API
// ============================================================================

export const workoutApi = {
  // Get all workout sessions
  getSessions: async (params?: { week?: number; isCompleted?: boolean; limit?: number; offset?: number }) => {
    const response = await apiClient.get<WorkoutSession[]>('/workouts/sessions', { params });
    return response.data;
  },

  // Get specific workout session by ID
  getSession: async (sessionId: string) => {
    const response = await apiClient.get<WorkoutSession>(`/workouts/sessions/${sessionId}`);
    return response.data;
  },

  // Create new workout session
  createSession: async (session: Partial<WorkoutSession>) => {
    const response = await apiClient.post<WorkoutSession>('/workouts/sessions', {
      ...session,
      user_id: USER_ID,
    });
    return response.data;
  },

  // Update workout session
  updateSession: async (sessionId: string, updates: Partial<WorkoutSession>) => {
    const response = await apiClient.put<WorkoutSession>(`/workouts/sessions/${sessionId}`, updates);
    return response.data;
  },

  // Delete workout session
  deleteSession: async (sessionId: string) => {
    const response = await apiClient.delete(`/workouts/sessions/${sessionId}`);
    return response.data;
  },
};

// ============================================================================
// PROGRESS API
// ============================================================================

export const progressApi = {
  // Get user statistics
  getStats: async (params?: { weekStart?: number; weekEnd?: number }) => {
    const response = await apiClient.get<UserStats>('/progress/stats', { params });
    return response.data;
  },

  // Get weekly summary
  getWeeklySummary: async (weeks: number = 12) => {
    const response = await apiClient.get('/progress/weekly', { params: { weeks } });
    return response.data;
  },

  // Get personal records
  getPersonalRecords: async () => {
    const response = await apiClient.get('/progress/records');
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
      return 'Network error: Unable to reach the server. Make sure the backend is running.';
    }
  }
  return 'An unexpected error occurred';
};

export default {
  workout: workoutApi,
  progress: progressApi,
  handleApiError,
};
