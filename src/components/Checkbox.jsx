// Checkbox.jsx
// WeekFlow
// Author: Andrei Ando

import React from 'react';

export default function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none"
      style={{
        borderColor: checked ? '#FFD60A' : '#C7C7CC',
        backgroundColor: checked ? '#FFD60A' : 'transparent',
      }}
    >
      {checked && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
          <path
            d="M1 4L4.5 7.5L11 1"
            stroke="#000"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
