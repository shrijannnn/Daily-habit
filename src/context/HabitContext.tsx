import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Habit, 
  MilestoneCelebrationData, 
  AppSettings, 
  DayCompletionOverview 
} from '../types/habit';
import { 
  loadHabitsFromStorage, 
  saveHabitsToStorage, 
  DEFAULT_SETTINGS, 
  SETTINGS_STORAGE_KEY 
} from '../utils/storageUtils';
import { generateSeedHabits } from '../utils/seedData';
import { getTodayKey } from '../utils/dateUtils';
import { calculateHabitStreak, getDayOverview } from '../utils/streakUtils';
import { triggerMilestoneConfetti, playCheckSound } from '../utils/confetti';

interface HabitContextType {
  habits: Habit[];
  activeHabits: Habit[];
  archivedHabits: Habit[];
  selectedDate: string;
  setSelectedDate: (dateStr: string) => void;
  todayOverview: DayCompletionOverview;
  selectedDayOverview: DayCompletionOverview;
  addHabit: (data: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'order' | 'logs'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleArchiveHabit: (id: string) => void;
  toggleHabitDay: (id: string, dateStr?: string) => void;
  loadSeedData: () => void;
  clearAllData: () => void;
  importData: (newHabits: Habit[], newSettings?: Partial<AppSettings>) => void;
  celebrationData: MilestoneCelebrationData | null;
  dismissCelebration: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = loadHabitsFromStorage();
    if (stored.length > 0) return stored;
    const demo = generateSeedHabits();
    saveHabitsToStorage(demo);
    return demo;
  });

  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [celebrationData, setCelebrationData] = useState<MilestoneCelebrationData | null>(null);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    saveHabitsToStorage(habits);
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);

  const todayOverview = getDayOverview(habits, getTodayKey());
  const selectedDayOverview = getDayOverview(habits, selectedDate);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const addHabit = useCallback((data: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'order' | 'logs'>) => {
    const newHabit: Habit = {
      ...data,
      id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: getTodayKey(),
      archived: false,
      order: habits.length,
      logs: {},
    };
    setHabits((prev) => [newHabit, ...prev]);
  }, [habits.length]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleArchiveHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const willArchive = !h.archived;
          return {
            ...h,
            archived: willArchive,
            archivedAt: willArchive ? new Date().toISOString() : undefined,
          };
        }
        return h;
      })
    );
  }, []);

  const toggleHabitDay = useCallback((id: string, dateStr: string = selectedDate) => {
    setHabits((prevHabits) => {
      let triggeredCelebration: MilestoneCelebrationData | null = null;

      const updated = prevHabits.map((habit) => {
        if (habit.id !== id) return habit;

        const currentVal = !!habit.logs[dateStr];
        const newVal = !currentVal;

        const newLogs = { ...habit.logs };
        if (newVal) {
          newLogs[dateStr] = true;
        } else {
          delete newLogs[dateStr];
        }

        const updatedHabit = { ...habit, logs: newLogs };

        if (newVal) {
          if (settings.soundEnabled) {
            playCheckSound();
          }

          const stats = calculateHabitStreak(updatedHabit);
          const streak = stats.currentStreak;

          if (settings.celebrationsEnabled) {
            if (streak === 7 || streak === 30 || streak === 100 || streak === 365) {
              const tier = streak as 7 | 30 | 100 | 365;
              const titles = {
                7: '🔥 7-Day Flame Ignited!',
                30: '⚡ 30-Day Unstoppable Streak!',
                100: '👑 100-Day Legend Status!',
                365: '💎 365-Day Master of Habit!',
              };
              const descs = {
                7: `You've stayed consistent with "${habit.name}" for a solid week!`,
                30: `30 days of "${habit.name}" — you've officially formed a lifestyle!`,
                100: `Triple digits on "${habit.name}"! Pure dedication.`,
                365: `A whole year of excellence on "${habit.name}". Incredible!`,
              };

              triggeredCelebration = {
                habitId: habit.id,
                habitName: habit.name,
                habitEmoji: habit.emoji,
                streakCount: streak,
                milestoneType: tier,
                title: titles[tier],
                description: descs[tier],
              };

              triggerMilestoneConfetti(tier);
            }
          }
        }

        return updatedHabit;
      });

      if (triggeredCelebration) {
        setCelebrationData(triggeredCelebration);
      }

      return updated;
    });
  }, [selectedDate, settings.celebrationsEnabled, settings.soundEnabled]);

  const loadSeedData = useCallback(() => {
    const demo = generateSeedHabits();
    setHabits(demo);
    saveHabitsToStorage(demo);
  }, []);

  const clearAllData = useCallback(() => {
    setHabits([]);
    saveHabitsToStorage([]);
  }, []);

  const importData = useCallback((newHabits: Habit[], newSettings?: Partial<AppSettings>) => {
    setHabits(newHabits);
    saveHabitsToStorage(newHabits);
    if (newSettings) {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    }
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebrationData(null);
  }, []);

  return (
    <HabitContext.Provider
      value={{
        habits,
        activeHabits,
        archivedHabits,
        selectedDate,
        setSelectedDate,
        todayOverview,
        selectedDayOverview,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleArchiveHabit,
        toggleHabitDay,
        loadSeedData,
        clearAllData,
        importData,
        celebrationData,
        dismissCelebration,
        settings,
        updateSettings,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
