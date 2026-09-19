import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  RotateCcw 
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { useHabits } from '../../context/HabitContext';
import { formatDateKey, parseDateKey, getTodayKey, formatFriendlyDate } from '../../utils/dateUtils';
import { getDayOverview } from '../../utils/streakUtils';

export const DateNavigator: React.FC = () => {
  const { selectedDate, setSelectedDate, habits } = useHabits();
  const todayKey = getTodayKey();
  const currentDate = parseDateKey(selectedDate);
  const isToday = selectedDate === todayKey;

  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const key = formatDateKey(d);
    const overview = getDayOverview(habits, key);
    return {
      date: d,
      key,
      dayName: format(d, 'EEE'),
      dayNum: format(d, 'd'),
      overview,
      isToday: key === todayKey,
      isSelected: key === selectedDate,
    };
  });

  const handlePrevDay = () => {
    setSelectedDate(formatDateKey(subDays(currentDate, 1)));
  };

  const handleNextDay = () => {
    setSelectedDate(formatDateKey(addDays(currentDate, 1)));
  };

  const handleResetToToday = () => {
    setSelectedDate(todayKey);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Previous Day"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {formatFriendlyDate(selectedDate)}
              </span>
            </div>

            <button
              onClick={handleNextDay}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next Day"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={handleResetToToday}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Back to Today</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {pastDays.map((item) => {
            const hasActivity = item.overview.totalDue > 0;
            const isAllCompleted = hasActivity && item.overview.completionRate === 100;
            const isPartiallyCompleted = hasActivity && item.overview.totalCompleted > 0 && !isAllCompleted;

            return (
              <button
                key={item.key}
                onClick={() => setSelectedDate(item.key)}
                className={`flex flex-col items-center justify-center min-w-[46px] sm:min-w-[52px] py-2 px-1.5 rounded-xl text-center transition-all ${
                  item.isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105 font-bold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold tracking-wider">
                  {item.dayName}
                </span>
                <span className="text-sm font-extrabold my-0.5">
                  {item.dayNum}
                </span>
                
                <div className="h-1.5 w-1.5 rounded-full mt-0.5 flex items-center justify-center">
                  {isAllCompleted ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ) : isPartiallyCompleted ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  ) : hasActivity ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
