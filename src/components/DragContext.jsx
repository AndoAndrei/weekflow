// DragContext.jsx
// WeekFlow
// Author: Andrei Ando
//
// Handles the floating ghost + drop zone detection for drag-to-reorder.
// Strategy:
//   - On long press, TaskRow calls onDragStart(taskId, sourceEl)
//   - We create a ghost clone that follows the finger
//   - We scan [data-task-id] and [data-day-key] elements to find drop target
//   - On release we call moveTask(taskId, targetDay, targetIndex)

import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function DragContext({ children, onMoveTask, weekDays }) {
  const [dragging, setDragging] = useState(null); // { taskId, ghostEl }
  const [dropTarget, setDropTarget] = useState(null); // { dateKey, index }
  const ghostRef = useRef(null);
  const frameRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const cleanup = useCallback(() => {
    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }
    setDragging(null);
    setDropTarget(null);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const startDrag = useCallback((taskId, sourceEl) => {
    if (!sourceEl) return;
    const rect = sourceEl.getBoundingClientRect();

    // Build ghost
    const ghost = sourceEl.cloneNode(true);
    ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.92;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      background: #fff;
      transform: scale(1.03);
      transition: transform 150ms ease;
    `;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    setDragging({ taskId, originRect: rect });

    // Haptic if available
    if (navigator.vibrate) navigator.vibrate(30);
  }, []);

  // Move ghost on touchmove
  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) => {
      const touch = e.touches[0];
      lastPos.current = { x: touch.clientX, y: touch.clientY };

      frameRef.current = requestAnimationFrame(() => {
        if (!ghostRef.current) return;
        const { originRect } = dragging;
        const dx = touch.clientX - (originRect.left + originRect.width / 2);
        const dy = touch.clientY - (originRect.top + originRect.height / 2);
        ghostRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
      });

      // Determine drop target
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!el) return;

      // Find which day card we're over
      const dayCard = el.closest('[data-day-key]');
      if (!dayCard) { setDropTarget(null); return; }
      const dateKey = dayCard.dataset.dayKey;

      // Find all task rows in that day
      const rows = Array.from(dayCard.querySelectorAll('[data-task-id]'))
        .filter(r => r.dataset.taskId !== dragging.taskId);

      let insertIndex = rows.length;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i].getBoundingClientRect();
        if (touch.clientY < r.top + r.height / 2) {
          insertIndex = i;
          break;
        }
      }

      setDropTarget({ dateKey, index: insertIndex });
    };

    const onEnd = () => {
      if (dropTarget) {
        onMoveTask(dragging.taskId, dropTarget.dateKey, dropTarget.index);
      }
      cleanup();
    };

    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', cleanup);

    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', cleanup);
    };
  }, [dragging, dropTarget, onMoveTask, cleanup]);

  return (
    <DragContextValue.Provider value={{ startDrag, draggingId: dragging?.taskId, dropTarget }}>
      {children}
    </DragContextValue.Provider>
  );
}

export const DragContextValue = React.createContext({
  startDrag: () => {},
  draggingId: null,
  dropTarget: null,
});
