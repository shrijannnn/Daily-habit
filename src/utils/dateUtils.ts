import { 
  format, 
  parseISO, 
  subDays, 
  isSameDay, 
  getDay, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  subWeeks,
  isValid 
} from 'date-fns';
import { Habit, Weekday } from '../types/habit';

export const DATE_FORMAT = 'yyyy-MM-dd';

export function formatDateKey(date: Date = new Date()): string {
  return format(date, DATE_FORMAT);
}

export function parseDateKey(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (isValid(date)) return date;
  }
  return parseISO(dateStr);
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function getYesterdayKey(): string {
  return formatDateKey(subDays(new Date(), 1));
}

export function isHabitDueOnDate(habit: Pick<Habit, 'frequencyType' | 'frequencyDays' | 'createdAt'>, date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? parseDateKey(date) : date;
  const targetDateStr = typeof date === 'string' ? date : formatDateKey(date);

  if (targetDateStr < habit.createdAt) {
    return false;
  }

  if (habit.frequencyType === 'daily') {
    return true;
  }

  const dayOfWeek = getDay(targetDate);
  return habit.frequencyDays.includes(dayOfWeek);
}

export function getPastNDaysKeys(n: number, endDate: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(formatDateKey(subDays(endDate, i)));
  }
  return dates;
}

export function formatFriendlyDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseDateKey(date) : date;
  const today = new Date();
  const yesterday = subDays(today, 1);

  if (isSameDay(d, today)) {
    return `Today, ${format(d, 'MMM d')}`;
  }
  if (isSameDay(d, yesterday)) {
    return `Yesterday, ${format(d, 'MMM d')}`;
  }
  return format(d, 'EEE, MMM d');
}

export const WEEK_DAYS: { dayIndex: Weekday; label: string; short: string; single: string }[] = [
  { dayIndex: 1, label: 'Monday', short: 'Mon', single: 'M' },
  { dayIndex: 2, label: 'Tuesday', short: 'Tue', single: 'T' },
  { dayIndex: 3, label: 'Wednesday', short: 'Wed', single: 'W' },
  { dayIndex: 4, label: 'Thursday', short: 'Thu', single: 'T' },
  { dayIndex: 5, label: 'Friday', short: 'Fri', single: 'F' },
  { dayIndex: 6, label: 'Saturday', short: 'Sat', single: 'S' },
  { dayIndex: 0, label: 'Sunday', short: 'Sun', single: 'S' },
];

export function getYearHeatmapGrid(endDate: Date = new Date(), startOnMonday: boolean = true) {
  const weekStartsOn = startOnMonday ? 1 : 0;
  const end = endOfWeek(endDate, { weekStartsOn });
  const start = startOfWeek(subWeeks(endDate, 52), { weekStartsOn });

  const allDays = eachDayOfInterval({ start, end });
  
  const weeks: { date: Date; dateStr: string; dayOfWeek: number }[][] = [];
  let currentWeek: { date: Date; dateStr: string; dayOfWeek: number }[] = [];

  allDays.forEach((day) => {
    currentWeek.push({
      date: day,
      dateStr: formatDateKey(day),
      dayOfWeek: getDay(day),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return { weeks, start, end };
}
