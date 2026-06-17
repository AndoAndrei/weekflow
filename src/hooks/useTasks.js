// useTasks.js
// WeekFlow
// Author: Andrei Ando

import { useState, useEffect, useCallback, useRef } from 'react';
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
    setTasks((prev) => {
      const dayTasks = prev.filter(t => t.assignedDate === (assignedDate || todayKey()));
      const maxOrder = dayTasks.reduce((m, t) => Math.max(m, t.order ?? 0), -1);
      const task = {
        id: uuidv4(),
        title: title.trim(),
        comment: '',
        completed: false,
        completedAt: null,
        assignedDate: assignedDate || todayKey(),
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      };
      return [...prev, task];
    });
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const nowCompleted = !t.completed;
      return {
        ...t,
        completed: nowCompleted,
        // Record timestamp when completing; clear it when un-completing
        completedAt: nowCompleted ? new Date().toISOString() : null,
      };
    }));
  }, []);

  const editTask = useCallback((id, newTitle) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, title: newTitle.trim() } : t));
  }, []);

  const setComment = useCallback((id, comment) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, comment } : t));
  }, []);

  // ---- Soft delete with undo ----
  const [pendingDeletes, setPendingDeletes] = useState([]); // [{ id, task, expiresAt }]
  const deleteTimers = useRef({});

  const deleteTask = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // Remove from main list immediately so the UI feels instant
    setTasks((prev) => prev.filter((t) => t.id !== id));

    // Track as pending so it can be undone
    setPendingDeletes((prev) => [...prev, { id, task, expiresAt: Date.now() + 4000 }]);

    deleteTimers.current[id] = setTimeout(() => {
      setPendingDeletes((prev) => prev.filter((p) => p.id !== id));
      delete deleteTimers.current[id];
    }, 4000);
  }, [tasks]);

  const undoDelete = useCallback((id) => {
    clearTimeout(deleteTimers.current[id]);
    delete deleteTimers.current[id];

    setPendingDeletes((prev) => {
      const entry = prev.find((p) => p.id === id);
      if (entry) {
        setTasks((prevTasks) => [...prevTasks, entry.task]);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const moveTask = useCallback((taskId, targetDateKey, targetIndex) => {
    setTasks((prev) => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;
      const without = prev.filter(t => t.id !== taskId);
      const dayTasks = without
        .filter(t => t.assignedDate === targetDateKey)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      dayTasks.splice(targetIndex, 0, { ...task, assignedDate: targetDateKey });
      const reordered = dayTasks.map((t, i) => ({ ...t, order: i }));
      const otherTasks = without.filter(t => t.assignedDate !== targetDateKey);
      return [...otherTasks, ...reordered];
    });
  }, []);

  // Replace all tasks (used after import restore)
  const restoreTasks = useCallback((imported) => {
    setTasks(imported);
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

  return {
    tasks, addTask, toggleTask, editTask, setComment,
    deleteTask, undoDelete, pendingDeletes,
    moveTask, restoreTasks, tasksForDay, forceRollover,
  };
}
