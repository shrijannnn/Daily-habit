import { useMemo } from 'react';
import { Habit, HabitStreakStats } from '../types/habit';
import { 
  calculateHabitStreak, 
  getBestHabit, 
  getWeeklyChartData
} from '../utils/streakUtils';
import { useHabits } from '../context/HabitContext';
import { parseDateKey } from '../utils/dateUtils';

export function useStreaks(habit?: Habit) {
  const { activeHabits, selectedDate } = useHabits();

  const habitStats: HabitStreakStats | null = useMemo(() => {
    if (!habit) return null;
    return calculateHabitStreak(habit, parseDateKey(selectedDate));
  }, [habit, selectedDate]);

  const allHabitStats = useMemo(() => {
    const map = new Map<string, HabitStreakStats>();
    activeHabits.forEach((h) => {
      map.set(h.id, calculateHabitStreak(h));
    });
    return map;
  }, [activeHabits]);

  const bestHabitInfo = useMemo(() => getBestHabit(activeHabits), [activeHabits]);
  const weeklyData = useMemo(() => getWeeklyChartData(activeHabits), [activeHabits]);
  
  const overallStats = useMemo(() => {
    let totalCompletionsAllTime = 0;
    let activeStreaksCount = 0;
    let maxStreakAllTime = 0;

    allHabitStats.forEach((stats) => {
      totalCompletionsAllTime += stats.totalCompletions;
      if (stats.currentStreak > 0) activeStreaksCount++;
      if (stats.longestStreak > maxStreakAllTime) {
        maxStreakAllTime = stats.longestStreak;
      }
    });

    const averageRate30Days = activeHabits.length > 0
      ? Math.round(
          Array.from(allHabitStats.values()).reduce((acc, s) => acc + s.completionRateLast30Days, 0) /
          activeHabits.length
        )
      : 0;

    return {
      totalCompletionsAllTime,
      activeStreaksCount,
      maxStreakAllTime,
      averageRate30Days,
      totalActiveHabits: activeHabits.length,
    };
  }, [allHabitStats, activeHabits.length]);

  return {
    habitStats,
    allHabitStats,
    bestHabit: bestHabitInfo.habit,
    bestHabitStats: bestHabitInfo.stats,
    weeklyData,
    overallStats,
  };
}
