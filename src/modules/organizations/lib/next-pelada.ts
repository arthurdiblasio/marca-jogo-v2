export function computeNextPeladaDate(
  weekday: number | null | undefined,
  scheduledTime: string | null | undefined,
  from: Date = new Date(),
): Date | null {
  if (weekday == null || !scheduledTime) return null;

  const [hours, minutes] = scheduledTime.split(":").map(Number);

  const next = new Date(from);
  next.setHours(hours, minutes, 0, 0);

  let daysUntil = (weekday - from.getDay() + 7) % 7;
  if (daysUntil === 0 && next.getTime() <= from.getTime()) {
    daysUntil = 7;
  }

  next.setDate(next.getDate() + daysUntil);
  return next;
}
