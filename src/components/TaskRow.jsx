// TaskRow.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useRef, useState, useCallback } from 'react';
import Checkbox from './Checkbox';

const SWIPE_THRESHOLD = 80;
const LONG_PRESS_MS = 500;

export default function TaskRow({ task, onToggle, onDelete, onEdit }) {
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const startX = useRef(null);
  const longPressTimer = useRef(null);
  const rowRef = useRef(null);

  // ---- Swipe to delete ----
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setSwiping(false);
  };

  const onTouchMove = (e) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) {
      setSwiping(true);
      setOffsetX(Math.max(dx, -140));
    }
  };

  const onTouchEnd = () => {
    if (offsetX < -SWIPE_THRESHOLD) {
      // Commit delete
      setOffsetX(-140);
      setTimeout(() => {
        setDeleted(true);
        setTimeout(() => onDelete(task.id), 150);
      }, 100);
    } else {
      setOffsetX(0);
    }
    setSwiping(false);
    startX.current = null;
  };

  // ---- Long press to edit ----
  const onPointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      const newTitle = window.prompt('Edit task', task.title);
      if (newTitle && newTitle.trim()) onEdit(task.id, newTitle.trim());
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    clearTimeout(longPressTimer.current);
  };

  if (deleted) return null;

  return (
    <div className="relative overflow-hidden">
      {/* Red delete background */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-end px-5 rounded-xl"
        style={{ backgroundColor: '#FF3B30', minWidth: 140 }}
      >
        <span className="text-white text-sm font-medium">Delete</span>
      </div>

      {/* Task row */}
      <div
        ref={rowRef}
        className="relative bg-white flex items-center gap-3 px-4 py-3 fade-in"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? 'none' : 'transform 200ms ease',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
      >
        <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
        <span
          className="flex-1 text-base leading-snug select-none"
          style={{
            color: task.completed ? '#8E8E93' : '#000',
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.5 : 1,
            transition: 'opacity 200ms ease',
          }}
        >
          {task.title}
        </span>
      </div>
    </div>
  );
}
