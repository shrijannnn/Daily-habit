import React, { useState, useMemo } from 'react';
import { useHabits } from '../../context/HabitContext';
import { getYearHeatmapGrid, formatFriendlyDate } from '../../utils/dateUtils';
import { isHabitDueOnDate } from '../../utils/dateUtils';
import { Flame, Filter, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const HeatmapGrid: React.FC = () => {
  const { activeHabits, habits } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    date: Date;
    completedCount: number;
    dueCount: number;
    rate: number;
    completedNames: string[];
    x: number;
    y: number;
  } | null>(null);

  const targetHabits = useMemo(() => {
    if (selectedHabitId === 'all') return activeHabits;
    return habits.filter((h) => h.id === selectedHabitId);
  }, [activeHabits, habits, selectedHabitId]);

  const { weeks } = useMemo(() => getYearHeatmapGrid(new Date(), true), []);

  const yearStats = useMemo(() => {
    let totalCompleted = 0;
    let activeDaysCount = 0;

    weeks.forEach((week) => {
      week.forEach((day) => {
        const dateStr = day.dateStr;
        const dueHabits = targetHabits.filter((h) => isHabitDueOnDate(h, dateStr));
        const completedHabits = dueHabits.filter((h) => !!h.logs[dateStr]);

        if (completedHabits.length > 0) {
          totalCompleted += completedHabits.length;
          activeDaysCount++;
        }
      });
    });

    return { totalCompleted, activeDaysCount };
  }, [weeks, targetHabits]);

  const monthLabels = useMemo(() => {
    const labels: { monthName: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, colIdx) => {
      const firstDay = week[0].date;
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({
          monthName: format(firstDay, 'MMM'),
          colIndex: colIdx,
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [weeks]);

  const getCellColor = (completedCount: number, dueCount: number) => {
    if (dueCount === 0 || completedCount === 0) {
      return 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/40 dark:border-slate-800';
    }
    const rate = completedCount / dueCount;
    if (rate >= 0.95) return 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700/30';
    if (rate >= 0.70) return 'bg-emerald-500/85 dark:bg-emerald-600/90 border-emerald-600/30';
    if (rate >= 0.40) return 'bg-emerald-400/70 dark:bg-emerald-700/70 border-emerald-500/30';
    return 'bg-emerald-200/70 dark:bg-emerald-900/50 border-emerald-300/30';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              12-Month Consistency Heatmap
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {yearStats.totalCompleted} habit check-ins across {yearStats.activeDaysCount} active days in the past 12 months
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">⚡ All Active Habits Combined</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.emoji} {h.name} {h.archived ? '(Archived)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto pb-3 pt-2">
        <div className="min-w-[750px]">
          
          <div className="flex text-[10px] font-semibold text-slate-400 mb-1 pl-8">
            {weeks.map((_, colIdx) => {
              const label = monthLabels.find((m) => m.colIndex === colIdx);
              return (
                <div key={colIdx} className="w-3.5 sm:w-4 text-left">
                  {label ? label.monthName : ''}
                </div>
              );
            })}
          </div>

          <div className="flex items-start">
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-400 pr-2 h-[98px] sm:h-[112px] select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>

            <div className="flex gap-[3px] sm:gap-1">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px] sm:gap-1">
                  {week.map((day) => {
                    const dateStr = day.dateStr;
                    const dueHabits = targetHabits.filter((h) => isHabitDueOnDate(h, dateStr));
                    const completedHabits = dueHabits.filter((h) => !!h.logs[dateStr]);
                    const dueCount = dueHabits.length;
                    const completedCount = completedHabits.length;
                    const rate = dueCount > 0 ? Math.round((completedCount / dueCount) * 100) : 0;
                    const completedNames = completedHabits.map((h) => `${h.emoji} ${h.name}`);

                    return (
                      <div
                        key={dateStr}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            dateStr,
                            date: day.date,
                            completedCount,
                            dueCount,
                            rate,
                            completedNames,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] border transition-transform hover:scale-150 hover:z-20 cursor-pointer ${getCellColor(
                          completedCount,
                          dueCount
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {hoveredCell && (
        <div 
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 dark:bg-slate-800 text-white p-3 rounded-xl shadow-2xl border border-slate-700/80 text-xs w-64 animate-scale-in"
          style={{ left: `${hoveredCell.x}px`, top: `${hoveredCell.y - 8}px` }}
        >
          <div className="font-bold border-b border-slate-700 pb-1.5 mb-1.5 flex items-center justify-between">
            <span>{formatFriendlyDate(hoveredCell.date)}</span>
            <span className="text-emerald-400 font-extrabold">{hoveredCell.rate}%</span>
          </div>

          <div className="text-slate-300">
            {hoveredCell.dueCount === 0 ? (
              <span>No habits scheduled</span>
            ) : (
              <span>
                <strong className="text-white">{hoveredCell.completedCount}</strong> of{' '}
                <strong className="text-white">{hoveredCell.dueCount}</strong> habits completed
              </span>
            )}
          </div>

          {hoveredCell.completedNames.length > 0 && (
            <div className="mt-2 pt-1.5 border-t border-slate-700/60 space-y-0.5">
              {hoveredCell.completedNames.slice(0, 4).map((name, i) => (
                <div key={i} className="text-[11px] text-slate-300 truncate">
                  • {name}
                </div>
              ))}
              {hoveredCell.completedNames.length > 4 && (
                <div className="text-[10px] text-slate-400 font-medium">
                  + {hoveredCell.completedNames.length - 4} more
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Consistent daily activity compounds into unstoppable momentum</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-[3px] bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-200/70 dark:bg-emerald-900/50" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-400/70 dark:bg-emerald-700/70" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-500/85 dark:bg-emerald-600/90" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-600 dark:bg-emerald-500" />
          </div>
          <span>More</span>
        </div>
      </div>

    </div>
  );
};
