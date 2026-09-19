import { describe, it, expect } from 'vitest';
import { 
  formatDateKey, 
  parseDateKey, 
  isHabitDueOnDate, 
  getPastNDaysKeys,
  getYearHeatmapGrid
} from '../utils/dateUtils';
import { Habit } from '../types/habit';

describe('Date Utilities', () => {
  it('formats and parses date keys consistently without timezone shifts', () => {
    const date = new Date(2026, 8, 19); // 2026-09-19
    const key = formatDateKey(date);
    expect(key).toBe('2026-09-19');

    const parsed = parseDateKey(key);
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(8);
    expect(parsed.getDate()).toBe(19);
  });

  it('evaluates habit due schedule correctly', () => {
    const dailyHabit: Pick<Habit, 'frequencyType' | 'frequencyDays' | 'createdAt'> = {
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: '2026-09-01'
    };

    expect(isHabitDueOnDate(dailyHabit, '2026-09-19')).toBe(true);
    // Before created date is false
    expect(isHabitDueOnDate(dailyHabit, '2026-08-30')).toBe(false);

    const weekendHabit: Pick<Habit, 'frequencyType' | 'frequencyDays' | 'createdAt'> = {
      frequencyType: 'specific_days',
      frequencyDays: [0, 6], // Sun, Sat
      createdAt: '2026-09-01'
    };

    // 2026-09-19 is Saturday
    expect(isHabitDueOnDate(weekendHabit, '2026-09-19')).toBe(true);
    // 2026-09-18 is Friday
    expect(isHabitDueOnDate(weekendHabit, '2026-09-18')).toBe(false);
  });

  it('generates year heatmap grid of 52+ weeks', () => {
    const grid = getYearHeatmapGrid(new Date(2026, 8, 19));
    expect(grid.weeks.length).toBeGreaterThanOrEqual(52);
    expect(grid.weeks[0].length).toBe(7);
  });

  it('generates past N days keys in chronological order', () => {
    const keys = getPastNDaysKeys(7, new Date(2026, 8, 19));
    expect(keys.length).toBe(7);
    expect(keys[6]).toBe('2026-09-19');
    expect(keys[0]).toBe('2026-09-13');
  });
});
