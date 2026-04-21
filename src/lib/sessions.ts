export function sessionDurationMinutes(
  startedAt: Date,
  endedAt: Date | null,
): number | null {
  if (!endedAt) return null;
  const ms = endedAt.getTime() - startedAt.getTime();
  if (ms <= 0) return 0;
  return Math.round(ms / 60_000);
}
