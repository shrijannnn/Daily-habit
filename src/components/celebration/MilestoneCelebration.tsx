import React, { useEffect } from 'react';
import { useHabits } from '../../context/HabitContext';
import { Flame, X } from 'lucide-react';

export const MilestoneCelebration: React.FC = () => {
  const { celebrationData, dismissCelebration } = useHabits();

  useEffect(() => {
    if (celebrationData) {
      const timer = setTimeout(() => {
        dismissCelebration();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [celebrationData, dismissCelebration]);

  if (!celebrationData) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-scale-in">
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white rounded-3xl p-5 shadow-2xl border-2 border-amber-500/50 relative overflow-hidden">
        
        {/* Glow backdrop effect */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          
          {/* Flame / Trophy Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30 text-2xl animate-bounce-subtle">
            {celebrationData.habitEmoji}
          </div>

          {/* Text Details */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider mb-0.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Milestone Unlocked!</span>
            </div>

            <h4 className="font-extrabold text-base text-white leading-tight">
              {celebrationData.title}
            </h4>

            <p className="text-xs text-slate-300 mt-1">
              {celebrationData.description}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={dismissCelebration}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Dismiss celebration"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
