export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    currency: "EUR",
    style: "currency",
  }).format(amount);
}
