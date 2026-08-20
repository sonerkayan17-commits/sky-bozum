export type RazerCodeCurrency = 'TRY' | 'USD';
export type CodeSalePayoutMethod = 'balance' | 'iban';

export const razerCodeValues: Record<RazerCodeCurrency, readonly number[]> = {
  TRY: [50, 100, 250, 500, 1000, 1500, 2000, 3000, 3500, 4000, 5000],
  USD: [5, 10, 20, 50, 100, 200],
};

export function resolveRazerCodeValue(currency: unknown, value: unknown) {
  const safeCurrency = currency === 'USD' ? 'USD' : currency === 'TRY' ? 'TRY' : null;
  const numericValue = Number(value);
  if (!safeCurrency || !Number.isInteger(numericValue) || !razerCodeValues[safeCurrency].includes(numericValue)) return null;
  return { currency: safeCurrency, value: numericValue } as const;
}

export function formatCodeValue(currency: RazerCodeCurrency, value: number) {
  return currency === 'USD' ? `${value.toLocaleString('tr-TR')} USD` : `${value.toLocaleString('tr-TR')} TL`;
}

export function payoutMethodLabel(method: CodeSalePayoutMethod) {
  return method === 'balance' ? 'Sky Bozum bakiyesi' : 'Kayıtlı IBAN';
}
