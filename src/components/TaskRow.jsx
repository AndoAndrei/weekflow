// TaskRow.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useRef, useState } from 'react';
import Checkbox from './Checkbox';
import { useTheme } from '../theme';

const SWIPE_THRESHOLD = 80;
const LONG_PRESS_MS = 600;
const DRAG_THRESHOLD = 8;
const SCROLL_CANCEL_THRESHOLD = 10;

export default function TaskRow({ task, onToggle, onDelete, onEdit, onComment, onDragStart, isDragging }) {
  const theme = useTheme();
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState(task.comment || '');
  const [editingComment, setEditingComment] = useState(false);
  const [dragLocked, setDragLocked] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const longPressTimer = useRef(null);
  const didSwipe = useRef(false);
  const didDrag = useRef(false);
  const didScroll = useRef(false);
  const rowRef = useRef(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    didSwipe.current = false;
    didDrag.current = false;
    didScroll.current = false;

    longPressTimer.current = setTimeout(() => {
      if (!didSwipe.current && !didScroll.current) {
        didDrag.current = true;
        setDragLocked(true);
        onDragStart(task.id, rowRef.current);
      }
    }, LONG_PRESS_MS);
  };

  const onTouchMove = (e) => {
    if (didDrag.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (Math.abs(dy) > SCROLL_CANCEL_THRESHOLD) {
      didScroll.current = true;
      clearTimeout(longPressTimer.current);
    }

    if (dx < -DRAG_THRESHOLD && Math.abs(dy) < SCROLL_CANCEL_THRESHOLD) {
      didSwipe.current = true;
      clearTimeout(longPressTimer.current);
      setSwiping(true);
      setOffsetX(Math.max(dx, -140));
    }
  };

  const onTouchEnd = () => {
    clearTimeout(longPressTimer.current);
    if (didDrag.current) {
      didDrag.current = false;
      setDragLocked(false);
      return;
    }
    if (swiping) {
      if (offsetX < -SWIPE_THRESHOLD) {
        setOffsetX(-140);
        setTimeout(() => { setDeleted(true); setTimeout(() => onDelete(task.id), 150); }, 100);
      } else {
        setOffsetX(0);
      }
      setSwiping(false);
    } else if (!didSwipe.current && !didScroll.current) {
      setExpanded(prev => !prev);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const saveComment = () => {
    setEditingComment(false);
    setExpanded(false);
    onComment(task.id, commentText);
  };

  if (deleted) return null;

  return (
    <div
      ref={rowRef}
      className="relative"
      style={{ opacity: isDragging ? 0.3 : 1, transition: 'opacity 150ms ease' }}
      data-task-id={task.id}
    >
      {/* Swipe delete background */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-end px-5"
        style={{ backgroundColor: theme.delete, minWidth: 140 }}
      >
        <span className="text-white text-sm font-medium">Delete</span>
      </div>

      {/* Main row */}
      <div
        className="relative"
        style={{
          backgroundColor: theme.surface,
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? 'none' : 'transform 200ms ease',
          touchAction: (dragLocked || isDragging) ? 'none' : 'pan-y',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Title row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Drag handle */}
          <div className="flex-shrink-0 flex flex-col gap-0.5 pr-1" style={{ touchAction: 'none' }}>
            {[0,1,2].map(i => (
              <div key={i} className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.dragHandle }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.dragHandle }} />
              </div>
            ))}
          </div>

          <div
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
          </div>

          <div className="flex-1 min-w-0">
            <span
              className="block text-base leading-snug select-none font-medium"
              style={{
                color: task.completed ? theme.textSecondary : theme.textPrimary,
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.5 : 1,
                transition: 'opacity 200ms ease',
              }}
            >
              {task.title}
            </span>
            {!expanded && task.comment && (
              <span className="block text-xs mt-0.5 truncate" style={{ color: theme.textSecondary }}>
                {task.comment}
              </span>
            )}
          </div>

          <div
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
            style={{ transition: 'transform 200ms ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5l5 5 5-5" stroke={theme.textTertiary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Expanded comment area */}
        {expanded && (
          <div
            className="px-4 pb-3"
            style={{ borderTop: `1px solid ${theme.separator}` }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 pt-2 mb-1">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 1h11v8H7.5L4 12V9H1V1z" stroke={theme.textTertiary} strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-medium" style={{ color: theme.textTertiary }}>Note</span>
              {!editingComment && (
                <button
                  onClick={() => setEditingComment(true)}
                  className="ml-auto text-xs font-semibold"
                  style={{ color: theme.accent }}
                >
                  {task.comment ? 'Edit' : 'Add'}
                </button>
              )}
            </div>

            {editingComment ? (
              <div>
                <textarea
                  autoFocus
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full text-sm rounded-xl px-3 py-2 outline-none resize-none"
                  style={{
                    backgroundColor: theme.surfaceAlt,
                    color: theme.textPrimary,
                    fontSize: 14,
                    border: `1px solid ${theme.border}`,
                  }}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => { setCommentText(task.comment || ''); setEditingComment(false); }}
                    className="text-sm px-3 py-1 rounded-lg"
                    style={{ color: theme.textSecondary, backgroundColor: theme.surfaceAlt }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveComment}
                    className="text-sm px-3 py-1 rounded-lg font-medium"
                    style={{ backgroundColor: theme.accent, color: '#000' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p
                className="text-sm"
                style={{ color: task.comment ? theme.textPrimary : theme.textTertiary, minHeight: 20 }}
                onClick={() => setEditingComment(true)}
              >
                {task.comment || 'Tap to add a note...'}
              </p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                const newTitle = window.prompt('Edit task', task.title);
                if (newTitle && newTitle.trim()) onEdit(task.id, newTitle.trim());
              }}
              className="mt-3 text-xs"
              style={{ color: theme.textSecondary }}
            >
              ✏️ Edit title
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
