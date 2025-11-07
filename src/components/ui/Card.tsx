import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'frosted';
  onClick?: () => void;
  hover?: boolean;
  completed?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  hover = false,
  completed = false,
}) => {
  const baseClasses = 'p-6 transition-all duration-300';

  const variantClasses = {
    default: 'glass-card',
    strong: 'glass-card-strong',
    frosted: 'frosted-glass',
  };

  const hoverClasses = hover ? 'hover:bg-white/20 hover:shadow-medium hover:scale-105 cursor-pointer active:scale-95' : '';
  const completedClasses = completed ? 'ring-2 ring-secondary ring-offset-2 ring-offset-transparent' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${completedClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface WorkoutCardProps {
  title: string;
  duration?: string;
  isCompleted?: boolean;
  workoutType?: string;
  color?: string;
  onClick?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  duration,
  isCompleted = false,
  workoutType,
  color,
  onClick,
}) => {
  return (
    <Card
      hover
      completed={isCompleted}
      onClick={onClick}
      className="workout-card"
    >
      <div className="flex flex-col gap-2">
        {workoutType && (
          <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
            {workoutType}
          </span>
        )}
        <h3 className="text-lg font-bold text-white text-shadow">
          {title}
        </h3>
        {duration && (
          <p className="text-sm text-white/80">
            {duration}
          </p>
        )}
        {isCompleted && (
          <div className="flex items-center gap-1 mt-2">
            <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-white">Completed</span>
          </div>
        )}
      </div>
    </Card>
  );
};

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <Card className="stat-card text-center">
      {icon && <div className="flex justify-center mb-3">{icon}</div>}
      <div className="stat-value text-shadow-strong">{value}</div>
      <div className="stat-label">{label}</div>
    </Card>
  );
};

export default Card;
