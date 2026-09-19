export type FrequencyType = 'daily' | 'specific_days';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

export type HabitColor = 
  | 'emerald' 
  | 'indigo' 
  | 'rose' 
  | 'amber' 
  | 'violet' 
  | 'cyan' 
  | 'fuchsia' 
  | 'sky';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  color: HabitColor;
  frequencyType: FrequencyType;
  frequencyDays: number[]; // Array of weekdays 0-6 (0=Sun, 1=Mon, ..., 6=Sat)
  createdAt: string; // ISO format 'yyyy-MM-dd'
  archived: boolean;
  archivedAt?: string;
  order: number;
  // History logs: key is 'yyyy-MM-dd', value is true if completed
  logs: Record<string, boolean>;
}

export interface HabitStreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRateAllTime: number; // 0 - 100
  completionRateLast30Days: number; // 0 - 100
  completionRateLast7Days: number; // 0 - 100
  isCompletedToday: boolean;
  isDueToday: boolean;
  lastCompletedDate?: string;
}

export interface MilestoneCelebrationData {
  habitId: string;
  habitName: string;
  habitEmoji: string;
  streakCount: number;
  milestoneType: 7 | 30 | 100 | 365;
  title: string;
  description: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  celebrationsEnabled: boolean;
}

export interface ExportData {
  version: number;
  exportedAt: string;
  habits: Habit[];
  settings?: Partial<AppSettings>;
}

export interface DayCompletionOverview {
  dateStr: string; // 'yyyy-MM-dd'
  totalDue: number;
  totalCompleted: number;
  completionRate: number; // 0 - 100
  completedHabitIds: string[];
}
