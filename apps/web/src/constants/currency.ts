// @ts-expect-error - currency-symbol-map/map is not typed but it does return a map of all symbol and currency code
import currencyToSymbolMap from "currency-symbol-map/map";
import getSymbolFromCurrency from "currency-symbol-map";
export const currenciesWithSymbols: Record<string, string> = currencyToSymbolMap;

// Map currency codes to their common locales
const currencyLocaleMap: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  INR: "en-IN",
  JPY: "ja-JP",
  CNY: "zh-CN",
  AUD: "en-AU",
  CAD: "en-CA",
  CHF: "de-CH",
  SEK: "sv-SE",
  NZD: "en-NZ",
  NGN: "en-NG",
};

/**
 * Format a currency amount for display.
 * Uses the currency symbol from the symbol map with Intl number formatting
 * to ensure the symbol always renders correctly (even in PDF contexts where
 * fonts may not support special Unicode currency characters like ₦).
 */
export const formatCurrencyText = (currency: string, amount: number) => {
  try {
    const symbol = getSymbolFromCurrency(currency) || currency;
    const locale = currencyLocaleMap[currency] || "en-US";

    // Format the number part only (without currency symbol) to get proper grouping
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${symbol}${formattedNumber}`;
  } catch {
    // Fallback to simple formatting with symbol
    const symbol = getSymbolFromCurrency(currency) || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }
};
