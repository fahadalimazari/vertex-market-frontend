/**
 * Global utility to format prices across the application.
 * @param {number} amount - The base amount in USD
 * @param {string} currencyCode - The target currency code (e.g., 'PKR')
 * @param {object} exchangeRates - Map of exchange rates where USD = 1
 * @param {string} locale - User's locale string (e.g., 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatPrice = (amount, currencyCode, exchangeRates, locale = 'en-US') => {
  if (!amount) return '0.00';
  
  const rate = exchangeRates?.[currencyCode] || 1;
  const convertedAmount = amount * rate;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(convertedAmount);
};
