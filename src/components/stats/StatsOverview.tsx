import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { useHabits } from '../../context/HabitContext';
import { useStreaks } from '../../hooks/useStreaks';
import { 
  Trophy, 
  Flame, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  Award,
  Zap
} from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { activeHabits } = useHabits();
  const { overallStats, bestHabit, bestHabitStats, weeklyData, allHabitStats } = useStreaks();

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-1">
            {data.dayName} ({data.dateStr})
          </div>
          <div className="text-emerald-400 font-extrabold text-sm">
            {data.rate}% Completed
          </div>
          <div className="text-slate-300 mt-0.5">
            {data.completed} of {data.total} habits finished
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Check-ins
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {overallStats.totalCompletionsAllTime}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Streaks
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {overallStats.activeStreaksCount}{' '}
              <span className="text-xs font-semibold text-slate-400">/ {overallStats.totalActiveHabits}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Best Record
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {overallStats.maxStreakAllTime}{' '}
              <span className="text-xs font-semibold text-slate-400">days</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              30-Day Avg Rate
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {overallStats.averageRate30Days}%
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Weekly Completion Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily completion rate over the last 7 days
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="dayName" 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} />
                <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.rate >= 80 ? '#10b981' : entry.rate >= 50 ? '#34d399' : '#94a3b8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-rose-950/40 rounded-3xl p-6 border border-amber-500/20 dark:border-amber-500/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-3">
              <Award className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Spotlight Habit</span>
            </div>

            {bestHabit && bestHabitStats ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{bestHabit.emoji}</span>
                  <div>
                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                      {bestHabit.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Most consistent habit
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Longest Run</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {bestHabitStats.longestStreak} <span className="text-xs font-normal">days</span>
                    </span>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Checks</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {bestHabitStats.totalCompletions}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Create habits and record completions to see your top performing habit!
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/40 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Consistency is the mother of mastery</span>
          </div>
        </div>

      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
          Habit Consistency Breakdown
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activeHabits.map((habit) => {
            const stats = allHabitStats.get(habit.id);
            if (!stats) return null;

            return (
              <div key={habit.id} className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="text-2xl">{habit.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {habit.name}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {stats.totalCompletions} total check-ins
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Streak</span>
                    <span className="text-sm font-black text-orange-500 flex items-center justify-center gap-0.5">
                      <Flame className="w-3.5 h-3.5" />
                      {stats.currentStreak}d
                    </span>
                  </div>

                  <div className="w-32 hidden sm:block">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>30-day rate</span>
                      <span className="text-slate-700 dark:text-slate-300">{stats.completionRateLast30Days}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.completionRateLast30Days}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center min-w-[50px]">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">All-Time</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {stats.completionRateAllTime}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
