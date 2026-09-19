import React, { useState, useMemo } from 'react';
import { Habit } from '../../types/habit';
import { HabitCard } from './HabitCard';
import { ProgressRing } from '../common/ProgressRing';
import { useHabits } from '../../context/HabitContext';
import { isHabitDueOnDate } from '../../utils/dateUtils';
import { Sparkles, Plus, Search } from 'lucide-react';

interface HabitListProps {
  onOpenNewHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onViewDetails: (habit: Habit) => void;
}

type FilterType = 'all' | 'due' | 'completed' | 'pending' | 'archived';

export const HabitList: React.FC<HabitListProps> = ({
  onOpenNewHabit,
  onEditHabit,
  onViewDetails,
}) => {
  const { 
    habits, 
    activeHabits, 
    archivedHabits, 
    selectedDate, 
    selectedDayOverview,
    loadSeedData 
  } = useHabits();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const filteredHabits = useMemo(() => {
    let list = filterType === 'archived' ? archivedHabits : activeHabits;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((h) => h.name.toLowerCase().includes(q) || (h.description && h.description.toLowerCase().includes(q)));
    }

    if (filterType === 'due') {
      list = list.filter((h) => isHabitDueOnDate(h, selectedDate));
    } else if (filterType === 'completed') {
      list = list.filter((h) => !!h.logs[selectedDate]);
    } else if (filterType === 'pending') {
      list = list.filter((h) => isHabitDueOnDate(h, selectedDate) && !h.logs[selectedDate]);
    }

    return list;
  }, [activeHabits, archivedHabits, filterType, searchQuery, selectedDate]);

  const getMotivationalMessage = () => {
    const { totalDue, totalCompleted, completionRate } = selectedDayOverview;
    if (totalDue === 0) return "No habits scheduled for this day. Enjoy your rest or plan ahead!";
    if (completionRate === 100) return "🏆 Outstanding! You achieved a 100% perfect day! Keep that momentum going!";
    if (completionRate >= 66) return `🔥 Almost there! Only ${totalDue - totalCompleted} more ${totalDue - totalCompleted === 1 ? 'habit' : 'habits'} to close your daily ring!`;
    if (completionRate >= 33) return "⚡ Great start! Focus on one small habit at a time.";
    return "🌅 Ready to take on the day? Check off your first habit!";
  };

  return (
    <div className="space-y-6">
      
      {/* Top Daily Progress Banner Card */}
      {activeHabits.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40 rounded-3xl p-6 border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <ProgressRing
                percentage={selectedDayOverview.completionRate}
                size={84}
                strokeWidth={8}
                colorClass="text-emerald-500"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedDayOverview.completionRate}%
                  </span>
                </div>
              </ProgressRing>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Daily Progress
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    {selectedDayOverview.totalCompleted} of {selectedDayOverview.totalDue} Completed
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md">
                  {getMotivationalMessage()}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenNewHabit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Create New Habit</span>
            </button>

          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `All (${activeHabits.length})` },
            { id: 'pending', label: `Pending (${selectedDayOverview.totalDue - selectedDayOverview.totalCompleted})` },
            { id: 'completed', label: `Done (${selectedDayOverview.totalCompleted})` },
            { id: 'archived', label: `Archived (${archivedHabits.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as FilterType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            🌱
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
            Welcome to HabitPulse!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Small daily habits compound into remarkable lifelong results. Create your first habit or load the demo portfolio data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenNewHabit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create My First Habit</span>
            </button>
            <button
              onClick={loadSeedData}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm px-6 py-3 rounded-2xl transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Load Portfolio Demo Data</span>
            </button>
          </div>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            No habits match your selected filter or search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
            className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={onEditHabit}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};
