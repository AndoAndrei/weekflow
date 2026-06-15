// DayCard.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useContext } from 'react';
import TaskRow from './TaskRow';
import { DragContextValue } from './DragContext';
import { isToday, isPast, dayName, toDateKey } from '../utils/weekUtils';

export default function DayCard({ date, tasks, onToggle, onDelete, onEdit, onComment, onAddForDay }) {
  const today = isToday(date);
  const past = isPast(date);
  const name = dayName(date);
  const dateKey = toDateKey(date);
  const { startDrag, draggingId, dropTarget } = useContext(DragContextValue);

  // Is there a drop indicator in this card?
  const isDropTarget = dropTarget?.dateKey === dateKey;

  return (
    <div
      data-day-key={dateKey}
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: isDropTarget
          ? '0 0 0 2px #FFD60A, 0 2px 12px rgba(255,214,10,0.2)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        border: today ? '1.5px solid #FFD60A' : '1px solid #F0F0F0',
        transition: 'box-shadow 150ms ease',
      }}
    >
      {/* Day header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2"
        style={{ borderBottom: tasks.length > 0 ? '1px solid #F2F2F2' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{
              backgroundColor: today ? '#FFD60A' : 'transparent',
              color: today ? '#000' : past ? '#C7C7CC' : '#000',
            }}
          >
            {date.getDate()}
          </div>
          <div
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: today ? '#000' : past ? '#C7C7CC' : '#8E8E93', letterSpacing: '0.06em' }}
          >
            {name}
          </div>
        </div>

        <button
          onClick={() => onAddForDay(date)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity active:opacity-50"
          style={{ backgroundColor: '#F2F2F7' }}
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
          <>
            {/* Drop indicator for empty day */}
            {isDropTarget && (
              <div className="mx-4 my-2 h-0.5 rounded-full" style={{ backgroundColor: '#FFD60A' }} />
            )}
            {today && (
              <p className="px-4 py-3 text-sm" style={{ color: '#C7C7CC' }}>
                Nothing here yet. Tap + to add something.
              </p>
            )}
          </>
        ) : (
          tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              {/* Drop indicator above this task */}
              {isDropTarget && dropTarget.index === index && (
                <div className="mx-4 h-0.5 rounded-full" style={{ backgroundColor: '#FFD60A' }} />
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
              {/* Drop indicator after last task */}
              {isDropTarget && dropTarget.index === tasks.length && index === tasks.length - 1 && (
                <div className="mx-4 h-0.5 rounded-full" style={{ backgroundColor: '#FFD60A' }} />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}
