/**
 * Small local-date helpers shared by the timeline calendar and editor-facing UI.
 *
 * Date-only values are deliberately interpreted in the browser's local timezone;
 * converting them through UTC would shift the selected day for many users.
 */

export function parseLocalDateInput(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
    date,
    value: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

export function localDateValue(timestampSeconds = Date.now() / 1000) {
  const date = new Date(Number(timestampSeconds) * 1000);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatLocalDateInput(value, includeYear = false) {
  const parsed = parseLocalDateInput(value);
  if (!parsed) return '';

  return parsed.date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  });
}
