import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Habit, HabitColor, FrequencyType } from '../../types/habit';
import { WEEK_DAYS } from '../../utils/dateUtils';
import { Check } from 'lucide-react';

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    emoji: string;
    color: HabitColor;
    frequencyType: FrequencyType;
    frequencyDays: number[];
  }) => void;
  initialHabit?: Habit | null;
}

const COLOR_PALETTE: { id: HabitColor; name: string; bgClass: string; ringClass: string }[] = [
  { id: 'emerald', name: 'Emerald', bgClass: 'bg-emerald-500', ringClass: 'ring-emerald-500' },
  { id: 'indigo', name: 'Indigo', bgClass: 'bg-indigo-500', ringClass: 'ring-indigo-500' },
  { id: 'rose', name: 'Rose', bgClass: 'bg-rose-500', ringClass: 'ring-rose-500' },
  { id: 'amber', name: 'Amber', bgClass: 'bg-amber-500', ringClass: 'ring-amber-500' },
  { id: 'violet', name: 'Violet', bgClass: 'bg-violet-500', ringClass: 'ring-violet-500' },
  { id: 'cyan', name: 'Cyan', bgClass: 'bg-cyan-500', ringClass: 'ring-cyan-500' },
  { id: 'fuchsia', name: 'Fuchsia', bgClass: 'bg-fuchsia-500', ringClass: 'ring-fuchsia-500' },
  { id: 'sky', name: 'Sky', bgClass: 'bg-sky-500', ringClass: 'ring-sky-500' },
];

const PRESET_EMOJIS = [
  '💧', '🏃', '📚', '🏋️', '💻', '🧘', '✍️', '🥗', '🧠', '💤', '🎯', '🥑', '⚡', '🌿', '🎨', '🎹'
];

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialHabit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [color, setColor] = useState<HabitColor>('emerald');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [frequencyDays, setFrequencyDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description || '');
      setEmoji(initialHabit.emoji || '🎯');
      setColor(initialHabit.color || 'emerald');
      setFrequencyType(initialHabit.frequencyType || 'daily');
      setFrequencyDays(initialHabit.frequencyDays || [0, 1, 2, 3, 4, 5, 6]);
    } else {
      setName('');
      setDescription('');
      setEmoji('🎯');
      setColor('emerald');
      setFrequencyType('daily');
      setFrequencyDays([0, 1, 2, 3, 4, 5, 6]);
    }
  }, [initialHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      emoji,
      color,
      frequencyType,
      frequencyDays: frequencyType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : frequencyDays,
    });
    onClose();
  };

  const toggleDay = (dayIndex: number) => {
    setFrequencyDays((prev) => {
      if (prev.includes(dayIndex)) {
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialHabit ? 'Edit Habit' : 'Create New Habit'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Habit Name *
          </label>
          <div className="flex items-center gap-2">
            <div className="w-12 h-11 flex items-center justify-center text-2xl bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0">
              {emoji}
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read 20 pages, Morning Run..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Optional Description / Motivation
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why is this habit important to you?"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Choose Icon
          </label>
          <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {PRESET_EMOJIS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setEmoji(item)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ${
                  emoji === item ? 'bg-white dark:bg-slate-600 shadow-sm scale-110 font-bold' : ''
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Color Accent
          </label>
          <div className="flex items-center gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setColor(c.id)}
                className={`w-7 h-7 rounded-full ${c.bgClass} flex items-center justify-center transition-all ${
                  color === c.id ? `ring-4 ring-offset-2 dark:ring-offset-slate-900 ${c.ringClass} scale-110` : 'opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              >
                {color === c.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Frequency Schedule
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            <button
              type="button"
              onClick={() => setFrequencyType('daily')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                frequencyType === 'daily'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Every Day (7 days)
            </button>
            <button
              type="button"
              onClick={() => setFrequencyType('specific_days')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                frequencyType === 'specific_days'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Specific Days of Week
            </button>
          </div>

          {frequencyType === 'specific_days' && (
            <div className="flex items-center justify-between gap-1 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 animate-fade-in">
              {WEEK_DAYS.map((day) => {
                const isSelected = frequencyDays.includes(day.dayIndex);
                return (
                  <button
                    type="button"
                    key={day.dayIndex}
                    onClick={() => toggleDay(day.dayIndex)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {day.single}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/25 transition-all transform active:scale-95"
          >
            {initialHabit ? 'Save Changes' : 'Create Habit'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
