import { addDays, addMonths, isBefore } from "date-fns";
import type { GameListingFrequency } from "@/generated/prisma/enums";

const MAX_MONTHS = 12;

export function computeSeriesEndDate(startDate: Date): Date {
  return addMonths(startDate, MAX_MONTHS);
}

export function computeSeriesOccurrences(params: {
  startDate: Date;
  frequency: GameListingFrequency;
}): Date[] {
  const { startDate, frequency } = params;
  const endDate = computeSeriesEndDate(startDate);
  const dates: Date[] = [];
  let cursor = startDate;
  let monthStep = 0;

  while (isBefore(cursor, endDate)) {
    dates.push(cursor);
    switch (frequency) {
      case "DAILY":
        cursor = addDays(cursor, 1);
        break;
      case "WEEKLY":
        cursor = addDays(cursor, 7);
        break;
      case "BIWEEKLY":
        cursor = addDays(cursor, 15);
        break;
      case "MONTHLY":
        monthStep += 1;
        // Recompute from the fixed startDate each time (not chained addMonths(cursor, 1)):
        // addMonths clamps when the original day-of-month doesn't exist in the target month
        // (e.g. Jan 31 -> Feb 28). Chaining would compound the drift across months; recomputing
        // from the fixed start avoids that at the cost of a per-month clamp on short months.
        cursor = addMonths(startDate, monthStep);
        break;
    }
  }

  return dates;
}
