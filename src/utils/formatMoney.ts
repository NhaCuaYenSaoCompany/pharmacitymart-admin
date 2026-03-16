/**
 * Format money with Vietnamese currency format
 * @param amount - The amount to format (string or number)
 * @param currency - Currency symbol (default: 'VNĐ')
 * @param locale - Locale for formatting (default: 'vi-VN')
 * @returns Formatted money string
 */
export const formatMoney = (
  amount: string | number,
  currency: string = 'VNĐ',
  locale: string = 'vi-VN'
): string => {
  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if the amount is valid
  if (isNaN(numericAmount)) {
    return `0 ${currency}`;
  }
  
  // Format the number with locale-specific formatting
  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
  
  return `${formattedAmount} ${currency}`;
};

/**
 * Format money for display in tables or UI components
 * @param amount - The amount to format
 * @returns Formatted money string with VNĐ currency
 */
export const formatVND = (amount: string | number): string => {
  return formatMoney(amount, 'VNĐ');
};

/**
 * Format money for USD currency
 * @param amount - The amount to format
 * @returns Formatted money string with USD currency
 */
export const formatUSD = (amount: string | number): string => {
  return formatMoney(amount, 'USD', 'en-US');
};

/**
 * Parse formatted money string back to number
 * @param formattedMoney - Formatted money string
 * @returns Numeric value
 */
export const parseMoney = (formattedMoney: string): number => {
  // Remove currency symbols and spaces, keep only numbers, dots and commas
  const cleanedAmount = formattedMoney.replace(/[^\d.,]/g, '');
  
  // Handle Vietnamese format (comma as thousand separator, dot as decimal)
  const normalizedAmount = cleanedAmount.replace(/\./g, '').replace(/,/g, '.');
  
  return parseFloat(normalizedAmount) || 0;
};

/**
 * Format money with compact notation (K, M, B)
 * @param amount - The amount to format
 * @param currency - Currency symbol
 * @returns Compact formatted money string
 */
export const formatMoneyCompact = (
  amount: string | number,
  currency: string = 'VNĐ'
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return `0 ${currency}`;
  }
  
  const formatter = new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  
  return `${formatter.format(numericAmount)} ${currency}`;
};
