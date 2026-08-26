import { addDays, addMonths, isBefore } from "date-fns";

const MAX_MONTHS = 12;

export function computeRecurringOccurrences(startDate: Date, intervalDays: number): Date[] {
  const endDate = addMonths(startDate, MAX_MONTHS);
  const dates: Date[] = [];
  let cursor = startDate;

  while (isBefore(cursor, endDate)) {
    dates.push(cursor);
    cursor = addDays(cursor, intervalDays);
  }

  return dates;
}
