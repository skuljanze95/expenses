export function percentageChange(current: number, historical: number) {
  if (!historical) return 0;
  return ((current - historical) / historical) * 100;
}
