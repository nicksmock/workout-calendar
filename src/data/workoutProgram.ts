// Olympic Workout Calendar - 12 Week Program Data

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Program structure by week
export const PROGRAM_STRUCTURE: any = {
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

// Workout details for each workout type
export const WORKOUT_DETAILS: any = {
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
