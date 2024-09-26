export function getSameDayLastMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const lastMonth = new Date(Date.UTC(year, month - 1, day, 8, 0, 0));

  if (lastMonth.getUTCMonth() !== (month - 1 + 12) % 12) {
    lastMonth.setUTCDate(0);
  }

  return lastMonth;
}
