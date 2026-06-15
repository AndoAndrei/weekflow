// AddTaskSheet.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useState, useEffect, useRef } from 'react';
import { getWeekDays, toDateKey, todayKey, dayName } from '../utils/weekUtils';

export default function AddTaskSheet({ defaultDate, onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(defaultDate || todayKey());
  const inputRef = useRef(null);
  const weekDays = getWeekDays();

  useEffect(() => {
    // Autofocus after sheet animation
    const t = setTimeout(() => inputRef.current?.focus(), 320);
    return () => clearTimeout(t);
  }, []);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title, selectedDate);
    onClose();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  };

  const selectedDayName = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    const today = todayKey();
    if (selectedDate === today) return 'Today';
    return dayName(d);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end backdrop-enter"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={handleBackdrop}
    >
      <div
        className="w-full sheet-enter rounded-t-3xl px-5 pt-5 pb-10"
        style={{
          backgroundColor: '#FFFDF7',
          paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
          maxWidth: 680,
          margin: '0 auto',
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: '#C7C7CC' }} />

        <div className="mb-1">
          <h2 className="text-xl font-bold mb-0.5">New Task</h2>
          <p className="text-sm" style={{ color: '#8E8E93' }}>
            Adding to {selectedDayName()}
          </p>
        </div>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKey}
          placeholder="What needs to get done?"
          className="w-full mt-4 mb-4 px-4 py-3.5 rounded-xl text-base outline-none"
          style={{
            backgroundColor: '#F2F2F7',
            color: '#000',
            fontSize: 17,
          }}
        />

        {/* Day picker */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: 'none' }}>
          {weekDays.map((d) => {
            const key = toDateKey(d);
            const selected = key === selectedDate;
            return (
              <button
                key={key}
                onClick={() => setSelectedDate(key)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: selected ? '#FFD60A' : '#F2F2F7',
                  color: selected ? '#000' : '#8E8E93',
                }}
              >
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </button>
            );
          })}
        </div>

        {/* Add button */}
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full py-4 rounded-2xl text-base font-semibold transition-opacity"
          style={{
            backgroundColor: '#FFD60A',
            color: '#000',
            opacity: title.trim() ? 1 : 0.4,
          }}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
