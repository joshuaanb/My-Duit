import { CURRENCIES, CATEGORY_COLORS } from '../types/finance';

/**
 * Format a number into currency representation
 * @param {number} amount 
 * @param {string} currencyCode 
 * @returns {string}
 */
export const formatCurrency = (amount = 0, currencyCode = 'USD') => {
  const num = Number(amount) || 0;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (err) {
    // Fallback if currency code is custom/unsupported by Intl
    const curr = CURRENCIES.find(c => c.code === currencyCode) || { symbol: '$' };
    return `${curr.symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

/**
 * Format date string (YYYY-MM-DD) into readable format
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format date for month picker (YYYY-MM) to Month Year (e.g., Aug 2026)
 * @param {string} monthStr 
 * @returns {string}
 */
export const formatMonthYear = (monthStr) => {
  if (!monthStr) return 'All Months';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Get category hex color
 * @param {string} category 
 * @returns {string}
 */
export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#64748B';
};
