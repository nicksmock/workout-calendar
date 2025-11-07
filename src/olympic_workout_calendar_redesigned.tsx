import React, { useState } from 'react';
import { Trophy, AlertCircle, Calendar, TrendingUp, History } from 'lucide-react';
import { WeekView, StatsDisplay, WorkoutDetails, WorkoutEditForm } from './components/workout';
import { CircularProgress } from './components/ui/ProgressBar';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { WorkoutHistory } from './components/progress/WorkoutHistory';
import { useWorkoutData } from './hooks/useWorkoutData';
import { PROGRAM_STRUCTURE, WORKOUT_DETAILS, DAY_NAMES } from './data/workoutProgram';

type ViewMode = 'calendar' | 'progress' | 'history';

const OlympicWorkoutCalendar = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('calendar');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [editingDay, setEditingDay] = useState<string | null>(null);

  // Use API hook for data management
  const {
    loading,
    error,
    getWorkoutData,
    saveWorkoutData,
    calculateStats,
    calculateOverallProgress,
  } = useWorkoutData();

  // Workout program structure and details (now imported from data file)
  const programStructure: any = PROGRAM_STRUCTURE;
  const workoutDetails: any = WORKOUT_DETAILS;
  const dayNames = DAY_NAMES;

  // Helper to convert API data (snake_case) to component data (camelCase)
  const apiToComponentData = (apiData: any) => ({
    completed: apiData.is_completed || false,
    sleepQuality: apiData.sleep_quality || 0,
    energyLevel: apiData.energy_level || 0,
    notes: apiData.notes || '',
    pushups: apiData.pushups || 0,
    plankHold: apiData.plank_hold || 0,
    weight: apiData.weight || '',
    reps: apiData.reps || '',
  });

  // Helper to convert component data (camelCase) to API data (snake_case)
  const componentToApiData = (componentData: any) => ({
    is_completed: componentData.completed || false,
    sleep_quality: componentData.sleepQuality || 0,
    energy_level: componentData.energyLevel || 0,
    notes: componentData.notes || '',
    pushups: componentData.pushups || 0,
    plank_hold: componentData.plankHold || 0,
    weight: componentData.weight || '',
    reps: componentData.reps || '',
  });

  const handleDayClick = (week: number, day: number, workout: string) => {
    setSelectedDay({ week, day, workout });
    setEditingDay(null);
  };

  const handleEdit = () => {
    if (selectedDay) {
      setEditingDay(`${selectedDay.week}-${selectedDay.day}`);
    }
  };

  const handleSave = async (data: any) => {
    if (selectedDay) {
      try {
        // Convert camelCase to snake_case for API
        const apiData = componentToApiData(data);
        await saveWorkoutData(selectedDay.week, selectedDay.day, apiData);
        setEditingDay(null);
      } catch (err) {
        console.error('Failed to save workout data:', err);
        // Error is handled by the hook
      }
    }
  };

  const handleCancel = () => {
    setEditingDay(null);
  };

  const handleClose = () => {
    setSelectedDay(null);
    setEditingDay(null);
  };

  const weekData = programStructure[currentWeek];
  const isEditingCurrentDay = selectedDay && editingDay === `${selectedDay.week}-${selectedDay.day}`;
  const overallProgress = calculateOverallProgress();

  // Create a workoutData object for child components that expects camelCase
  const workoutDataForComponents: any = {};
  for (let week = 1; week <= 12; week++) {
    for (let day = 0; day < 7; day++) {
      const key = `week-${week}-day-${day}`;
      const apiData = getWorkoutData(week, day);
      workoutDataForComponents[key] = apiToComponentData(apiData);
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen responsive-padding flex items-center justify-center">
        <div className="glass-card-strong p-8 rounded-xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading workout data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen responsive-padding">
      <div className="container-custom">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 glass-card-strong p-4 rounded-lg border-2 border-red-500 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-white font-semibold">Error Loading Data</p>
                <p className="text-white/80 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="text-center py-8 md:py-12 animate-fade-in">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-gradient-primary animate-float">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white text-shadow-strong">
              Olympic Workout Calendar
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Your 12-week journey to peak fitness and athletic performance
            </p>
          </div>

          {/* Overall Progress */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <CircularProgress
              value={overallProgress}
              size={140}
              strokeWidth={12}
              label="Overall Progress"
            />
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-card-strong p-2 rounded-pill inline-flex gap-2">
            <TabButton
              icon={<Calendar className="w-4 h-4" />}
              label="Calendar"
              active={currentView === 'calendar'}
              onClick={() => setCurrentView('calendar')}
            />
            <TabButton
              icon={<TrendingUp className="w-4 h-4" />}
              label="Progress"
              active={currentView === 'progress'}
              onClick={() => setCurrentView('progress')}
            />
            <TabButton
              icon={<History className="w-4 h-4" />}
              label="History"
              active={currentView === 'history'}
              onClick={() => setCurrentView('history')}
            />
          </div>
        </div>

        {/* Calendar View */}
        {currentView === 'calendar' && (
          <>
            {/* Assessment Week Stats */}
            {(currentWeek === 4 || currentWeek === 8 || currentWeek === 12) && (
              <StatsDisplay stats={calculateStats(currentWeek)} currentWeek={currentWeek} />
            )}

            {/* Week View */}
            <div className="mb-6">
          <WeekView
            currentWeek={currentWeek}
            phase={weekData.phase}
            workouts={weekData.workouts}
            dayNames={dayNames}
            workoutDetails={workoutDetails}
            workoutData={workoutDataForComponents}
            onPreviousWeek={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            onNextWeek={() => setCurrentWeek(Math.min(12, currentWeek + 1))}
            onDayClick={handleDayClick}
          />
        </div>

            {/* Workout Details or Edit Form */}
            {selectedDay && (
              <div className="mb-8 animate-fade-in">
                {isEditingCurrentDay ? (
                  <div className="glass-card-strong p-6 md:p-8 rounded-xl">
                    <h3 className="text-2xl font-bold text-white mb-6 text-shadow">
                      Log Your Workout
                    </h3>
                    <WorkoutEditForm
                      dayData={apiToComponentData(getWorkoutData(selectedDay.week, selectedDay.day))}
                      workout={selectedDay.workout}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                ) : (
                  <WorkoutDetails
                    week={selectedDay.week}
                    day={selectedDay.day}
                    dayName={dayNames[selectedDay.day]}
                    workoutInfo={workoutDetails[selectedDay.workout]}
                    dayData={apiToComponentData(getWorkoutData(selectedDay.week, selectedDay.day))}
                    onClose={handleClose}
                    onEdit={handleEdit}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Progress View */}
        {currentView === 'progress' && (
          <ProgressDashboard workoutData={workoutDataForComponents} />
        )}

        {/* History View */}
        {currentView === 'history' && (
          <WorkoutHistory workoutData={workoutDataForComponents} />
        )}

        {/* Footer */}
        <footer className="text-center py-8 text-white/60">
          <p className="text-sm">
            Stay consistent, track your progress, and achieve your fitness goals 💪
          </p>
        </footer>
      </div>
    </div>
  );
};

// Tab Button Component
interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-pill font-medium transition-all ${
        active
          ? 'bg-gradient-primary text-white shadow-medium'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default OlympicWorkoutCalendar;
