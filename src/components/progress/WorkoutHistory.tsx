import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, CheckCircle, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { WORKOUT_DETAILS, DAY_NAMES } from '../../data/workoutProgram';

interface WorkoutHistoryProps {
  workoutData: any;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workoutData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'incomplete'>('all');

  // Get all workout sessions as an array
  const allSessions = useMemo(() => {
    const sessions: any[] = [];

    for (let week = 1; week <= 12; week++) {
      for (let day = 0; day < 7; day++) {
        const key = `week-${week}-day-${day}`;
        const session = workoutData[key];

        // Get workout type from program structure
        const workoutType = getWorkoutTypeForDay(week, day);
        const workoutInfo = WORKOUT_DETAILS[workoutType];

        if (session || workoutInfo) {
          sessions.push({
            week,
            day,
            dayName: DAY_NAMES[day],
            workoutType,
            workoutName: workoutInfo?.name || 'Unknown',
            completed: session?.completed || false,
            sleepQuality: session?.sleepQuality || 0,
            energyLevel: session?.energyLevel || 0,
            pushups: session?.pushups || 0,
            plankHold: session?.plankHold || 0,
            notes: session?.notes || '',
            key,
          });
        }
      }
    }

    return sessions;
  }, [workoutData]);

  // Filter and search sessions
  const filteredSessions = useMemo(() => {
    return allSessions.filter((session) => {
      // Filter by completion status
      if (filterCompleted === 'completed' && !session.completed) return false;
      if (filterCompleted === 'incomplete' && session.completed) return false;

      // Search by workout name or notes
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = session.workoutName.toLowerCase().includes(searchLower);
        const matchesNotes = session.notes.toLowerCase().includes(searchLower);
        const matchesWeek = `week ${session.week}`.includes(searchLower);
        const matchesDay = session.dayName.toLowerCase().includes(searchLower);

        if (!matchesName && !matchesNotes && !matchesWeek && !matchesDay) {
          return false;
        }
      }

      return true;
    });
  }, [allSessions, searchTerm, filterCompleted]);

  // Sort by week (most recent first)
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) => {
      if (a.week !== b.week) return b.week - a.week;
      return b.day - a.day;
    });
  }, [filteredSessions]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Workout History</h2>
          <p className="text-white/70 text-sm">
            {filteredSessions.length} of {allSessions.length} workouts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-card rounded-pill text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          <div className="flex gap-2">
            <FilterButton
              active={filterCompleted === 'all'}
              onClick={() => setFilterCompleted('all')}
              label="All"
            />
            <FilterButton
              active={filterCompleted === 'completed'}
              onClick={() => setFilterCompleted('completed')}
              label="Completed"
            />
            <FilterButton
              active={filterCompleted === 'incomplete'}
              onClick={() => setFilterCompleted('incomplete')}
              label="Planned"
            />
          </div>
        </div>
      </div>

      {/* Workout List */}
      {sortedSessions.length === 0 ? (
        <div className="glass-card-strong p-12 rounded-xl text-center">
          <Filter className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 text-lg">No workouts found</p>
          <p className="text-white/50 text-sm mt-2">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedSessions.map((session) => (
            <WorkoutCard key={session.key} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get workout type for a specific day
const getWorkoutTypeForDay = (week: number, day: number): string => {
  // This would normally come from PROGRAM_STRUCTURE, but we'll import it
  const programStructure: any = {
    1: { workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
    2: { workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Rest', 'Rest'] },
    3: { workouts: ['A', 'Rest', 'B', 'Rest', 'A', 'Rest', 'Rest'] },
    4: { workouts: ['B', 'Rest', 'A', 'Rest', 'B', 'Assessment', 'Rest'] },
    5: { workouts: ['Power', 'Rest', 'Metabolic', 'Rest', 'Power', 'Recovery', 'Rest'] },
    6: { workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Recovery', 'Rest'] },
    7: { workouts: ['Power', 'Rest', 'Metabolic', 'Recovery', 'Power', 'Rest', 'Rest'] },
    8: { workouts: ['Metabolic', 'Rest', 'Power', 'Rest', 'Metabolic', 'Assessment', 'Rest'] },
    9: { workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
    10: { workouts: ['High', 'Rest', 'Moderate', 'Rest', 'High', 'Moderate', 'Rest'] },
    11: { workouts: ['High', 'Moderate', 'Rest', 'High', 'Rest', 'Moderate', 'Rest'] },
    12: { workouts: ['High', 'Rest', 'Moderate', 'Rest', 'Assessment', 'Celebration', 'Rest'] }
  };

  return programStructure[week]?.workouts[day] || 'Rest';
};

// Workout Card Component
interface WorkoutCardProps {
  session: any;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ session }) => {
  return (
    <div
      className={`glass-card p-5 rounded-lg hover:bg-white/15 transition-all ${
        session.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Workout info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default">Week {session.week}</Badge>
            <Badge variant="default">{session.dayName}</Badge>
            {session.completed && (
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Completed</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-1">{session.workoutName}</h3>

          {/* Stats */}
          {session.completed && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {session.sleepQuality > 0 && (
                <Stat label="Sleep" value={`${session.sleepQuality}/10`} />
              )}
              {session.energyLevel > 0 && (
                <Stat label="Energy" value={`${session.energyLevel}/10`} />
              )}
              {session.pushups > 0 && (
                <Stat label="Push-ups" value={session.pushups} />
              )}
              {session.plankHold > 0 && (
                <Stat label="Plank" value={`${session.plankHold}s`} />
              )}
            </div>
          )}

          {/* Notes */}
          {session.notes && (
            <div className="mt-3 p-3 glass-card rounded-lg">
              <p className="text-white/80 text-sm italic">"{session.notes}"</p>
            </div>
          )}
        </div>

        {/* Right side - Workout type indicator */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: session.completed
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          }}
        >
          {session.workoutType === 'Rest' ? '💤' : '💪'}
        </div>
      </div>
    </div>
  );
};

// Small stat component
interface StatProps {
  label: string;
  value: string | number;
}

const Stat: React.FC<StatProps> = ({ label, value }) => {
  return (
    <div>
      <div className="text-white/60 text-xs">{label}</div>
      <div className="text-white font-semibold text-sm">{value}</div>
    </div>
  );
};

// Filter Button Component
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-pill text-sm font-medium transition-all ${
        active
          ? 'bg-gradient-primary text-white shadow-medium'
          : 'glass-card text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
};

export default WorkoutHistory;
