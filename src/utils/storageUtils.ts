import { Habit, ExportData, AppSettings } from '../types/habit';

export const HABITS_STORAGE_KEY = 'habitpulse_habits_v1';
export const SETTINGS_STORAGE_KEY = 'habitpulse_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  soundEnabled: true,
  celebrationsEnabled: true,
};

/**
 * Safely load habits from localStorage with schema validation
 */
export function loadHabitsFromStorage(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Ensure all items conform to Habit shape
    return parsed.map((h: Partial<Habit>, idx: number) => ({
      id: h.id || `habit-${Date.now()}-${idx}`,
      name: h.name || 'Untitled Habit',
      description: h.description || '',
      emoji: h.emoji || '🎯',
      color: h.color || 'emerald',
      frequencyType: h.frequencyType || 'daily',
      frequencyDays: Array.isArray(h.frequencyDays) ? h.frequencyDays : [0, 1, 2, 3, 4, 5, 6],
      createdAt: h.createdAt || new Date().toISOString().split('T')[0],
      archived: !!h.archived,
      archivedAt: h.archivedAt,
      order: typeof h.order === 'number' ? h.order : idx,
      logs: typeof h.logs === 'object' && h.logs !== null ? h.logs : {},
    }));
  } catch (err) {
    console.error('Failed to parse habits from storage:', err);
    return [];
  }
}

/**
 * Save habits to localStorage
 */
export function saveHabitsToStorage(habits: Habit[]): void {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.error('Failed to save habits to storage:', err);
  }
}

/**
 * Export full backup as JSON
 */
export function exportDataAsJson(habits: Habit[], settings?: AppSettings): void {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    habits,
    settings,
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habitpulse_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validate and parse imported JSON string
 */
export function parseImportedJson(jsonString: string): { habits: Habit[]; settings?: Partial<AppSettings> } {
  const parsed = JSON.parse(jsonString);

  // Support both direct array of habits and full ExportData object
  let rawHabits: unknown[] = [];
  let settings: Partial<AppSettings> | undefined;

  if (Array.isArray(parsed)) {
    rawHabits = parsed;
  } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.habits)) {
    rawHabits = parsed.habits;
    settings = parsed.settings;
  } else {
    throw new Error('Invalid JSON format: Expected a habits list or a valid HabitPulse export object.');
  }

  const validHabits: Habit[] = rawHabits.map((h: any, idx: number) => {
    if (!h.name || typeof h.name !== 'string') {
      throw new Error(`Habit at index ${idx} is missing a valid name.`);
    }
    return {
      id: h.id || `habit-${Date.now()}-${idx}`,
      name: h.name.trim(),
      description: h.description || '',
      emoji: h.emoji || '🎯',
      color: ['emerald', 'indigo', 'rose', 'amber', 'violet', 'cyan', 'fuchsia', 'sky'].includes(h.color) ? h.color : 'emerald',
      frequencyType: h.frequencyType === 'specific_days' ? 'specific_days' : 'daily',
      frequencyDays: Array.isArray(h.frequencyDays) ? h.frequencyDays : [0, 1, 2, 3, 4, 5, 6],
      createdAt: h.createdAt || new Date().toISOString().split('T')[0],
      archived: !!h.archived,
      archivedAt: h.archivedAt,
      order: typeof h.order === 'number' ? h.order : idx,
      logs: typeof h.logs === 'object' && h.logs !== null ? h.logs : {},
    };
  });

  return { habits: validHabits, settings };
}
