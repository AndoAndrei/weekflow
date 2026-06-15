// useTasks.js
// WeekFlow
// Author: Andrei Ando

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadTasks, saveTasks, loadLastOpen, saveLastOpen } from '../utils/storage';
import { toDateKey, todayKey, getWeekStart } from '../utils/weekUtils';

function applyRollover(tasks) {
  const today = todayKey();
  const todayWeekStart = toDateKey(getWeekStart(new Date()));

  return tasks.map((task) => {
    if (task.completed) return task;
    const taskDate = task.assignedDate;
    if (taskDate < today) {
      const taskWeekStart = toDateKey(getWeekStart(new Date(taskDate)));
      if (taskWeekStart === todayWeekStart) return { ...task, assignedDate: today };
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
    if (lastOpen !== today) {
      const rolled = applyRollover(raw);
      saveTasks(rolled);
      saveLastOpen(today);
      return rolled;
    }
    return raw;
  });

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = todayKey();
      if (loadLastOpen() !== today) {
        setTasks((prev) => applyRollover(prev));
        saveLastOpen(today);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const addTask = useCallback((title, assignedDate) => {
    // Find max order for that day
    setTasks((prev) => {
      const dayTasks = prev.filter(t => t.assignedDate === (assignedDate || todayKey()));
      const maxOrder = dayTasks.reduce((m, t) => Math.max(m, t.order ?? 0), -1);
      const task = {
        id: uuidv4(),
        title: title.trim(),
        comment: '',
        completed: false,
        assignedDate: assignedDate || todayKey(),
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      };
      return [...prev, task];
    });
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const editTask = useCallback((id, newTitle) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, title: newTitle.trim() } : t));
  }, []);

  const setComment = useCallback((id, comment) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, comment } : t));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Move task to a new day and/or a new position index within that day
  const moveTask = useCallback((taskId, targetDateKey, targetIndex) => {
    setTasks((prev) => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;

      // Remove task from its current position
      const without = prev.filter(t => t.id !== taskId);

      // Get tasks for the target day (sorted by order), excluding the moving task
      const dayTasks = without
        .filter(t => t.assignedDate === targetDateKey)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Insert at target index
      dayTasks.splice(targetIndex, 0, { ...task, assignedDate: targetDateKey });

      // Re-assign order values for that day
      const reordered = dayTasks.map((t, i) => ({ ...t, order: i }));

      // Merge back
      const otherTasks = without.filter(t => t.assignedDate !== targetDateKey);
      return [...otherTasks, ...reordered];
    });
  }, []);

  const tasksForDay = useCallback(
    (dateKey) =>
      tasks
        .filter((t) => t.assignedDate === dateKey)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || new Date(a.createdAt) - new Date(b.createdAt)),
    [tasks]
  );

  const forceRollover = useCallback(() => {
    setTasks((prev) => applyRollover(prev));
    saveLastOpen(todayKey());
  }, []);

  return { tasks, addTask, toggleTask, editTask, setComment, deleteTask, moveTask, tasksForDay, forceRollover };
}
