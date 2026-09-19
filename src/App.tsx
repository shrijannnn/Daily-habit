import React, { useState, useEffect } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { DateNavigator } from './components/layout/DateNavigator';
import { HabitList } from './components/habit/HabitList';
import { HeatmapGrid } from './components/heatmap/HeatmapGrid';
import { StatsOverview } from './components/stats/StatsOverview';
import { HabitFormModal } from './components/habit/HabitFormModal';
import { HabitDetailModal } from './components/habit/HabitDetailModal';
import { DataBackupModal } from './components/layout/DataBackupModal';
import { MilestoneCelebration } from './components/celebration/MilestoneCelebration';
import { Habit } from './types/habit';

const HabitAppContent: React.FC = () => {
  const { addHabit, updateHabit } = useHabits();
  
  const [activeTab, setActiveTab] = useState<'today' | 'heatmap' | 'stats'>('today');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingHabit, setViewingHabit] = useState<Habit | null>(null);
  const [backupModalOpen, setBackupModalOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingHabit(null);
        setFormModalOpen(true);
      } else if (e.key === '1') {
        setActiveTab('today');
      } else if (e.key === '2') {
        setActiveTab('heatmap');
      } else if (e.key === '3') {
        setActiveTab('stats');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNewHabit = () => {
    setEditingHabit(null);
    setFormModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormModalOpen(true);
  };

  const handleViewDetails = (habit: Habit) => {
    setViewingHabit(habit);
    setDetailModalOpen(true);
  };

  const handleFormSubmit = (data: {
    name: string;
    description: string;
    emoji: string;
    color: any;
    frequencyType: any;
    frequencyDays: number[];
  }) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewHabit={handleOpenNewHabit}
        onOpenDataBackup={() => setBackupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'today' && (
          <div className="space-y-4 animate-fade-in">
            <DateNavigator />
            <HabitList
              onOpenNewHabit={handleOpenNewHabit}
              onEditHabit={handleEditHabit}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="animate-fade-in">
            <HeatmapGrid />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="animate-fade-in">
            <StatsOverview />
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <HabitFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleFormSubmit}
        initialHabit={editingHabit}
      />

      <HabitDetailModal
        habit={viewingHabit}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setViewingHabit(null);
        }}
        onEdit={(habit) => {
          setDetailModalOpen(false);
          handleEditHabit(habit);
        }}
      />

      <DataBackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
      />

      {/* Floating Milestone Celebration Toast */}
      <MilestoneCelebration />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">HabitPulse</span>
            <span>—</span>
            <span>Built for peak consistency & personal mastery</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] hidden md:inline">
              Shortcuts: <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">N</kbd> New Habit • <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">1</kbd> Today • <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">2</kbd> Heatmap • <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">3</kbd> Stats
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HabitProvider>
        <HabitAppContent />
      </HabitProvider>
    </ThemeProvider>
  );
};

export default App;
