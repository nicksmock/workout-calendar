import React, { useState } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { WeekView, StatsDisplay, WorkoutDetails, WorkoutEditForm } from './components/workout';
import { CircularProgress } from './components/ui/ProgressBar';

const OlympicWorkoutCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [workoutData, setWorkoutData] = useState<any>({});
  const [editingDay, setEditingDay] = useState<string | null>(null);

  // Workout program structure
  const programStructure: any = {
    // Phase 1: Foundation (Weeks 1-4)
    1: { phase: 'Foundation', workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
    2: { phase: 'Foundation', workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Rest', 'Rest'] },
    3: { phase: 'Foundation', workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
    4: { phase: 'Foundation', workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Assessment', 'Rest'] },

    // Phase 2: Building (Weeks 5-8)
    5: { phase: 'Building', workouts: ['Power', 'Rest', 'Metabolic', 'Rest', 'Power', 'Recovery', 'Rest'] },
    6: { phase: 'Building', workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Recovery', 'Rest'] },
    7: { phase: 'Building', workouts: ['Power', 'Rest', 'Metabolic', 'Recovery', 'Power', 'Rest', 'Rest'] },
    8: { phase: 'Building', workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Assessment', 'Rest'] },

    // Phase 3: Athletic Performance (Weeks 9-12)
    9: { phase: 'Athletic Performance', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
    10: { phase: 'Athletic Performance', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
    11: { phase: 'Athletic Performance', workouts: ['High', 'Moderate', 'Rest', 'High', 'Rest', 'Moderate', 'Rest'] },
    12: { phase: 'Athletic Performance', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'Assessment', 'Celebration', 'Rest'] }
  };

  const workoutDetails: any = {
    'A': {
      name: 'Strength Foundation',
      duration: '15-20 min',
      warmup: ['Arm circles: 10 each direction', 'Leg swings: 10 each leg, each direction', 'Bodyweight squats: 10 slow reps', 'Cat-cow stretches: 10 reps'],
      exercises: [
        { name: 'Goblet Squats - 3 sets of 8-12 reps', video: 'https://www.youtube.com/watch?v=MeIiIdhvXT4' },
        { name: 'Push-ups (modified as needed) - 3 sets of 5-10 reps', video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { name: 'Single-arm KB Row - 3 sets of 8 each arm', video: 'https://www.youtube.com/watch?v=8QTjp8n5suM' },
        { name: 'Plank Hold - 3 sets of 15-30 seconds', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
        { name: 'Glute Bridges - 2 sets of 12-15 reps', video: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E' }
      ],
      cooldown: ['Hip flexor stretch: 30s each side', 'Seated spinal twist: 30s each side', 'Deep breathing: 2 minutes'],
      color: '#8be9fd'
    },
    'B': {
      name: 'Movement & Mobility',
      duration: '15-20 min',
      warmup: ['Marching in place: 1 minute', 'Arm swings: 20 total', 'Hip circles: 10 each direction'],
      exercises: [
        { name: 'KB Deadlifts - 3 sets of 8-10 reps', video: 'https://www.youtube.com/watch?v=2gZlPqiN1q4' },
        { name: 'Band Pull-aparts - 3 sets of 12-15 reps', video: 'https://www.youtube.com/watch?v=ak4VWkKBgKQ' },
        { name: 'Reverse Lunges - 2 sets of 6 each leg', video: 'https://www.youtube.com/watch?v=xXA3gSHFuGU' },
        { name: 'KB Overhead Hold - 3 sets of 20-30 seconds each arm', video: 'https://www.youtube.com/watch?v=TQqgf8kB6R8' },
        { name: 'Bird Dogs - 2 sets of 8 each side', video: 'https://www.youtube.com/watch?v=wiFNA3sqjCA' }
      ],
      cooldown: ['Child\'s pose: 1 minute', 'Pigeon pose: 1 minute each side', 'Relaxation breathing: 2 minutes'],
      color: '#50fa7b'
    },
    'Power': {
      name: 'Power & Strength',
      duration: '20-25 min',
      warmup: ['Dynamic movement flow from Phase 1', 'KB swings: 2 sets of 10 (light weight)'],
      exercises: [
        { name: 'KB Swings - 4 sets of 15-20 reps (rest 45-60s between)', video: 'https://www.youtube.com/watch?v=yeMXdkZ18EA' },
        { name: 'Push-up to T - 3 sets of 6-8 each side', video: 'https://www.youtube.com/watch?v=qp6AlHMM_5o' },
        { name: 'Goblet Squats - 4 sets of 10-15 reps', video: 'https://www.youtube.com/watch?v=MeIiIdhvXT4' },
        { name: 'Single-arm KB Press - 3 sets of 6-8 each arm', video: 'https://www.youtube.com/watch?v=Ya1GeNlPKz0' },
        { name: 'Renegade Rows - 3 sets of 6 each arm', video: 'https://www.youtube.com/watch?v=PKmZICy4wl0' },
        { name: 'Wall Sit - 3 sets of 30-45 seconds', video: 'https://www.youtube.com/watch?v=y-wV4Venusw' }
      ],
      cooldown: ['Light stretching', 'Deep breathing'],
      color: '#ff5555'
    },
    'Metabolic': {
      name: 'Metabolic Circuit',
      duration: '20-25 min',
      warmup: ['Dynamic movement prep', 'Light activation exercises'],
      exercises: [
        { name: '3 ROUNDS - 45 seconds work / 15 seconds rest:', video: null },
        { name: '• KB Swings', video: 'https://www.youtube.com/watch?v=yeMXdkZ18EA' },
        { name: '• Push-ups', video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { name: '• Reverse Lunges (alternating)', video: 'https://www.youtube.com/watch?v=xXA3gSHFuGU' },
        { name: '• Band Rows', video: 'https://www.youtube.com/watch?v=ak4VWkKBgKQ' },
        { name: '• Plank Hold', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
        { name: '• Glute Bridges', video: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E' },
        { name: 'Rest 2 minutes between rounds', video: null }
      ],
      cooldown: ['Walking cool-down', 'Light stretching'],
      color: '#ffb86c'
    },
    'Recovery': {
      name: 'Recovery & Mobility',
      duration: '15-20 min',
      warmup: ['Gentle movement', 'Deep breathing'],
      exercises: [
        { name: 'Gentle yoga flow', video: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
        { name: 'Foam rolling (if available)', video: 'https://www.youtube.com/watch?v=_5HI8AtTfc0' },
        { name: 'Breathing exercises', video: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' },
        { name: 'Light stretching', video: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' }
      ],
      cooldown: ['Relaxation pose', 'Meditation'],
      color: '#bd93f9'
    },
    'High': {
      name: 'High-Intensity Day',
      duration: '25-30 min',
      warmup: ['Movement prep: 5 minutes', 'Activation exercises'],
      exercises: [
        { name: 'POWER CIRCUIT - 4 rounds, 40 sec work / 20 sec rest', video: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
        { name: 'STRENGTH SUPERSET - 3 sets of compound movements', video: 'https://www.youtube.com/watch?v=vc1E5CfRfos' },
        { name: 'FINISHER - 2 minutes high-intensity', video: 'https://www.youtube.com/watch?v=cZnsLVArIt8' }
      ],
      cooldown: ['Walking cool-down', 'Thorough stretching'],
      color: '#ff5555'
    },
    'Moderate': {
      name: 'Moderate Day',
      duration: '20-25 min',
      warmup: ['Gentle movement prep', 'Joint mobility'],
      exercises: [
        { name: 'Longer holds', video: 'https://www.youtube.com/watch?v=U2M-m5TgsS8' },
        { name: 'Tempo work', video: 'https://www.youtube.com/watch?v=GXjKWyXzFJU' },
        { name: 'Skill development', video: 'https://www.youtube.com/watch?v=sw8QtE6vEhQ' },
        { name: 'Movement quality focus', video: 'https://www.youtube.com/watch?v=E3h-T3KQNys' }
      ],
      cooldown: ['Extended stretching', 'Breathing exercises'],
      color: '#f1fa8c'
    },
    'Assessment': {
      name: 'Assessment Day',
      duration: '20-30 min',
      warmup: ['Light movement prep', 'Joint mobility'],
      exercises: [
        { name: 'Push-ups test - Maximum reps', video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { name: 'Plank hold test - Maximum time', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
        { name: 'Strength measurements', video: null },
        { name: 'Progress photos', video: null },
        { name: 'Record improvements vs baseline', video: null }
      ],
      cooldown: ['Light stretching', 'Reflection notes'],
      color: '#f1fa8c'
    },
    'Celebration': {
      name: 'Celebration Recovery',
      duration: '20 min',
      warmup: ['Gentle movement'],
      exercises: [
        { name: 'Gentle mobility', video: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
        { name: 'Reflection', video: null },
        { name: 'Program completion celebration', video: null }
      ],
      cooldown: ['Relaxation', 'Gratitude practice'],
      color: '#ff79c6'
    },
    'Rest': {
      name: 'Rest Day',
      duration: 'Optional light activity',
      warmup: ['Optional gentle movement'],
      exercises: [
        { name: 'Light walk (10-15 min)', video: null },
        { name: 'Gentle stretching', video: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
        { name: 'Complete rest', video: null }
      ],
      cooldown: ['Relaxation'],
      color: '#6272a4'
    }
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getWorkoutKey = (week: number, day: number) => `week-${week}-day-${day}`;

  const saveWorkoutData = (week: number, day: number, data: any) => {
    const key = getWorkoutKey(week, day);
    setWorkoutData((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], ...data }
    }));
  };

  const getWorkoutData = (week: number, day: number) => {
    const key = getWorkoutKey(week, day);
    return workoutData[key] || {};
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
    let pushupProgress: number[] = [];
    let plankProgress: number[] = [];

    weeks.forEach(week => {
      for (let day = 0; day < 7; day++) {
        const data = getWorkoutData(week, day);
        if (data.completed) totalWorkouts++;
        if (data.sleepQuality) {
          avgSleep += data.sleepQuality;
          sleepCount++;
        }
        if (data.energyLevel) {
          avgEnergy += data.energyLevel;
          energyCount++;
        }
        if (data.pushups) pushupProgress.push(data.pushups);
        if (data.plankHold) plankProgress.push(data.plankHold);
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
  const calculateOverallProgress = () => {
    let totalWorkouts = 0;
    let completedWorkouts = 0;

    for (let week = 1; week <= 12; week++) {
      const weekData = programStructure[week];
      weekData.workouts.forEach((_: string, day: number) => {
        totalWorkouts++;
        const data = getWorkoutData(week, day);
        if (data.completed) completedWorkouts++;
      });
    }

    return (completedWorkouts / totalWorkouts) * 100;
  };

  const handleDayClick = (week: number, day: number, workout: string) => {
    setSelectedDay({ week, day, workout });
    setEditingDay(null);
  };

  const handleEdit = () => {
    if (selectedDay) {
      setEditingDay(`${selectedDay.week}-${selectedDay.day}`);
    }
  };

  const handleSave = (data: any) => {
    if (selectedDay) {
      saveWorkoutData(selectedDay.week, selectedDay.day, data);
      setEditingDay(null);
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

  return (
    <div className="min-h-screen responsive-padding">
      <div className="container-custom">
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
            workoutData={workoutData}
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
                  dayData={getWorkoutData(selectedDay.week, selectedDay.day)}
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
                dayData={getWorkoutData(selectedDay.week, selectedDay.day)}
                onClose={handleClose}
                onEdit={handleEdit}
              />
            )}
          </div>
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

export default OlympicWorkoutCalendar;
