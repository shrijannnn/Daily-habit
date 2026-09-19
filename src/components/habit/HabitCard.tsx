import React, { useState } from 'react';
import { 
  Check, 
  Flame, 
  MoreVertical, 
  Archive, 
  Edit3, 
  Trash2, 
  BarChart2, 
  RotateCcw
} from 'lucide-react';
import { Habit } from '../../types/habit';
import { useHabits } from '../../context/HabitContext';
import { calculateHabitStreak } from '../../utils/streakUtils';
import { isHabitDueOnDate, parseDateKey, formatDateKey } from '../../utils/dateUtils';
import { subDays } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onViewDetails: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onEdit,
  onViewDetails,
}) => {
  const { 
    selectedDate, 
    toggleHabitDay, 
    toggleArchiveHabit, 
    deleteHabit 
  } = useHabits();

  const [menuOpen, setMenuOpen] = useState(false);
  const [animatingCheck, setAnimatingCheck] = useState(false);

  const stats = calculateHabitStreak(habit, parseDateKey(selectedDate));
  const isCompleted = !!habit.logs[selectedDate];
  const isDue = isHabitDueOnDate(habit, selectedDate);

  const handleToggle = () => {
    setAnimatingCheck(true);
    toggleHabitDay(habit.id, selectedDate);
    setTimeout(() => setAnimatingCheck(false), 300);
  };

  // 5-day mini history (past 4 days + selected day)
  const miniHistory = Array.from({ length: 5 }, (_, i) => {
    const d = subDays(parseDateKey(selectedDate), 4 - i);
    const key = formatDateKey(d);
    const completed = !!habit.logs[key];
    const due = isHabitDueOnDate(habit, key);
    return { key, completed, due };
  });

  // Streak badge tier colors
  const getFlameStyles = (streak: number) => {
    if (streak >= 100) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    if (streak >= 30) return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30';
    if (streak >= 7) return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    if (streak > 0) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    return 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-transparent';
  };

  const getFrequencyLabel = () => {
    if (habit.frequencyType === 'daily') return 'Every day';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (habit.frequencyDays.length === 5 && !habit.frequencyDays.includes(0) && !habit.frequencyDays.includes(6)) {
      return 'Weekdays';
    }
    if (habit.frequencyDays.length === 2 && habit.frequencyDays.includes(0) && habit.frequencyDays.includes(6)) {
      return 'Weekends';
    }
    return habit.frequencyDays.map((d) => dayNames[d]).join(', ');
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/15 dark:bg-emerald-950/10'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        
        {/* Left Section: Check button & Habit metadata */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Daily Check-in Button */}
          <button
            onClick={handleToggle}
            aria-label={isCompleted ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
            className={`relative flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 transform active:scale-90 select-none ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 rotate-0'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
            } ${animatingCheck ? 'animate-pop' : ''}`}
          >
            {isCompleted ? (
              <Check className="w-6 h-6 stroke-[3] transition-transform duration-200" />
            ) : (
              <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                {habit.emoji}
              </span>
            )}
          </button>

          {/* Habit Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 
                onClick={() => onViewDetails(habit)}
                className={`font-bold text-base text-slate-900 dark:text-white truncate cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${
                  isCompleted ? 'line-through decoration-slate-400/60 dark:decoration-slate-500 text-slate-700 dark:text-slate-300' : ''
                }`}
              >
                {habit.name}
              </h3>
              
              {!isDue && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  Not scheduled today
                </span>
              )}

              {habit.archived && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800">
                  Archived
                </span>
              )}
            </div>

            {habit.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {habit.description}
              </p>
            )}

            {/* Tags & Schedule */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                📅 {getFrequencyLabel()}
              </span>
              
              <span className="text-slate-300 dark:text-slate-700">•</span>
              
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {stats.totalCompletions} total {stats.totalCompletions === 1 ? 'check-in' : 'check-ins'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Streak flame badge & Actions Menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          {/* Streak Flame Pill */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${getFlameStyles(
              stats.currentStreak
            )}`}
            title={`Current streak: ${stats.currentStreak} days | Best streak: ${stats.longestStreak} days`}
          >
            <Flame className={`w-4 h-4 ${stats.currentStreak > 0 ? 'animate-flame' : ''}`} />
            <span>{stats.currentStreak}</span>
            <span className="text-[10px] font-normal opacity-80">d</span>
          </div>

          {/* Context Options Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Habit options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-30 animate-scale-in text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onViewDetails(habit);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium"
                  >
                    <BarChart2 className="w-4 h-4 text-emerald-500" />
                    <span>View Analytics</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(habit);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium"
                  >
                    <Edit3 className="w-4 h-4 text-indigo-500" />
                    <span>Edit Habit</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      toggleArchiveHabit(habit.id);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium"
                  >
                    {habit.archived ? (
                      <>
                        <RotateCcw className="w-4 h-4 text-amber-500" />
                        <span>Unarchive Habit</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 text-amber-500" />
                        <span>Archive Habit</span>
                      </>
                    )}
                  </button>

                  <hr className="my-1 border-slate-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (window.confirm(`Are you sure you want to permanently delete "${habit.name}"?`)) {
                        deleteHabit(habit.id);
                      }
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Habit</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Mini History Tracker */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Last 5 days
        </span>
        <div className="flex items-center gap-2">
          {miniHistory.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleHabitDay(habit.id, item.key)}
              title={`${item.key}: ${item.completed ? 'Completed' : item.due ? 'Missed / Pending' : 'Not scheduled'}`}
              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-125 ${
                item.completed
                  ? 'bg-emerald-500 text-white'
                  : item.due
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {item.completed ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
