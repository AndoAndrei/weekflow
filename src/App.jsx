// App.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useState, useCallback, useEffect } from 'react';
import DayCard from './components/DayCard';
import AddTaskSheet from './components/AddTaskSheet';
import FAB from './components/FAB';
import DragContext from './components/DragContext';
import BackupSheet from './components/BackupSheet';
import UndoToast from './components/UndoToast';
import useTasks from './hooks/useTasks';
import { exportBackup, getLastBackupMeta } from './utils/storage';
import { getWeekDays, toDateKey, todayKey, weekRangeLabel } from './utils/weekUtils';

const weekDays = getWeekDays();

// Auto-backup: export silently if it has been more than 24 hours since last backup
// We don't auto-download every time (that would be annoying) — instead we prompt the user
// once per day with a banner nudge.
const BACKUP_NUDGE_KEY = 'weekflow_backup_nudge';

export default function App() {
  const {
    tasks, addTask, toggleTask, editTask, setComment,
    deleteTask, undoDelete, pendingDeletes,
    moveTask, restoreTasks, tasksForDay, forceRollover,
  } = useTasks();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDate, setSheetDate] = useState(todayKey());
  const [backupOpen, setBackupOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  // Check once on mount whether to show the backup nudge
  useEffect(() => {
    const lastNudge = localStorage.getItem(BACKUP_NUDGE_KEY);
    const today = todayKey();
    if (lastNudge === today) return; // already nudged today

    const meta = getLastBackupMeta();
    if (!meta) {
      // Never backed up and has tasks
      if (tasks.length > 0) setShowNudge(true);
      return;
    }
    const hoursSince = (Date.now() - new Date(meta.timestamp)) / 36e5;
    if (hoursSince > 24) setShowNudge(true);
  }, []);

  const dismissNudge = () => {
    localStorage.setItem(BACKUP_NUDGE_KEY, todayKey());
    setShowNudge(false);
  };

  const handleNudgeBackup = () => {
    dismissNudge();
    setBackupOpen(true);
  };

  const openAddSheet = useCallback((date) => {
    setSheetDate(date ? toDateKey(date) : todayKey());
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const handleAdd = useCallback((title, dateKey) => {
    addTask(title, dateKey);
  }, [addTask]);

  return (
    <DragContext onMoveTask={moveTask} weekDays={weekDays}>
      <div
        className="min-h-screen"
        style={{ backgroundColor: '#FFFDF7', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
      >
        {/* Sticky header */}
        <header
          className="sticky top-0 z-30 px-5"
          style={{
            backgroundColor: 'rgba(255,253,247,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            paddingTop: 'max(env(safe-area-inset-top), 12px)',
            borderBottom: '0.5px solid #E5E5EA',
          }}
        >
          <div className="max-w-2xl mx-auto pb-3 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight" style={{ letterSpacing: '-0.5px' }}>
                This Week
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#8E8E93' }}>
                {weekRangeLabel()}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-0.5">
              {/* Backup icon */}
              <button
                onClick={() => setBackupOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center relative"
                style={{ backgroundColor: '#F2F2F7' }}
                aria-label="Backup"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 10v2.5a1 1 0 001 1h9a1 1 0 001-1V10" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 2.5v7M5.5 7L8 9.5 10.5 7" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* Red dot if never backed up */}
                {!getLastBackupMeta() && tasks.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#FF3B30' }} />
                )}
              </button>
            </div>
          </div>

          {/* Backup nudge banner */}
          {showNudge && (
            <div
              className="max-w-2xl mx-auto mb-3 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3"
              style={{ backgroundColor: '#FFF3B0', border: '1px solid #FFD60A' }}
            >
              <p className="text-sm font-medium" style={{ color: '#7A6000' }}>
                Back up your tasks to avoid data loss
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={dismissNudge} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#8E8E93', backgroundColor: 'rgba(0,0,0,0.05)' }}>
                  Later
                </button>
                <button onClick={handleNudgeBackup} className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ backgroundColor: '#FFD60A', color: '#000' }}>
                  Back up
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Day cards */}
        <main className="max-w-2xl mx-auto px-4 py-4 pb-28 flex flex-col gap-3">
          {weekDays.map((date) => {
            const key = toDateKey(date);
            return (
              <DayCard
                key={key}
                date={date}
                tasks={tasksForDay(key)}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onComment={setComment}
                onAddForDay={openAddSheet}
              />
            );
          })}
          <p className="text-center text-xs pt-2 pb-4" style={{ color: '#C7C7CC' }}>
            WeekFlow · Tasks stay on device only
          </p>
        </main>

        <FAB onClick={() => openAddSheet(null)} />

        {sheetOpen && (
          <AddTaskSheet
            defaultDate={sheetDate}
            onAdd={handleAdd}
            onClose={closeSheet}
          />
        )}

        {backupOpen && (
          <BackupSheet
            tasks={tasks}
            onRestore={(imported) => { restoreTasks(imported); setBackupOpen(false); }}
            onClose={() => setBackupOpen(false)}
          />
        )}

        <UndoToast pendingDeletes={pendingDeletes} onUndo={undoDelete} />
      </div>
    </DragContext>
  );
}
