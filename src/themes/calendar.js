import {CHINESE_NEW_YEAR_DATES} from './chinese-new-year-dates.js';

/** Gregorian Easter Sunday, using the Meeus/Jones/Butcher computus. */
export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = (h + l - 7 * m + 114) % 31 + 1;
  return new Date(year, month - 1, day, 12);
}

/** Tuesday before Easter through Easter Monday, inclusive in local time. */
export function isEasterSeason(date = new Date()) {
  const easter = easterSunday(date.getFullYear());
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const sunday = Date.UTC(easter.getFullYear(), easter.getMonth(), easter.getDate());
  const offset = (day - sunday) / 86400000;
  return offset >= -5 && offset <= 1;
}

const chineseDates = new Map();

/** Prefer published dates; use the runtime's lunisolar calendar outside that range. */
export function chineseNewYear(year) {
  const published = CHINESE_NEW_YEAR_DATES[year];
  if (published) return new Date(year, published[0] - 1, published[1], 12);
  if (!chineseDates.has(year)) {
    let found = null;
    try {
      const calendar = new Intl.DateTimeFormat('en-u-ca-chinese', {month: 'numeric', day: 'numeric', timeZone: 'UTC'});
      if (calendar.resolvedOptions().calendar === 'chinese') {
        for (let day = 21; day <= 51; day++) {
          const date = new Date(Date.UTC(year, 0, day, 12));
          const parts = calendar.formatToParts(date);
          if (parts.find(p => p.type === 'month')?.value === '1' && parts.find(p => p.type === 'day')?.value === '1') {
            found = [date.getUTCMonth(), date.getUTCDate()];
            break;
          }
        }
      }
    } catch {
      // Minimal ICU runtimes can still select the scene manually.
    }
    chineseDates.set(year, found);
  }
  const parts = chineseDates.get(year);
  return parts ? new Date(year, parts[0], parts[1], 12) : null;
}

/** The first day of Chinese New Year and the six days following it. */
export function isChineseNewYearSeason(date = new Date()) {
  const first = chineseNewYear(date.getFullYear());
  if (!first) return false;
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const start = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
  return day >= start && day <= start + 6 * 86400000;
}
