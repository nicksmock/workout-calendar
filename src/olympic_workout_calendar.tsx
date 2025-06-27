import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Target, TrendingUp, Edit3, Save, X } from 'lucide-react';

const EditForm = ({ dayData, workout, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    completed: dayData.completed || false,
    sleepQuality: dayData.sleepQuality || '',
    energyLevel: dayData.energyLevel || '',
    notes: dayData.notes || '',
    pushups: dayData.pushups || '',
    plankHold: dayData.plankHold || '',
    weight: dayData.weight || '',
    reps: dayData.reps || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const data = {
      completed: formData.completed,
      sleepQuality: parseInt(formData.sleepQuality) || 0,
      energyLevel: parseInt(formData.energyLevel) || 0,
      notes: formData.notes,
      pushups: parseInt(formData.pushups) || 0,
      plankHold: parseInt(formData.plankHold) || 0,
      weight: formData.weight,
      reps: formData.reps
    };
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          checked={formData.completed}
          onChange={(e) => handleChange('completed', e.target.checked)}
          className="rounded"
        />
        <span style={{ color: '#f8f8f2' }}>Workout Completed</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#f8f8f2' }}>Sleep Quality (1-10)</label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={formData.sleepQuality}
            onChange={(e) => handleChange('sleepQuality', e.target.value)}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: '#44475a', border: '1px solid #6272a4', color: '#f8f8f2' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#f8f8f2' }}>Energy Level (1-10)</label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={formData.energyLevel}
            onChange={(e) => handleChange('energyLevel', e.target.value)}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: '#44475a', border: '1px solid #6272a4', color: '#f8f8f2' }}
          />
        </div>
      </div>

      {workout !== 'Rest' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#f8f8f2' }}>Push-ups Completed</label>
            <input 
              type="number" 
              value={formData.pushups}
              onChange={(e) => handleChange('pushups', e.target.value)}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: '#44475a', border: '1px solid #6272a4', color: '#f8f8f2' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#f8f8f2' }}>Plank Hold (seconds)</label>
            <input 
              type="number" 
              value={formData.plankHold}
              onChange={(e) => handleChange('plankHold', e.target.value)}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: '#44475a', border: '1px solid #6272a4', color: '#f8f8f2' }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#f8f8f2' }}>Weight Used</label>
          <input 
            type="text" 
            placeholder="e.g., 25lb KB"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: '#44475a', border: '1px solid #6272a4', color: '#f8f8f2' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#f8f8f2' }}>Reps/Sets</label>
          <input 
            type="text" 
            placeholder="e.g., 3x12"
            value={formData.reps}
            onChange={(e) => handleChange('reps', e.target.value)}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: '#44475a', border: '1px solid #6272a4', color: '#f8f8f2' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#f8f8f2' }}>Notes</label>
        <textarea 
          rows="3" 
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="How did you feel? Any modifications made?"
          style={{ backgroundColor: '#44475a', border: '1px solid #6272a4', color: '#f8f8f2' }}
        />
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={handleSave}
          className="flex items-center px-4 py-2 rounded hover:opacity-80 transition-all"
          style={{ backgroundColor: '#50fa7b', color: '#282a36' }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 rounded hover:opacity-80 transition-all"
          style={{ backgroundColor: '#6272a4', color: '#f8f8f2' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const OlympicWorkoutCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [workoutData, setWorkoutData] = useState({});
  const [editingDay, setEditingDay] = useState(null);

  // Workout program structure
  const programStructure = {
    // Phase 1: Foundation (Weeks 1-4)
    1: { phase: 'Foundation', workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
    2: { phase: 'Foundation', workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Rest', 'Rest'] },
    3: { phase: 'Foundation', workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
    4: { phase: 'Foundation', workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Assessment', 'Rest'] },
    
    // Phase 2: Building (Weeks 5-8) - Using Power & Strength + Metabolic Circuit
    5: { phase: 'Building', workouts: ['Power', 'Rest', 'Metabolic', 'Rest', 'Power', 'Recovery', 'Rest'] },
    6: { phase: 'Building', workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Recovery', 'Rest'] },
    7: { phase: 'Building', workouts: ['Power', 'Rest', 'Metabolic', 'Recovery', 'Power', 'Rest', 'Rest'] },
    8: { phase: 'Building', workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Assessment', 'Rest'] },
    
    // Phase 3: Athletic Performance (Weeks 9-12)
    9: { phase: 'Athletic', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
    10: { phase: 'Athletic', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
    11: { phase: 'Athletic', workouts: ['High', 'Moderate', 'Rest', 'High', 'Rest', 'Moderate', 'Rest'] },
    12: { phase: 'Athletic', workouts: ['High', 'Rest', 'Moderate', 'Rest', 'Assessment', 'Celebration', 'Rest'] }
  };

  const workoutDetails = {
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

  const getWorkoutKey = (week, day) => `week-${week}-day-${day}`;

  const saveWorkoutData = (week, day, data) => {
    const key = getWorkoutKey(week, day);
    setWorkoutData(prev => ({
      ...prev,
      [key]: { ...prev[key], ...data }
    }));
  };

  const getWorkoutData = (week, day) => {
    const key = getWorkoutKey(week, day);
    return workoutData[key] || {};
  };

  // Calculate stats for assessment weeks
  const calculateStats = (currentWeek) => {
    const weeks = currentWeek === 4 ? [1, 2, 3, 4] : 
                  currentWeek === 8 ? [1, 2, 3, 4, 5, 6, 7, 8] :
                  currentWeek === 12 ? Array.from({length: 12}, (_, i) => i + 1) : [];
    
    let totalWorkouts = 0;
    let avgSleep = 0;
    let avgEnergy = 0;
    let sleepCount = 0;
    let energyCount = 0;
    let pushupProgress = [];
    let plankProgress = [];

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
      avgSleep: sleepCount ? (avgSleep / sleepCount).toFixed(1) : 0,
      avgEnergy: energyCount ? (avgEnergy / energyCount).toFixed(1) : 0,
      bestPushups: Math.max(...pushupProgress, 0),
      bestPlank: Math.max(...plankProgress, 0),
      weeksCompleted: weeks.length
    };
  };

  const renderWeekView = () => {
    const weekData = programStructure[currentWeek];
    if (!weekData) return null;

    return (
      <div className="rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: '#44475a' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#f8f8f2' }}>Week {currentWeek}</h2>
            <p style={{ color: '#bd93f9' }}>Phase {weekData.phase}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              className="px-3 py-1 rounded hover:opacity-80 transition-all"
              style={{ backgroundColor: '#6272a4', color: '#f8f8f2' }}
              disabled={currentWeek === 1}
            >
              ←
            </button>
            <button 
              onClick={() => setCurrentWeek(Math.min(12, currentWeek + 1))}
              className="px-3 py-1 rounded hover:opacity-80 transition-all"
              style={{ backgroundColor: '#6272a4', color: '#f8f8f2' }}
              disabled={currentWeek === 12}
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((dayName, index) => {
            const workoutType = weekData.workouts[index];
            const workout = workoutDetails[workoutType];
            const dayData = getWorkoutData(currentWeek, index);
            const isCompleted = dayData.completed;

            return (
              <div 
                key={index}
                className="p-3 rounded-lg cursor-pointer transition-all hover:opacity-80"
                style={{ 
                  backgroundColor: workout.color,
                  border: isCompleted ? '2px solid #ffb86c' : 'none',
                  color: (workout.color === '#8be9fd' || workout.color === '#50fa7b' || workout.color === '#f1fa8c' || workout.color === '#ffb86c') ? '#282a36' : '#f8f8f2'
                }}
                onClick={() => setSelectedDay({ week: currentWeek, day: index, workout: workoutType })}
              >
                <div className="text-sm font-semibold">{dayName}</div>
                <div className="text-xs mt-1">{workout.name}</div>
                <div className="text-xs mt-1">{workout.duration}</div>
                {isCompleted && <div className="text-xs mt-1">✓ Done</div>}
              </div>
            );
          })}
        </div>

        {/* Assessment Week Stats */}
        {(currentWeek === 4 || currentWeek === 8 || currentWeek === 12) && (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#44475a' }}>
            <h3 className="font-bold mb-3 flex items-center" style={{ color: '#ffb86c' }}>
              <Trophy className="w-5 h-5 mr-2" />
              Assessment Week {currentWeek} - Your Progress Stats
            </h3>
            {(() => {
              const stats = calculateStats(currentWeek);
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg" style={{ color: '#ffb86c' }}>{stats.totalWorkouts}</div>
                    <div style={{ color: '#6272a4' }}>Workouts Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg" style={{ color: '#ffb86c' }}>{stats.avgSleep}/10</div>
                    <div style={{ color: '#6272a4' }}>Avg Sleep Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg" style={{ color: '#ffb86c' }}>{stats.avgEnergy}/10</div>
                    <div style={{ color: '#6272a4' }}>Avg Energy Level</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg" style={{ color: '#ffb86c' }}>{stats.bestPushups}</div>
                    <div style={{ color: '#6272a4' }}>Best Push-ups</div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  const renderDayDetail = () => {
    if (!selectedDay) return null;

    const { week, day, workout } = selectedDay;
    const workoutInfo = workoutDetails[workout];
    const dayData = getWorkoutData(week, day);
    const isEditing = editingDay === `${week}-${day}`;

    return (
      <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: '#44475a' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold" style={{ color: '#f8f8f2' }}>
              Week {week} - {dayNames[day]}
            </h3>
            <p style={{ color: '#bd93f9' }}>{workoutInfo.name}</p>
          </div>
          <button 
            onClick={() => setSelectedDay(null)}
            className="p-2 hover:opacity-80 rounded"
            style={{ backgroundColor: '#6272a4', color: '#f8f8f2' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-lg mb-4" style={{ 
          backgroundColor: workoutInfo.color,
          color: (workoutInfo.color === '#8be9fd' || workoutInfo.color === '#50fa7b' || workoutInfo.color === '#f1fa8c' || workoutInfo.color === '#ffb86c') ? '#282a36' : '#f8f8f2'
        }}>
          <div className="font-semibold mb-3">Today's Workout ({workoutInfo.duration})</div>
          
          <div className="mb-3">
            <div className="font-medium text-sm mb-1">🔥 Warm-up (3-5 min):</div>
            <ul className="text-xs space-y-1 ml-2">
              {workoutInfo.warmup.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <div className="font-medium text-sm mb-1">💪 Main Workout:</div>
            <ul className="text-xs space-y-1 ml-2">
              {workoutInfo.exercises.map((exercise, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>• {typeof exercise === 'string' ? exercise : exercise.name}</span>
                  {typeof exercise === 'object' && exercise.video && (
                    <a 
                      href={exercise.video} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-xs px-2 py-1 rounded hover:opacity-80 transition-all"
                      style={{ 
                        backgroundColor: (workoutInfo.color === '#8be9fd' || workoutInfo.color === '#50fa7b' || workoutInfo.color === '#f1fa8c' || workoutInfo.color === '#ffb86c') ? '#44475a' : 'rgba(255,255,255,0.2)',
                        color: '#f8f8f2'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      📺 Video
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-medium text-sm mb-1">🧘 Cool-down (3-5 min):</div>
            <ul className="text-xs space-y-1 ml-2">
              {workoutInfo.cooldown.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {isEditing ? (
          <EditForm 
            dayData={dayData} 
            workout={workout}
            onSave={(data) => {
              saveWorkoutData(week, day, data);
              setEditingDay(null);
            }}
            onCancel={() => setEditingDay(null)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold" style={{ color: '#f8f8f2' }}>Workout Log</h4>
              <button 
                onClick={() => setEditingDay(`${week}-${day}`)}
                className="flex items-center px-3 py-1 rounded hover:opacity-80 transition-all"
                style={{ backgroundColor: '#8be9fd', color: '#282a36' }}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium" style={{ color: '#f8f8f2' }}>Status:</span> 
                <span className={dayData.completed ? 'ml-2' : 'ml-2'} style={{ color: dayData.completed ? '#50fa7b' : '#6272a4' }}>
                  {dayData.completed ? '✓ Completed' : 'Not completed'}
                </span>
              </div>
              <div>
                <span className="font-medium" style={{ color: '#f8f8f2' }}>Sleep:</span> 
                <span className="ml-2" style={{ color: '#bd93f9' }}>{dayData.sleepQuality || 'Not recorded'}/10</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: '#f8f8f2' }}>Energy:</span> 
                <span className="ml-2" style={{ color: '#bd93f9' }}>{dayData.energyLevel || 'Not recorded'}/10</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: '#f8f8f2' }}>Weight:</span> 
                <span className="ml-2" style={{ color: '#bd93f9' }}>{dayData.weight || 'Not recorded'}</span>
              </div>
            </div>

            {workout !== 'Rest' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{ color: '#f8f8f2' }}>Push-ups:</span> 
                  <span className="ml-2" style={{ color: '#bd93f9' }}>{dayData.pushups || 'Not recorded'}</span>
                </div>
                <div>
                  <span className="font-medium" style={{ color: '#f8f8f2' }}>Plank Hold:</span> 
                  <span className="ml-2" style={{ color: '#bd93f9' }}>{dayData.plankHold || 'Not recorded'}s</span>
                </div>
              </div>
            )}

            {dayData.notes && (
              <div>
                <span className="font-medium block mb-1" style={{ color: '#f8f8f2' }}>Notes:</span>
                <p className="text-sm p-2 rounded" style={{ color: '#6272a4', backgroundColor: '#282a36' }}>{dayData.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#282a36' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center" style={{ color: '#f8f8f2' }}>
            <Trophy className="w-8 h-8 mr-3" style={{ color: '#ffb86c' }} />
            Olympic Home Workout Calendar
          </h1>
          <p style={{ color: '#6272a4' }}>Track your 12-week transformation journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderWeekView()}
          </div>
          <div className="lg:col-span-1">
            {selectedDay ? (
              renderDayDetail()
            ) : (
              <div className="rounded-lg shadow-lg p-6 text-center" style={{ backgroundColor: '#44475a' }}>
                <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#6272a4' }} />
                <p style={{ color: '#6272a4' }}>Select a day to view workout details and log your progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="mt-8 rounded-lg shadow-lg p-6" style={{ backgroundColor: '#44475a' }}>
          <h3 className="font-bold mb-4 flex items-center" style={{ color: '#f8f8f2' }}>
            <TrendingUp className="w-5 h-5 mr-2" style={{ color: '#8be9fd' }} />
            Overall Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {(() => {
              const stats = calculateStats(12); // Overall stats
              return (
                <>
                  <div>
                    <div className="font-bold text-2xl" style={{ color: '#8be9fd' }}>{stats.totalWorkouts}</div>
                    <div className="text-sm" style={{ color: '#6272a4' }}>Total Workouts</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl" style={{ color: '#50fa7b' }}>{stats.avgSleep}/10</div>
                    <div className="text-sm" style={{ color: '#6272a4' }}>Avg Sleep</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl" style={{ color: '#ffb86c' }}>{stats.avgEnergy}/10</div>
                    <div className="text-sm" style={{ color: '#6272a4' }}>Avg Energy</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl" style={{ color: '#bd93f9' }}>{currentWeek}/12</div>
                    <div className="text-sm" style={{ color: '#6272a4' }}>Weeks Done</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OlympicWorkoutCalendar;