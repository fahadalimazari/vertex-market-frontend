/**
 * Global utility to format dates according to locale and timezone.
 */
export const formatDate = (dateString, locale = 'en-US', timezone = 'UTC') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  }).format(date);
};

export const formatNumber = (number, locale = 'en-US') => {
  if (number === undefined || number === null) return '0';
  return new Intl.NumberFormat(locale).format(number);
};

export const detectUserLocale = () => {
  // Mock detection
  const browserLang = navigator.language || 'en-US';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  let suggestedCountry = 'US';
  let suggestedCurrency = 'USD';
  let suggestedLang = 'en';

  if (timezone.includes('Karachi') || browserLang.includes('ur')) {
    suggestedCountry = 'PK';
    suggestedCurrency = 'PKR';
    suggestedLang = 'en'; // Default to English instead of Urdu to keep LTR layout by default
  } else if (timezone.includes('Dubai') || browserLang.includes('ar')) {
    suggestedCountry = 'AE';
    suggestedCurrency = 'AED';
    suggestedLang = 'ar';
  }

  return { suggestedCountry, suggestedCurrency, suggestedLang, timezone };
};
