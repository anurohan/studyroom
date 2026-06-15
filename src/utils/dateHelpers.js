// src/utils/dateHelpers.js
// Date/time utility helpers

/** Get today's date as YYYY-MM-DD string */
export const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

/** Format a date string or Date to "Mon DD, YYYY" */
export const formatDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/** Format a Firestore Timestamp to readable string */
export const formatTimestamp = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/** Generate an array of next N days starting from today */
export const getNextNDays = (n = 7) => {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

/** Check if a date string is today */
export const isToday = (dateStr) => dateStr === getTodayStr();
