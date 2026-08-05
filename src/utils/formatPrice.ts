export const priceFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}
