import React from 'react';
import { Trophy, TrendingUp, Target, Zap } from 'lucide-react';
import { StatCard } from '../ui/Card';

interface StatsDisplayProps {
  stats: {
    totalWorkouts: number;
    avgSleep: string;
    avgEnergy: string;
    bestPushups: number;
    bestPlank: number;
    weeksCompleted: number;
  };
  currentWeek: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, currentWeek }) => {
  return (
    <div className="glass-card p-6 md:p-8 rounded-xl mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gradient-primary">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white text-shadow">
            Assessment Week {currentWeek}
          </h3>
          <p className="text-sm text-white/80 mt-1">
            Your Progress Stats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={stats.totalWorkouts}
          label="Workouts Completed"
          icon={<Target className="w-6 h-6 text-white" />}
        />
        <StatCard
          value={`${stats.avgSleep}/10`}
          label="Avg Sleep Quality"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          }
        />
        <StatCard
          value={`${stats.avgEnergy}/10`}
          label="Avg Energy Level"
          icon={<Zap className="w-6 h-6 text-white" />}
        />
        <StatCard
          value={stats.bestPushups}
          label="Best Push-ups"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
        />
      </div>

      {stats.bestPlank > 0 && (
        <div className="mt-4 p-4 glass-card rounded-lg text-center">
          <div className="text-3xl font-bold text-white text-shadow mb-1">
            {stats.bestPlank}s
          </div>
          <div className="text-sm text-white/80 uppercase tracking-wide">
            Best Plank Hold
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;
