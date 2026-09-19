import { describe, it, expect } from 'vitest';
import { calculateHabitStreak, getDayOverview } from '../utils/streakUtils';
import { Habit } from '../types/habit';
import { subDays } from 'date-fns';
import { formatDateKey } from '../utils/dateUtils';

describe('Streak Calculation Engine', () => {
  const today = new Date();
  const todayStr = formatDateKey(today);
  const yesterdayStr = formatDateKey(subDays(today, 1));
  const twoDaysAgoStr = formatDateKey(subDays(today, 2));
  const threeDaysAgoStr = formatDateKey(subDays(today, 3));
  const fourDaysAgoStr = formatDateKey(subDays(today, 4));

  it('calculates 0 streak for brand new habit without logs', () => {
    const habit: Habit = {
      id: 'h1',
      name: 'Drink Water',
      emoji: '💧',
      color: 'cyan',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: todayStr,
      archived: false,
      order: 0,
      logs: {}
    };

    const stats = calculateHabitStreak(habit, today);
    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(0);
    expect(stats.totalCompletions).toBe(0);
    expect(stats.isCompletedToday).toBe(false);
    expect(stats.isDueToday).toBe(true);
  });

  it('calculates 1 day streak when checked in today', () => {
    const habit: Habit = {
      id: 'h2',
      name: 'Read Book',
      emoji: '📚',
      color: 'indigo',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: fourDaysAgoStr,
      archived: false,
      order: 0,
      logs: {
        [todayStr]: true
      }
    };

    const stats = calculateHabitStreak(habit, today);
    expect(stats.currentStreak).toBe(1);
    expect(stats.longestStreak).toBe(1);
    expect(stats.totalCompletions).toBe(1);
    expect(stats.isCompletedToday).toBe(true);
  });

  it('preserves active streak when yesterday is completed and today is not completed yet', () => {
    const habit: Habit = {
      id: 'h3',
      name: 'Morning Run',
      emoji: '🏃',
      color: 'emerald',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: fourDaysAgoStr,
      archived: false,
      order: 0,
      logs: {
        [threeDaysAgoStr]: true,
        [twoDaysAgoStr]: true,
        [yesterdayStr]: true,
      }
    };

    const stats = calculateHabitStreak(habit, today);
    expect(stats.currentStreak).toBe(3);
    expect(stats.longestStreak).toBe(3);
    expect(stats.totalCompletions).toBe(3);
    expect(stats.isCompletedToday).toBe(false);
  });

  it('increments streak when today is completed after previous streak', () => {
    const habit: Habit = {
      id: 'h4',
      name: 'Morning Run',
      emoji: '🏃',
      color: 'emerald',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: fourDaysAgoStr,
      archived: false,
      order: 0,
      logs: {
        [threeDaysAgoStr]: true,
        [twoDaysAgoStr]: true,
        [yesterdayStr]: true,
        [todayStr]: true,
      }
    };

    const stats = calculateHabitStreak(habit, today);
    expect(stats.currentStreak).toBe(4);
    expect(stats.longestStreak).toBe(4);
    expect(stats.totalCompletions).toBe(4);
    expect(stats.isCompletedToday).toBe(true);
  });

  it('calculates longest streak correctly across missed gap', () => {
    const habit: Habit = {
      id: 'h5',
      name: 'Meditation',
      emoji: '🧘',
      color: 'violet',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: formatDateKey(subDays(today, 10)),
      archived: false,
      order: 0,
      logs: {
        [formatDateKey(subDays(today, 10))]: true,
        [formatDateKey(subDays(today, 9))]: true,
        [formatDateKey(subDays(today, 8))]: true,
        [formatDateKey(subDays(today, 7))]: true,
        [yesterdayStr]: true,
        [todayStr]: true,
      }
    };

    const stats = calculateHabitStreak(habit, today);
    expect(stats.currentStreak).toBe(2);
    expect(stats.longestStreak).toBe(4);
    expect(stats.totalCompletions).toBe(6);
  });

  it('correctly calculates streaks for specific weekdays (e.g. MWF)', () => {
    const mondayStr = '2026-09-14';
    const wednesdayStr = '2026-09-16';
    const fridayStr = '2026-09-18';
    const sundayRef = new Date(2026, 8, 20);

    const mwfHabit: Habit = {
      id: 'h6',
      name: 'Gym Workout',
      emoji: '🏋️',
      color: 'rose',
      frequencyType: 'specific_days',
      frequencyDays: [1, 3, 5],
      createdAt: mondayStr,
      archived: false,
      order: 0,
      logs: {
        [mondayStr]: true,
        [wednesdayStr]: true,
        [fridayStr]: true,
      }
    };

    const stats = calculateHabitStreak(mwfHabit, sundayRef);
    expect(stats.currentStreak).toBe(3);
    expect(stats.longestStreak).toBe(3);
    expect(stats.totalCompletions).toBe(3);
    expect(stats.completionRateAllTime).toBe(100);
  });

  it('calculates day overview completion rates accurately', () => {
    const habits: Habit[] = [
      {
        id: 'h1',
        name: 'Habit 1',
        emoji: '1️⃣',
        color: 'emerald',
        frequencyType: 'daily',
        frequencyDays: [0, 1, 2, 3, 4, 5, 6],
        createdAt: todayStr,
        archived: false,
        order: 0,
        logs: { [todayStr]: true }
      },
      {
        id: 'h2',
        name: 'Habit 2',
        emoji: '2️⃣',
        color: 'indigo',
        frequencyType: 'daily',
        frequencyDays: [0, 1, 2, 3, 4, 5, 6],
        createdAt: todayStr,
        archived: false,
        order: 1,
        logs: {}
      }
    ];

    const overview = getDayOverview(habits, todayStr);
    expect(overview.totalDue).toBe(2);
    expect(overview.totalCompleted).toBe(1);
    expect(overview.completionRate).toBe(50);
    expect(overview.completedHabitIds).toEqual(['h1']);
  });
});
