// useTasks.js
// WeekFlow
// Author: Andrei Ando

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadTasks, saveTasks, loadLastOpen, saveLastOpen } from '../utils/storage';
import { toDateKey, todayKey, getWeekStart, isDifferentWeek } from '../utils/weekUtils';

function applyRollover(tasks) {
  const today = todayKey();
  const todayDate = new Date();
  const todayWeekStart = toDateKey(getWeekStart(todayDate));

  return tasks.map((task) => {
    if (task.completed) return task;

    const taskDate = task.assignedDate;

    // Task is in the past (but same week) -> move to today
    if (taskDate < today) {
      const taskWeekStart = toDateKey(getWeekStart(new Date(taskDate)));
      if (taskWeekStart === todayWeekStart) {
        return { ...task, assignedDate: today };
      }
      // Task is from a previous week -> move to Monday of current week
      return { ...task, assignedDate: todayWeekStart };
    }

    return task;
  });
}

export default function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const raw = loadTasks();
    const lastOpen = loadLastOpen();
    const today = todayKey();

    // Run rollover if this is a fresh day since last open
    if (lastOpen !== today) {
      const rolled = applyRollover(raw);
      saveTasks(rolled);
      saveLastOpen(today);
      return rolled;
    }
    return raw;
  });

  // Persist every change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Re-run rollover if the date changes while the app is open (e.g. left open past midnight)
  useEffect(() => {
    const interval = setInterval(() => {
      const today = todayKey();
      const lastOpen = loadLastOpen();
      if (lastOpen !== today) {
        setTasks((prev) => applyRollover(prev));
        saveLastOpen(today);
      }
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, []);

  const addTask = useCallback((title, assignedDate) => {
    const task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      assignedDate: assignedDate || todayKey(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const editTask = useCallback((id, newTitle) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle.trim() } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const tasksForDay = useCallback(
    (dateKey) =>
      tasks
        .filter((t) => t.assignedDate === dateKey)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [tasks]
  );

  const forceRollover = useCallback(() => {
    setTasks((prev) => applyRollover(prev));
    saveLastOpen(todayKey());
  }, []);

  return { tasks, addTask, toggleTask, editTask, deleteTask, tasksForDay, forceRollover };
}
