import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-white">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface CircularProgressProps {
  value: number; // 0-100
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  showValue = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F85C70" />
            <stop offset="100%" stopColor="#F6A85E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        {showValue && (
          <span className="text-2xl font-bold text-white text-shadow">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-white text-center">
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
