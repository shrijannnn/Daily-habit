import React from 'react';
import { Modal } from '../common/Modal';
import { Habit } from '../../types/habit';
import { useHabits } from '../../context/HabitContext';
import { calculateHabitStreak } from '../../utils/streakUtils';
import { 
  formatDateKey, 
  isHabitDueOnDate, 
  formatFriendlyDate 
} from '../../utils/dateUtils';
import { subDays, eachDayOfInterval } from 'date-fns';
import { 
  Flame, 
  Trophy, 
  CheckCircle, 
  Percent, 
  Calendar, 
  Edit3, 
  Archive, 
  Trash2, 
  RotateCcw 
} from 'lucide-react';

interface HabitDetailModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (habit: Habit) => void;
}

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
  habit,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { toggleHabitDay, toggleArchiveHabit, deleteHabit } = useHabits();

  if (!habit) return null;

  const stats = calculateHabitStreak(habit);
  const today = new Date();
  
  // Past 90 days for mini calendar
  const last90Days = eachDayOfInterval({
    start: subDays(today, 89),
    end: today,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${habit.emoji} ${habit.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Habit Description */}
        {habit.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            {habit.description}
          </p>
        )}

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.currentStreak} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Best</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.longestStreak} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalCompletions} <span className="text-xs font-normal text-slate-400">checks</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-500 mb-1">
              <Percent className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">30-Day Rate</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.completionRateLast30Days}%
            </div>
          </div>
        </div>

        {/* 90-Day Activity Matrix */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Last 90 Days Consistency
            </h4>
            <span className="text-xs text-slate-400">Click any day to toggle check</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
              {last90Days.map((day) => {
                const dateStr = formatDateKey(day);
                const isCompleted = !!habit.logs[dateStr];
                const isDue = isHabitDueOnDate(habit, day);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => toggleHabitDay(habit.id, dateStr)}
                    title={`${dateStr} (${formatFriendlyDate(day)}): ${isCompleted ? 'Completed' : isDue ? 'Missed' : 'Not due'}`}
                    className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold transition-all hover:scale-125 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : isDue
                        ? 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                        : 'bg-slate-100 dark:bg-slate-800/40 opacity-40'
                    }`}
                  >
                    {isCompleted ? '✓' : ''}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
              <span>90 days ago</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> Done</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-sm inline-block"></span> Scheduled</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-sm inline-block"></span> Rest day</span>
              </div>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                toggleArchiveHabit(habit.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {habit.archived ? <RotateCcw className="w-4 h-4 text-amber-500" /> : <Archive className="w-4 h-4 text-amber-500" />}
              <span>{habit.archived ? 'Unarchive' : 'Archive'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
                  deleteHabit(habit.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(habit);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Habit</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
