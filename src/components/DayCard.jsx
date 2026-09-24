// DayCard.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useContext } from 'react';
import TaskRow from './TaskRow';
import { DragContextValue } from './DragContext';
import { useTheme } from '../theme';
import { isToday, isPast, dayName, toDateKey } from '../utils/weekUtils';

export default function DayCard({ date, tasks, onToggle, onDelete, onEdit, onComment, onAddForDay }) {
  const today = isToday(date);
  const past = isPast(date);
  const name = dayName(date);
  const dateKey = toDateKey(date);
  const { startDrag, draggingId, dropTarget } = useContext(DragContextValue);
  const theme = useTheme();
  const isDropTarget = dropTarget?.dateKey === dateKey;

  return (
    <div
      data-day-key={dateKey}
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        boxShadow: isDropTarget
          ? `0 0 0 2px ${theme.accent}, 0 2px 12px rgba(255,214,10,0.2)`
          : '0 1px 4px rgba(0,0,0,0.06)',
        border: today ? `1.5px solid ${theme.accent}` : `1px solid ${theme.border}`,
        transition: 'box-shadow 150ms ease, background-color 300ms ease, border-color 300ms ease',
      }}
    >
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2"
        style={{ borderBottom: tasks.length > 0 ? `1px solid ${theme.separator}` : 'none' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: today ? theme.accent : 'transparent',
              color: today ? '#000' : past ? theme.textTertiary : theme.textPrimary,
            }}
          >
            {date.getDate()}
          </div>
          <div
            className="text-xs font-bold tracking-wide uppercase"
            style={{
              color: today ? theme.textPrimary : past ? theme.textTertiary : theme.textSecondary,
              letterSpacing: '0.06em',
            }}
          >
            {name}
          </div>
        </div>

        <button
          onClick={() => onAddForDay(date)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity active:opacity-50"
          style={{ backgroundColor: theme.surfaceAlt }}
          aria-label={`Add task to ${name}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke={theme.textSecondary} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div>
        {tasks.length === 0 ? (
          <>
            {isDropTarget && (
              <div className="mx-4 my-2 h-0.5 rounded-full" style={{ backgroundColor: theme.accent }} />
            )}
            {today && (
              <p className="px-4 py-3 text-sm" style={{ color: theme.textTertiary }}>
                Nothing here yet. Tap + to add something.
              </p>
            )}
          </>
        ) : (
          tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              {isDropTarget && dropTarget.index === index && (
                <div className="mx-4 h-0.5 rounded-full" style={{ backgroundColor: theme.accent }} />
              )}
              <TaskRow
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                onComment={onComment}
                onDragStart={startDrag}
                isDragging={draggingId === task.id}
              />
              {isDropTarget && dropTarget.index === tasks.length && index === tasks.length - 1 && (
                <div className="mx-4 h-0.5 rounded-full" style={{ backgroundColor: theme.accent }} />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}
