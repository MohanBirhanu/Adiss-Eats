/**
 * Formats a numeric price into Ethiopian Birr standard format (e.g. "ETB 450" or "ETB 1,200").
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-ET', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount || 0);

  return `ETB ${formatted}`;
}
