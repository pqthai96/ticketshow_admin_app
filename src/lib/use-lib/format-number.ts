/**
 * Formats a number to standard display format with commas as thousand separators
 * and 2 decimal places
 * @param value - The number to format
 * @returns Formatted string
 */
export function standardFormat(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number to currency format with the specified currency symbol
 * @param value - The number to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function currencyFormat(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Formats a number to percentage format
 * @param value - The number to format (e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function percentFormat(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number to compact format (e.g., 1.2K, 1.2M)
 * @param value - The number to format
 * @returns Formatted compact string
 */
export function compactFormat(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}