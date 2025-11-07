import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'badge',
    success: 'badge bg-green-500/30 border border-green-400/50',
    warning: 'badge bg-yellow-500/30 border border-yellow-400/50',
    error: 'badge bg-red-500/30 border border-red-400/50',
    info: 'badge bg-blue-500/30 border border-blue-400/50',
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
