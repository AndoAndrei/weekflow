// weekUtils.js
// WeekFlow
// Author: Andrei Ando

/**
 * Returns Monday of the week containing `date`.
 * Uses ISO week convention (week starts Monday).
 */
export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns an array of 7 Date objects [Mon...Sun] for the week containing `date`. */
export function getWeekDays(date = new Date()) {
  const monday = getWeekStart(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/** ISO date string: "2024-06-10" */
export function toDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Today's ISO date key */
export function todayKey() {
  return toDateKey(new Date());
}

/** "Jun 9 - Jun 15" */
export function weekRangeLabel(date = new Date()) {
  const days = getWeekDays(date);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(days[0])} - ${fmt(days[6])}`;
}

/** "Monday", "Tuesday", etc. */
export function dayName(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/** "Mon 10" */
export function dayShortLabel(date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const num = date.getDate();
  return `${weekday} ${num}`;
}

export function isToday(date) {
  return toDateKey(date) === todayKey();
}

export function isPast(date) {
  return toDateKey(date) < todayKey();
}

/** Returns true if two dates are in different ISO weeks */
export function isDifferentWeek(d1, d2) {
  return toDateKey(getWeekStart(d1)) !== toDateKey(getWeekStart(d2));
}
