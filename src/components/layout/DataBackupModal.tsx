import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { useHabits } from '../../context/HabitContext';
import { exportDataAsJson, parseImportedJson } from '../../utils/storageUtils';
import { 
  Download, 
  Upload, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    habits, 
    settings, 
    updateSettings, 
    importData, 
    loadSeedData, 
    clearAllData 
  } = useHabits();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleExport = () => {
    exportDataAsJson(habits, settings);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = parseImportedJson(content);
        importData(result.habits, result.settings);
        setImportStatus({
          success: true,
          message: `Successfully imported ${result.habits.length} habits!`,
        });
      } catch (err: any) {
        setImportStatus({
          success: false,
          message: err?.message || 'Failed to parse JSON file.',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Management & Preferences"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        
        {/* Audio & Haptic Celebrations */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Audio & Celebrations
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Check-in Sound Effect
              </span>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Milestone Confetti Bursts
              </span>
            </div>
            <button
              onClick={() => updateSettings({ celebrationsEnabled: !settings.celebrationsEnabled })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.celebrationsEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

        {/* JSON Backup & Restore */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Backup & Restore
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              <span>Import JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                importStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {importStatus.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>

        {/* Demo Data & Reset */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Demo & Reset
          </h4>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                loadSeedData();
                setImportStatus({ success: true, message: 'Loaded portfolio seed data with streaks & 12M history!' });
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Load Portfolio Demo Data (Full Streaks & Heatmap)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all habits and history?')) {
                  clearAllData();
                  setImportStatus({ success: true, message: 'All data cleared successfully.' });
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset & Clear All Data</span>
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
