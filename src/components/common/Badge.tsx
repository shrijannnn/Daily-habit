import React from 'react';
import { HabitColor } from '../../types/habit';

interface BadgeProps {
  color?: HabitColor | 'slate' | 'amber';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const colorStyles: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200/60 dark:border-emerald-800/40' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200/60 dark:border-indigo-800/40' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200/60 dark:border-rose-800/40' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200/60 dark:border-amber-800/40' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200/60 dark:border-violet-800/40' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200/60 dark:border-cyan-800/40' },
  fuchsia: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-200/60 dark:border-fuchsia-800/40' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200/60 dark:border-sky-800/40' },
  slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
};

export const Badge: React.FC<BadgeProps> = ({
  color = 'emerald',
  children,
  size = 'sm',
  className = '',
}) => {
  const styles = colorStyles[color] || colorStyles.emerald;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
