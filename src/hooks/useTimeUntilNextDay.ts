import { useEffect, useState } from 'react';

import { now } from '../clock';
import { dayKey, msUntilMinuteChanges, msUntilNextDay, type DayKey } from '../game/days';

function readRemainingMs(day: DayKey | null): number | null {
  const date = now();
  return day !== null && dayKey(date) === day ? msUntilNextDay(date) : null;
}

/**
 * The time left before the day after `day` starts, read again every time its minute changes.
 * Null without a day, and once that day is over.
 */
export function useTimeUntilNextDay(day: DayKey | null): number | null {
  const [remainingMs, setRemainingMs] = useState(() => readRemainingMs(day));

  useEffect(() => {
    if (remainingMs === null) {
      return;
    }
    const timer = setTimeout(
      () => setRemainingMs(readRemainingMs(day)),
      msUntilMinuteChanges(remainingMs),
    );
    return () => clearTimeout(timer);
  }, [day, remainingMs]);

  return remainingMs;
}
