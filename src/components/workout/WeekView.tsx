import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { WorkoutDayCard } from './WorkoutDayCard';

interface WeekViewProps {
  currentWeek: number;
  phase: string;
  workouts: any[];
  dayNames: string[];
  workoutDetails: any;
  workoutData: any;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onDayClick: (week: number, day: number, workout: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentWeek,
  phase,
  workouts,
  dayNames,
  workoutDetails,
  workoutData,
  onPreviousWeek,
  onNextWeek,
  onDayClick,
}) => {
  const getWorkoutData = (week: number, day: number) => {
    const key = `week-${week}-day-${day}`;
    return workoutData[key] || {};
  };

  return (
    <div className="glass-card-strong p-6 md:p-8 rounded-xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-strong">
              Week {currentWeek}
            </h2>
            <p className="text-sm md:text-base text-white/80 mt-1">
              Phase: {phase}
            </p>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousWeek}
            disabled={currentWeek === 1}
            className="!p-2 md:!p-3"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="hidden md:inline text-white/60 text-sm px-2">
            {currentWeek} / 12
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextWeek}
            disabled={currentWeek === 12}
            className="!p-2 md:!p-3"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        {workouts.map((workoutType, index) => {
          const workout = workoutDetails[workoutType];
          const dayData = getWorkoutData(currentWeek, index);
          const isCompleted = dayData.completed || false;

          return (
            <WorkoutDayCard
              key={index}
              dayName={dayNames[index]}
              workoutName={workout.name}
              duration={workout.duration}
              workoutType={workoutType}
              isCompleted={isCompleted}
              color={workout.color}
              onClick={() => onDayClick(currentWeek, index, workoutType)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
