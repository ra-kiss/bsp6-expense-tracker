import { API_KEY, currencySymbols } from './appConstants';

// Default rates to use as a fallback if the API call fails
const fallbackRates = {
  USD: 1, EUR: 0.85, JPY: 110.0,
  GBP: 0.79, AUD: 1.35, CAD: 1.27, CHF: 0.91, CNY: 6.47,
};

/**
 * Fetches the latest exchange rates for a given base currency.
 * @param {string} baseCurrency - The base currency code (e.g., 'USD').
 * @returns {Promise<{rates: object, currencies: Array<{value: string, label: string}>}>}
 */
export const fetchExchangeRates = async (baseCurrency) => {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
    const data = await response.json();

    if (data.result === 'success') {
      const newRates = {};
      // Filter rates to include only currencies we have defined symbols for
      Object.keys(currencySymbols).forEach((code) => {
        if (data.conversion_rates[code]) {
          newRates[code] = data.conversion_rates[code];
        }
      });
      
      const newCurrencies = Object.keys(currencySymbols).map((code) => ({
        value: code,
        label: currencySymbols[code],
      }));

      return { rates: newRates, currencies: newCurrencies };
    } else {
      console.error('API error:', data['error-type']);
      return { rates: fallbackRates, currencies: getFallbackCurrencies() };
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // On failure, return fallback data
    return { rates: fallbackRates, currencies: getFallbackCurrencies() };
  }
};

const getFallbackCurrencies = () => {
  return Object.keys(currencySymbols).map((code) => ({
    value: code,
    label: currencySymbols[code],
  }));
};