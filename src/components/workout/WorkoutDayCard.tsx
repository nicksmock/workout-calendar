import React from 'react';
import { WorkoutCard } from '../ui/Card';

interface WorkoutDayCardProps {
  dayName: string;
  workoutName: string;
  duration: string;
  workoutType: string;
  isCompleted: boolean;
  color: string;
  onClick: () => void;
}

export const WorkoutDayCard: React.FC<WorkoutDayCardProps> = ({
  dayName,
  workoutName,
  duration,
  workoutType,
  isCompleted,
  color,
  onClick,
}) => {
  return (
    <div
      className="glass-card p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-medium active:scale-95"
      style={{
        backgroundColor: isCompleted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        borderLeft: isCompleted ? '4px solid #F6A85E' : '4px solid transparent',
      }}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
          {dayName}
        </div>
        <h3 className="text-base md:text-lg font-bold text-white text-shadow truncate">
          {workoutName}
        </h3>
        <div className="text-xs md:text-sm text-white/80">
          {duration}
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-secondary">Done</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDayCard;
