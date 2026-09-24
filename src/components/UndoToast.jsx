// UndoToast.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useEffect, useState } from 'react';
import { useTheme } from '../theme';

const DURATION_MS = 4000;

export default function UndoToast({ pendingDeletes, onUndo }) {
  const theme = useTheme();
  const latest = pendingDeletes.length > 0 ? pendingDeletes[pendingDeletes.length - 1] : null;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!latest) { setProgress(100); return; }
    setProgress(100);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [latest?.id]);

  if (!latest) return null;

  return (
    <div
      className="fixed z-50 left-1/2"
      style={{
        bottom: 'calc(6rem + env(safe-area-inset-bottom))',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2.5rem)',
        maxWidth: 420,
        animation: 'toastSlideUp 220ms cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: theme.toastBg }}>
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <span className="text-sm" style={{ color: '#FFFFFF' }}>Task deleted</span>
          <button
            onClick={() => onUndo(latest.id)}
            className="text-sm font-semibold flex-shrink-0"
            style={{ color: theme.accent }}
          >
            Undo
          </button>
        </div>
        <div className="h-0.5 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <div
            className="h-full"
            style={{ width: `${progress}%`, backgroundColor: theme.accent, transition: 'width 50ms linear' }}
          />
        </div>
      </div>
      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
