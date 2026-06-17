// storage.js
// WeekFlow
// Author: Andrei Ando

const TASKS_KEY = 'weekflow_tasks';
const LAST_OPEN_KEY = 'weekflow_last_open';
const BACKUP_META_KEY = 'weekflow_last_backup';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('WeekFlow: failed to save tasks', e);
  }
}

export function loadLastOpen() {
  return localStorage.getItem(LAST_OPEN_KEY) || null;
}

export function saveLastOpen(dateKey) {
  localStorage.setItem(LAST_OPEN_KEY, dateKey);
}

// --- Backup ---

export function getLastBackupMeta() {
  try {
    const raw = localStorage.getItem(BACKUP_META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLastBackupMeta(meta) {
  localStorage.setItem(BACKUP_META_KEY, JSON.stringify(meta));
}

/**
 * Triggers a JSON file download the user can save to iCloud / Files.
 * Returns the ISO timestamp of the backup.
 */
export function exportBackup(tasks) {
  const now = new Date();
  const timestamp = now.toISOString();
  const payload = {
    exportedAt: timestamp,
    version: 2,
    tasks,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // DD-MM-YYYY
  a.href = url;
  a.download = `weekflow-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const meta = { timestamp, taskCount: tasks.length };
  setLastBackupMeta(meta);
  return meta;
}

/**
 * Reads a JSON backup file chosen by the user.
 * Returns parsed tasks array or throws on invalid format.
 */
export async function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data.tasks)) throw new Error('Invalid backup format');
        resolve(data.tasks);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
