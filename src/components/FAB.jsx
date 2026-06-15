// FAB.jsx
// WeekFlow
// Author: Andrei Ando

import React, { useState } from 'react';

export default function FAB({ onClick }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      aria-label="Add task"
      className="fixed z-40 flex items-center justify-center rounded-full shadow-lg"
      style={{
        width: 56,
        height: 56,
        backgroundColor: '#FFD60A',
        bottom: 'calc(1.75rem + env(safe-area-inset-bottom))',
        right: '1.25rem',
        boxShadow: '0 4px 16px rgba(255,214,10,0.45)',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
        transition: 'transform 180ms cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3v16M3 11h16" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
