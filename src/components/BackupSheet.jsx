// BackupSheet.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useRef, useState } from 'react';
import { exportBackup, importBackup, getLastBackupMeta } from '../utils/storage';

export default function BackupSheet({ tasks, onRestore, onClose }) {
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const lastBackup = getLastBackupMeta();

  const handleExport = () => {
    exportBackup(tasks);
  };

  const handleImportClick = () => {
    setImportError(null);
    setImportSuccess(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError(null);
    try {
      const imported = await importBackup(file);
      const confirmed = window.confirm(
        `This will replace your current ${tasks.length} task(s) with ${imported.length} task(s) from the backup. Continue?`
      );
      if (confirmed) {
        onRestore(imported);
        setImportSuccess(true);
      }
    } catch (err) {
      setImportError('Invalid backup file. Please choose a WeekFlow backup JSON.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end backdrop-enter"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={handleBackdrop}
    >
      <div
        className="w-full sheet-enter rounded-t-3xl px-5 pt-5"
        style={{
          backgroundColor: '#FFFDF7',
          paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
          maxWidth: 680,
          margin: '0 auto',
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: '#C7C7CC' }} />

        <h2 className="text-xl font-bold mb-1">Backup & Restore</h2>
        <p className="text-sm mb-5" style={{ color: '#8E8E93' }}>
          Export your tasks as a JSON file you can save to iCloud Drive via the Files app.
        </p>

        {/* Last backup info */}
        <div
          className="rounded-2xl px-4 py-3 mb-4 flex items-center justify-between"
          style={{ backgroundColor: '#F2F2F7' }}
        >
          <div>
            <p className="text-xs font-medium" style={{ color: '#8E8E93' }}>Last backup</p>
            <p className="text-sm font-semibold mt-0.5">
              {lastBackup ? fmtDate(lastBackup.timestamp) : 'Never'}
            </p>
            {lastBackup && (
              <p className="text-xs mt-0.5" style={{ color: '#8E8E93' }}>
                {lastBackup.taskCount} task{lastBackup.taskCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: lastBackup ? '#34C759' : '#C7C7CC' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 10v4a1 1 0 001 1h10a1 1 0 001-1v-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 3v8M6 8l3 3 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Current task count */}
        <p className="text-xs mb-4 text-center" style={{ color: '#8E8E93' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} currently in WeekFlow
        </p>

        {/* Export button */}
        <button
          onClick={handleExport}
          className="w-full py-4 rounded-2xl text-base font-semibold mb-3"
          style={{ backgroundColor: '#FFD60A', color: '#000' }}
        >
          Export Backup
        </button>

        {/* Import button */}
        <button
          onClick={handleImportClick}
          disabled={importing}
          className="w-full py-4 rounded-2xl text-base font-semibold mb-3"
          style={{ backgroundColor: '#F2F2F7', color: importing ? '#C7C7CC' : '#000' }}
        >
          {importing ? 'Importing...' : 'Restore from Backup'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />

        {importError && (
          <p className="text-sm text-center mt-1" style={{ color: '#FF3B30' }}>{importError}</p>
        )}
        {importSuccess && (
          <p className="text-sm text-center mt-1" style={{ color: '#34C759' }}>
            Tasks restored successfully.
          </p>
        )}

        <p className="text-xs text-center mt-4" style={{ color: '#C7C7CC' }}>
          On iPhone: tap Export, then tap the share icon and choose Save to Files to store in iCloud Drive.
        </p>
      </div>
    </div>
  );
}
