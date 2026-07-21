export type RateCategory = 'Kod' | 'Cüzdan' | 'Mobil Ödeme' | 'Kart';

export type RateItem = {
  id: string;
  serviceSlug: string;
  name: string;
  rate: number;
  maxRate: number;
  range: string;
  category: RateCategory;
  minAmount: number;
  maxAmount: number;
};

export const RATE_UPDATED_AT = '17 Temmuz 2026';

export const rateItems: RateItem[] = [
  { id:'razer-tl', serviceSlug:'razer-gold-tl', name:'Razer Gold TL', rate:60, maxRate:70, range:'%60 – %70', category:'Kod', minAmount:1, maxAmount:1_000_000 },
  { id:'razer-usd', serviceSlug:'razer-gold-usd', name:'Razer Gold USD', rate:50, maxRate:50, range:'%50', category:'Kod', minAmount:1, maxAmount:1_000_000 },
  { id:'apple', serviceSlug:'itunes-apple', name:'Apple / iTunes', rate:45, maxRate:50, range:'%45 – %50', category:'Kod', minAmount:1, maxAmount:1_000_000 },
  { id:'steam', serviceSlug:'steam', name:'Steam', rate:40, maxRate:50, range:'%40 – %50', category:'Kod', minAmount:1, maxAmount:1_000_000 },
  { id:'paycell', serviceSlug:'paycell', name:'Paycell', rate:60, maxRate:60, range:'%60', category:'Cüzdan', minAmount:1, maxAmount:1_000_000 },
  { id:'pokus', serviceSlug:'pokus', name:'Pokus', rate:60, maxRate:60, range:'%60', category:'Cüzdan', minAmount:1, maxAmount:1_000_000 },
  { id:'vodafone', serviceSlug:'vodafone-mobil-odeme', name:'Vodafone Mobil Ödeme', rate:40, maxRate:50, range:'%40 – %50', category:'Mobil Ödeme', minAmount:1, maxAmount:1_000_000 },
  { id:'turkcell', serviceSlug:'turkcell-mobil-odeme', name:'Turkcell Mobil Ödeme', rate:40, maxRate:50, range:'%40 – %50', category:'Mobil Ödeme', minAmount:1, maxAmount:1_000_000 },
  { id:'turk-telekom', serviceSlug:'turk-telekom-mobil-odeme', name:'Türk Telekom Mobil Ödeme', rate:40, maxRate:50, range:'%40 – %50', category:'Mobil Ödeme', minAmount:1, maxAmount:1_000_000 },
  { id:'sms-mobil', serviceSlug:'sms-mobil-odeme', name:'SMS Mobil Ödeme', rate:40, maxRate:50, range:'%40 – %50', category:'Mobil Ödeme', minAmount:1, maxAmount:1_000_000 },
  { id:'sanal-kart', serviceSlug:'kredi-karti-sanal-kart', name:'Kredi / Sanal Kart', rate:60, maxRate:70, range:'%60 – %70', category:'Kart', minAmount:1, maxAmount:1_000_000 },
];

export function getRateByName(name: string) {
  return rateItems.find((item) => item.name === name) ?? rateItems[0];
}

export function getRateByServiceSlug(slug: string) {
  return rateItems.find((item) => item.serviceSlug === slug);
}

export function getRateRange(slug: string) {
  return getRateByServiceSlug(slug)?.range ?? 'İşlem öncesi teyit edilir';
}

export function parseTurkishAmount(value: string) {
  const clean = value.trim().replace(/\s/g, '');
  if (!clean) return Number.NaN;
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean.replace(/\./g, '');
  return Number(normalized);
}

export function calculatePayout(amount: number, rate: number) {
  if (!Number.isFinite(amount) || !Number.isFinite(rate) || amount < 0 || rate < 0) return 0;
  return Math.round(amount * rate) / 100;
}

export function validateAmount(amount: number, item: RateItem) {
  if (!Number.isFinite(amount)) return 'Geçerli bir tutar girin.';
  if (amount < item.minAmount) return `En az ${item.minAmount.toLocaleString('tr-TR')} TL girin.`;
  if (amount > item.maxAmount) return `En fazla ${item.maxAmount.toLocaleString('tr-TR')} TL girilebilir.`;
  return '';
}

export const rateDisclaimer = `Oranlar ${RATE_UPDATED_AT} tarihinde güncellenmiştir. Gösterilen tutar tahminidir; kesin oran, stok ve işlem koşulları kontrol edildikten sonra yazılı olarak bildirilir.`;
