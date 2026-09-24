// theme.js
// WeekFlow
// Author: Andrei Ando

import { createContext, useContext } from 'react';

export const light = {
  bg:               '#FFFDF7',
  bgHeader:         'rgba(255,253,247,0.92)',
  surface:          '#FFFFFF',
  surfaceAlt:       '#F2F2F7',
  border:           '#F0F0F0',
  borderStrong:     '#E5E5EA',
  textPrimary:      '#000000',
  textSecondary:    '#8E8E93',
  textTertiary:     '#C7C7CC',
  separator:        '#F2F2F2',
  accent:           '#FFD60A',
  accentShadow:     'rgba(255,214,10,0.45)',
  delete:           '#FF3B30',
  success:          '#34C759',
  toastBg:          '#1C1C1E',
  checkboxBorder:   '#C7C7CC',
  dragHandle:       '#D1D1D6',
  nudgeBg:          '#FFF3B0',
  nudgeBorder:      '#FFD60A',
  nudgeText:        '#7A6000',
};

export const dark = {
  bg:               '#000000',
  bgHeader:         'rgba(0,0,0,0.88)',
  surface:          '#1C1C1E',
  surfaceAlt:       '#2C2C2E',
  border:           '#3A3A3C',
  borderStrong:     '#3A3A3C',
  textPrimary:      '#FFFFFF',
  textSecondary:    '#8E8E93',
  textTertiary:     '#48484A',
  separator:        '#2C2C2E',
  accent:           '#FFD60A',
  accentShadow:     'rgba(255,214,10,0.35)',
  delete:           '#FF453A',
  success:          '#30D158',
  toastBg:          '#2C2C2E',
  checkboxBorder:   '#48484A',
  dragHandle:       '#48484A',
  nudgeBg:          '#2C2400',
  nudgeBorder:      '#FFD60A',
  nudgeText:        '#FFD60A',
};

export const ThemeContext = createContext(light);
export const useTheme = () => useContext(ThemeContext);
