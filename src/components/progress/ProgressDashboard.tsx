import React, { useMemo } from 'react';
import { TrendingUp, Award, Calendar, Zap, Moon, Flame } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProgressDashboardProps {
  workoutData: any;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ workoutData }) => {
  // Calculate statistics from workout data
  const stats = useMemo(() => {
    const sessions = Object.values(workoutData).filter((session: any) => session.completed);

    const totalWorkouts = sessions.length;
    const totalWeeks = 12;
    const totalPossibleWorkouts = totalWeeks * 7;
    const completionRate = totalPossibleWorkouts > 0
      ? Math.round((totalWorkouts / totalPossibleWorkouts) * 100)
      : 0;

    let totalSleep = 0;
    let sleepCount = 0;
    let totalEnergy = 0;
    let energyCount = 0;
    let bestPushups = 0;
    let bestPlank = 0;

    sessions.forEach((session: any) => {
      if (session.sleepQuality > 0) {
        totalSleep += session.sleepQuality;
        sleepCount++;
      }
      if (session.energyLevel > 0) {
        totalEnergy += session.energyLevel;
        energyCount++;
      }
      if (session.pushups > bestPushups) bestPushups = session.pushups;
      if (session.plankHold > bestPlank) bestPlank = session.plankHold;
    });

    const avgSleep = sleepCount > 0 ? (totalSleep / sleepCount).toFixed(1) : '0';
    const avgEnergy = energyCount > 0 ? (totalEnergy / energyCount).toFixed(1) : '0';

    // Calculate weekly trends
    const weeklyData = [];
    for (let week = 1; week <= 12; week++) {
      let weekWorkouts = 0;
      let weekSleep = 0;
      let weekEnergy = 0;
      let weekSleepCount = 0;
      let weekEnergyCount = 0;

      for (let day = 0; day < 7; day++) {
        const key = `week-${week}-day-${day}`;
        const session = workoutData[key];
        if (session?.completed) {
          weekWorkouts++;
          if (session.sleepQuality > 0) {
            weekSleep += session.sleepQuality;
            weekSleepCount++;
          }
          if (session.energyLevel > 0) {
            weekEnergy += session.energyLevel;
            weekEnergyCount++;
          }
        }
      }

      weeklyData.push({
        week: `W${week}`,
        workouts: weekWorkouts,
        avgSleep: weekSleepCount > 0 ? Number((weekSleep / weekSleepCount).toFixed(1)) : 0,
        avgEnergy: weekEnergyCount > 0 ? Number((weekEnergy / weekEnergyCount).toFixed(1)) : 0,
      });
    }

    return {
      totalWorkouts,
      completionRate,
      avgSleep,
      avgEnergy,
      bestPushups,
      bestPlank,
      weeklyData,
    };
  }, [workoutData]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-strong p-3 rounded-lg border border-white/20">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Total Workouts"
          value={stats.totalWorkouts}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={<Moon className="w-6 h-6" />}
          label="Avg Sleep"
          value={`${stats.avgSleep}/10`}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          label="Avg Energy"
          value={`${stats.avgEnergy}/10`}
          color="from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Best Push-ups"
          value={stats.bestPushups}
          color="from-red-500 to-red-600"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Best Plank"
          value={`${stats.bestPlank}s`}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Workout Completion Trend */}
      <div className="glass-card-strong p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4 text-shadow">
          Weekly Workout Completion
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="week"
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="workouts"
              fill="url(#colorWorkouts)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F85C70" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#F6A85E" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep & Energy Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card-strong p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4 text-shadow flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-400" />
            Sleep Quality Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="week"
                stroke="rgba(255,255,255,0.7)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={[0, 10]}
                stroke="rgba(255,255,255,0.7)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avgSleep"
                stroke="#a78bfa"
                fill="url(#colorSleep)"
                name="Avg Sleep"
              />
              <defs>
                <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card-strong p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4 text-shadow flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Energy Level Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="week"
                stroke="rgba(255,255,255,0.7)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={[0, 10]}
                stroke="rgba(255,255,255,0.7)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avgEnergy"
                stroke="#fbbf24"
                fill="url(#colorEnergy)"
                name="Avg Energy"
              />
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="glass-card p-4 rounded-lg hover:scale-105 transition-transform">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
};

export default ProgressDashboard;
