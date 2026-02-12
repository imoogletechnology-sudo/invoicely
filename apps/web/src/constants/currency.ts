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
 * Currency symbols that are safe to render in PDF fonts (basic Latin charset).
 * Symbols outside this set (e.g. ₦, ₹, ¥, ₩) may not exist in the TTF font
 * glyphs used by react-pdf, so we fall back to the 3-letter currency code.
 */
const PDF_SAFE_SYMBOLS = new Set(["$", "€", "£", "Fr", "kr"]);

/**
 * Get a PDF-safe currency prefix. Uses the symbol if it's in the safe set,
 * otherwise falls back to the uppercase currency code (e.g. "NGN ").
 */
const getPdfSafePrefix = (currency: string): string => {
  const symbol = getSymbolFromCurrency(currency);
  if (symbol && PDF_SAFE_SYMBOLS.has(symbol)) {
    return symbol;
  }
  return `${currency} `;
};

/**
 * Format a currency amount for display.
 * Uses PDF-safe symbols for common currencies ($, €, £) and falls back
 * to the 3-letter currency code for currencies whose symbols aren't
 * in standard Latin fonts (like NGN, INR, CNY, KRW, etc.).
 */
export const formatCurrencyText = (currency: string, amount: number) => {
  try {
    const prefix = getPdfSafePrefix(currency);
    const locale = currencyLocaleMap[currency] || "en-US";

    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${prefix}${formattedNumber}`;
  } catch {
    const prefix = getPdfSafePrefix(currency);
    return `${prefix}${amount.toFixed(2)}`;
  }
};
