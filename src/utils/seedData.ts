import { Habit } from '../types/habit';
import { subDays } from 'date-fns';
import { formatDateKey } from './dateUtils';

/**
 * Generates rich, realistic demo habits with simulated historical completions
 * across the past 365 days.
 */
export function generateSeedHabits(referenceDate: Date = new Date()): Habit[] {
  // Helper to generate logs with a given completion probability and streak pattern
  const generateLogs = (
    daysBack: number,
    probability: number,
    streakLengthAtEnd: number = 0,
    allowedDaysOfWeek?: number[]
  ): Record<string, boolean> => {
    const logs: Record<string, boolean> = {};

    for (let i = daysBack; i >= 0; i--) {
      const d = subDays(referenceDate, i);
      const dayOfWeek = d.getDay();
      
      // If restricted to specific days
      if (allowedDaysOfWeek && !allowedDaysOfWeek.includes(dayOfWeek)) {
        continue;
      }

      const key = formatDateKey(d);

      // Enforce the end streak for the last `streakLengthAtEnd` days
      if (i < streakLengthAtEnd) {
        logs[key] = true;
      } else {
        // Random probabilistic completion with realistic clusters
        const pseudoRandom = Math.sin(i * 12.9898 + (allowedDaysOfWeek ? allowedDaysOfWeek[0] : 1)) * 43758.5453;
        const normalized = pseudoRandom - Math.floor(pseudoRandom);
        if (normalized < probability) {
          logs[key] = true;
        }
      }
    }

    return logs;
  };

  const day365Ago = formatDateKey(subDays(referenceDate, 365));
  const day180Ago = formatDateKey(subDays(referenceDate, 180));
  const day90Ago = formatDateKey(subDays(referenceDate, 90));

  return [
    {
      id: 'habit-seed-1',
      name: 'Morning Hydration (1L)',
      description: 'Drink a large glass of water right after waking up',
      emoji: '💧',
      color: 'cyan',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: day365Ago,
      archived: false,
      order: 0,
      // 99 days current streak -> ready to celebrate 100 days milestone!
      logs: generateLogs(365, 0.88, 99),
    },
    {
      id: 'habit-seed-2',
      name: 'Read 20 Pages',
      description: 'Non-fiction books, engineering blogs or literature',
      emoji: '📖',
      color: 'indigo',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: day365Ago,
      archived: false,
      order: 1,
      // 29 days current streak -> ready to hit 30 days celebration!
      logs: generateLogs(365, 0.82, 29),
    },
    {
      id: 'habit-seed-3',
      name: 'Strength & Mobility Training',
      description: 'Calisthenics, weights, and hip/shoulder mobility',
      emoji: '🏋️',
      color: 'rose',
      frequencyType: 'specific_days',
      frequencyDays: [1, 3, 5], // Mon, Wed, Fri
      createdAt: day180Ago,
      archived: false,
      order: 2,
      // 6 consecutive MWF workouts -> ready to hit 7th milestone!
      logs: generateLogs(180, 0.90, 6, [1, 3, 5]),
    },
    {
      id: 'habit-seed-4',
      name: 'Code Deep Work (90m)',
      description: 'Build open-source tools, study algorithms, or ship features',
      emoji: '💻',
      color: 'emerald',
      frequencyType: 'specific_days',
      frequencyDays: [1, 2, 3, 4, 5], // Weekdays
      createdAt: day365Ago,
      archived: false,
      order: 3,
      logs: generateLogs(365, 0.85, 14, [1, 2, 3, 4, 5]),
    },
    {
      id: 'habit-seed-5',
      name: 'Mindfulness Meditation',
      description: '10 minutes of box breathing and head-clearing stillness',
      emoji: '🧘',
      color: 'violet',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: day90Ago,
      archived: false,
      order: 4,
      logs: generateLogs(90, 0.72, 5),
    },
    {
      id: 'habit-seed-6',
      name: 'Evening Journal & Retrospective',
      description: '3 highlights, 1 lesson learned, and priority for tomorrow',
      emoji: '✍️',
      color: 'amber',
      frequencyType: 'daily',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: day180Ago,
      archived: false,
      order: 5,
      logs: generateLogs(180, 0.78, 12),
    },
  ];
}
