/**
 * Formatting utilities for Indian Rupee currency and numbers.
 */

export interface FormatOptions {
  compact?: boolean;
  decimals?: number;
  showSign?: boolean;
}

/**
 * Formats a number in Indian Numbering system (Lakhs and Crores).
 * Example:
 * 2323391 with compact: true -> "₹23.23 L"
 * 14750000 with compact: true -> "₹1.48 Cr"
 * 15000 with compact: true -> "₹15,000"
 * 1200000 standard -> "₹12,00,000"
 */
export function formatINR(amount: number, options: FormatOptions = {}): string {
  const { compact = false, decimals = 2, showSign = false } = options;

  if (isNaN(amount) || !isFinite(amount)) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const signPrefix = isNegative ? '-' : showSign && amount > 0 ? '+' : '';

  if (compact) {
    if (absAmount >= 10000000) {
      // Crores (>= 1,00,00,000)
      const cr = absAmount / 10000000;
      return `${signPrefix}₹${cr.toFixed(decimals)} Cr`;
    }
    if (absAmount >= 100000) {
      // Lakhs (>= 1,00,000)
      const l = absAmount / 100000;
      return `${signPrefix}₹${l.toFixed(decimals)} L`;
    }
  }

  // Standard Indian comma grouping
  const formattedWithCommas = formatIndianNumber(Math.round(absAmount));
  return `${signPrefix}₹${formattedWithCommas}`;
}

/**
 * Formats an integer using Indian comma rules:
 * Last 3 digits grouped, then groups of 2 digits.
 * e.g., 1234567 -> "12,34,567"
 */
export function formatIndianNumber(num: number): string {
  const str = Math.round(Math.abs(num)).toString();
  if (str.length <= 3) return str;

  const lastThree = str.substring(str.length - 3);
  const rest = str.substring(0, str.length - 3);

  const formattedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${formattedRest},${lastThree}`;
}

/**
 * Formats a decimal rate into percentage.
 * e.g., 0.12 -> "12%", 0.095 -> "9.5%"
 */
export function formatPercent(rate: number, decimals: number = 1): string {
  const percent = rate * 100;
  if (Number.isInteger(percent)) {
    return `${percent}%`;
  }
  return `${percent.toFixed(decimals)}%`;
}

/**
 * Formats years into readable phrase.
 * e.g. 1 -> "1 year", 10 -> "10 years"
 */
export function formatYears(years: number): string {
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}
