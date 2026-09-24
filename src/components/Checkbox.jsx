// Checkbox.jsx
// WeekFlow
// Author: Andrei Ando

import React from 'react';
import { useTheme } from '../theme';

export default function Checkbox({ checked, onChange }) {
  const theme = useTheme();
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center focus:outline-none"
      style={{
        borderColor: checked ? theme.accent : theme.checkboxBorder,
        backgroundColor: checked ? theme.accent : 'transparent',
        transition: 'background-color 180ms ease, border-color 180ms ease',
      }}
    >
      {checked && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
          <path d="M1 4L4.5 7.5L11 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
