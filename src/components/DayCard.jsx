// DayCard.jsx
// WeekFlow
// Author: Andrei Ando

import React from 'react';
import TaskRow from './TaskRow';
import { isToday, isPast, dayName, dayShortLabel } from '../utils/weekUtils';

export default function DayCard({ date, tasks, onToggle, onDelete, onEdit, onAddForDay }) {
  const today = isToday(date);
  const past = isPast(date);
  const name = dayName(date);
  const label = dayShortLabel(date);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: today ? '1.5px solid #FFD60A' : '1px solid #F0F0F0',
      }}
    >
      {/* Day header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2"
        style={{ borderBottom: tasks.length > 0 ? '1px solid #F2F2F2' : 'none' }}
      >
        <div className="flex items-center gap-2">
          {/* Date bubble */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{
              backgroundColor: today ? '#FFD60A' : 'transparent',
              color: today ? '#000' : past ? '#C7C7CC' : '#000',
            }}
          >
            {date.getDate()}
          </div>

          <div>
            <div
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: today ? '#000' : past ? '#C7C7CC' : '#8E8E93', letterSpacing: '0.06em' }}
            >
              {name}
            </div>
          </div>
        </div>

        {/* Inline add button for this day */}
        <button
          onClick={() => onAddForDay(date)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity active:opacity-50"
          style={{ backgroundColor: '#F2F2F7', color: '#8E8E93' }}
          aria-label={`Add task to ${name}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="#8E8E93" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Tasks */}
      <div className="divide-y divide-gray-50">
        {tasks.length === 0 ? (
          today ? (
            <p className="px-4 py-3 text-sm" style={{ color: '#C7C7CC' }}>
              Nothing here yet. Tap + to add something.
            </p>
          ) : null
        ) : (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
