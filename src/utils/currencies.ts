// src/utils/currencies.ts

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const currencyCodes = [
  "NGN", "USD", "GBP", "EUR", "CAD", "GHS", "KES", "ZAR" 
];

// We execute the logic and export the RESULT as CURRENCIES
export const CURRENCIES: Currency[] = currencyCodes.map(code => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
  });
  
  const symbol = formatter.formatToParts(0).find(p => p.type === 'currency')?.value || code;

  return {
    code,
    symbol,
    name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) || code
  };
});