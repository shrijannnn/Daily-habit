import { subDays, isBefore, isAfter, eachDayOfInterval } from 'date-fns';
import { Habit, HabitStreakStats, DayCompletionOverview } from '../types/habit';
import { formatDateKey, parseDateKey, isHabitDueOnDate, getTodayKey } from './dateUtils';

export function calculateHabitStreak(
  habit: Habit,
  referenceDate: Date = new Date()
): HabitStreakStats {
  const refDateStr = formatDateKey(referenceDate);
  const createdDate = parseDateKey(habit.createdAt);
  const logs = habit.logs || {};

  if (isAfter(createdDate, referenceDate)) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionRateAllTime: 0,
      completionRateLast30Days: 0,
      completionRateLast7Days: 0,
      isCompletedToday: false,
      isDueToday: isHabitDueOnDate(habit, refDateStr),
    };
  }

  const allDays = eachDayOfInterval({
    start: createdDate,
    end: referenceDate,
  });

  const scheduledDays = allDays.filter((d) => isHabitDueOnDate(habit, d));

  let totalCompletions = 0;
  let longestStreak = 0;
  let currentRun = 0;
  let lastCompletedDate: string | undefined = undefined;

  scheduledDays.forEach((day) => {
    const key = formatDateKey(day);
    const isCompleted = !!logs[key];

    if (isCompleted) {
      totalCompletions++;
      currentRun++;
      lastCompletedDate = key;
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    } else {
      currentRun = 0;
    }
  });

  const isCompletedToday = !!logs[refDateStr];
  const isDueToday = isHabitDueOnDate(habit, refDateStr);

  let currentStreak = 0;
  const reversedScheduled = [...scheduledDays].reverse();

  if (reversedScheduled.length > 0) {
    const latestScheduled = reversedScheduled[0];
    const latestKey = formatDateKey(latestScheduled);

    if (latestKey === refDateStr) {
      if (isCompletedToday) {
        for (const day of reversedScheduled) {
          const key = formatDateKey(day);
          if (logs[key]) {
            currentStreak++;
          } else {
            break;
          }
        }
      } else {
        const prevScheduledDays = reversedScheduled.slice(1);
        for (const day of prevScheduledDays) {
          const key = formatDateKey(day);
          if (logs[key]) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    } else {
      for (const day of reversedScheduled) {
        const key = formatDateKey(day);
        if (logs[key]) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  const totalScheduled = scheduledDays.length;
  const completionRateAllTime = totalScheduled > 0 
    ? Math.round((totalCompletions / totalScheduled) * 100) 
    : 0;

  const last7DaysStart = subDays(referenceDate, 6);
  const actual7Start = isBefore(createdDate, last7DaysStart) ? last7DaysStart : createdDate;
  const scheduled7Days = eachDayOfInterval({ start: actual7Start, end: referenceDate })
    .filter(d => isHabitDueOnDate(habit, d));
  const completed7Days = scheduled7Days.filter(d => !!logs[formatDateKey(d)]).length;
  const completionRateLast7Days = scheduled7Days.length > 0
    ? Math.round((completed7Days / scheduled7Days.length) * 100)
    : 0;

  const last30DaysStart = subDays(referenceDate, 29);
  const actual30Start = isBefore(createdDate, last30DaysStart) ? last30DaysStart : createdDate;
  const scheduled30Days = eachDayOfInterval({ start: actual30Start, end: referenceDate })
    .filter(d => isHabitDueOnDate(habit, d));
  const completed30Days = scheduled30Days.filter(d => !!logs[formatDateKey(d)]).length;
  const completionRateLast30Days = scheduled30Days.length > 0
    ? Math.round((completed30Days / scheduled30Days.length) * 100)
    : 0;

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRateAllTime,
    completionRateLast30Days,
    completionRateLast7Days,
    isCompletedToday,
    isDueToday,
    lastCompletedDate,
  };
}

export function getDayOverview(
  habits: Habit[],
  dateStr: string = getTodayKey()
): DayCompletionOverview {
  const activeHabits = habits.filter((h) => !h.archived);
  const dueHabits = activeHabits.filter((h) => isHabitDueOnDate(h, dateStr));
  const completedHabits = dueHabits.filter((h) => !!h.logs[dateStr]);

  const totalDue = dueHabits.length;
  const totalCompleted = completedHabits.length;
  const completionRate = totalDue > 0 ? Math.round((totalCompleted / totalDue) * 100) : 0;

  return {
    dateStr,
    totalDue,
    totalCompleted,
    completionRate,
    completedHabitIds: completedHabits.map((h) => h.id),
  };
}

export function getWeeklyChartData(habits: Habit[], endDate: Date = new Date()) {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(endDate, i);
    const dateStr = formatDateKey(day);
    const overview = getDayOverview(habits, dateStr);
    
    result.push({
      dateStr,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()],
      completed: overview.totalCompleted,
      total: overview.totalDue,
      rate: overview.completionRate,
    });
  }
  return result;
}

export function getBestHabit(habits: Habit[]): { habit: Habit | null; stats: HabitStreakStats | null } {
  const activeHabits = habits.filter((h) => !h.archived);
  if (activeHabits.length === 0) return { habit: null, stats: null };

  let best: Habit | null = null;
  let bestStats: HabitStreakStats | null = null;

  activeHabits.forEach((habit) => {
    const stats = calculateHabitStreak(habit);
    if (!bestStats || stats.longestStreak > bestStats.longestStreak || 
       (stats.longestStreak === bestStats.longestStreak && stats.totalCompletions > bestStats.totalCompletions)) {
      best = habit;
      bestStats = stats;
    }
  });

  return { habit: best, stats: bestStats };
}
