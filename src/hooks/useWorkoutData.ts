import { useState, useEffect, useCallback } from 'react';
import { workoutApi, WorkoutSession, handleApiError } from '../services/api-simple';

interface WorkoutData {
  [key: string]: WorkoutSession;
}

export const useWorkoutData = () => {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to create workout key
  const getWorkoutKey = (week: number, day: number) => `week-${week}-day-${day}`;

  // Load all workout sessions
  const loadWorkoutData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const sessions = await workoutApi.getSessions({ limit: 100 });

      // Transform sessions into our workout data format
      const data: WorkoutData = {};
      sessions.forEach((session: WorkoutSession) => {
        const key = getWorkoutKey(session.week_number, session.day_number);
        data[key] = session;
      });

      setWorkoutData(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error loading workout data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount and when user changes
  useEffect(() => {
    loadWorkoutData();
  }, [loadWorkoutData]);

  // Get workout data for a specific day
  const getWorkoutData = (week: number, day: number): Partial<WorkoutSession> => {
    const key = getWorkoutKey(week, day);
    return workoutData[key] || {};
  };

  // Save or update workout data
  const saveWorkoutData = async (week: number, day: number, data: Partial<WorkoutSession>) => {
    const key = getWorkoutKey(week, day);
    const existingSession = workoutData[key];

    try {
      setError(null);

      let updatedSession: WorkoutSession;

      if (existingSession?.id) {
        // Update existing session
        updatedSession = await workoutApi.updateSession(
          existingSession.id,
          {
            ...data,
            is_completed: data.is_completed || false,
            completed_date: data.is_completed ? new Date().toISOString() : undefined,
          }
        );
      } else {
        // Create new session
        const scheduledDate = calculateScheduledDate(week, day);
        updatedSession = await workoutApi.createSession({
          scheduled_date: scheduledDate,
          week_number: week,
          day_number: day,
          ...data,
          is_completed: data.is_completed || false,
          completed_date: data.is_completed ? new Date().toISOString() : undefined,
        });
      }

      // Update local state
      setWorkoutData((prev) => ({
        ...prev,
        [key]: updatedSession,
      }));

      return updatedSession;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error saving workout data:', err);
      throw err;
    }
  };

  // Delete workout session
  const deleteWorkoutData = async (week: number, day: number) => {
    const key = getWorkoutKey(week, day);
    const existingSession = workoutData[key];

    if (!existingSession?.id) {
      return; // Nothing to delete
    }

    try {
      setError(null);
      await workoutApi.deleteSession(existingSession.id);

      // Update local state
      setWorkoutData((prev) => {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      });
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error deleting workout data:', err);
      throw err;
    }
  };

  // Calculate scheduled date based on week and day
  const calculateScheduledDate = (week: number, day: number): string => {
    // Start from today and calculate the date
    // This is a simple implementation - you might want to adjust based on program start date
    const today = new Date();
    const programStartDate = new Date(today);
    programStartDate.setDate(today.getDate() - (today.getDay() || 7) + 1); // Start of this week (Monday)

    const targetDate = new Date(programStartDate);
    targetDate.setDate(programStartDate.getDate() + (week - 1) * 7 + day);

    return targetDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  };

  // Calculate stats for assessment weeks
  const calculateStats = (currentWeek: number) => {
    const weeks = currentWeek === 4 ? [1, 2, 3, 4] :
                  currentWeek === 8 ? [1, 2, 3, 4, 5, 6, 7, 8] :
                  currentWeek === 12 ? Array.from({length: 12}, (_, i) => i + 1) : [];

    let totalWorkouts = 0;
    let avgSleep = 0;
    let avgEnergy = 0;
    let sleepCount = 0;
    let energyCount = 0;
    const pushupProgress: number[] = [];
    const plankProgress: number[] = [];

    weeks.forEach(week => {
      for (let day = 0; day < 7; day++) {
        const data = getWorkoutData(week, day);
        if (data.is_completed) totalWorkouts++;
        if (data.sleep_quality) {
          avgSleep += data.sleep_quality;
          sleepCount++;
        }
        if (data.energy_level) {
          avgEnergy += data.energy_level;
          energyCount++;
        }
        // Note: We'll need to get these from exercise_logs in a more complete implementation
        // For now, we can add custom fields to the session if needed
      }
    });

    return {
      totalWorkouts,
      avgSleep: sleepCount ? (avgSleep / sleepCount).toFixed(1) : '0',
      avgEnergy: energyCount ? (avgEnergy / energyCount).toFixed(1) : '0',
      bestPushups: Math.max(...pushupProgress, 0),
      bestPlank: Math.max(...plankProgress, 0),
      weeksCompleted: weeks.length
    };
  };

  // Calculate overall progress percentage
  const calculateOverallProgress = (): number => {
    let totalWorkouts = 0;
    let completedWorkouts = 0;

    for (let week = 1; week <= 12; week++) {
      for (let day = 0; day < 7; day++) {
        totalWorkouts++;
        const data = getWorkoutData(week, day);
        if (data.is_completed) completedWorkouts++;
      }
    }

    return totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
  };

  return {
    workoutData,
    loading,
    error,
    getWorkoutData,
    saveWorkoutData,
    deleteWorkoutData,
    calculateStats,
    calculateOverallProgress,
    refreshData: loadWorkoutData,
  };
};

export default useWorkoutData;
