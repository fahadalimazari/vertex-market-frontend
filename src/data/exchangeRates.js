// Base currency is USD
export const exchangeRates = {
  USD: 1,
  PKR: 278.50,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  INR: 83.50
};

export const fetchExchangeRates = async () => {
  return new Promise((resolve) => {
    // Simulate network fetch
    setTimeout(() => {
      resolve({
        base: 'USD',
        rates: exchangeRates,
        lastUpdated: new Date().toISOString()
      });
    }, 500);
  });
};
