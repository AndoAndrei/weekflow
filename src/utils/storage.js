// storage.js
// WeekFlow
// Author: Andrei Ando

const TASKS_KEY = 'weekflow_tasks';
const LAST_OPEN_KEY = 'weekflow_last_open';

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
