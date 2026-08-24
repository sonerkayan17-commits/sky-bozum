export const bozumSeoIntents = {
  primary: [
    'mobil ödeme bozdurma',
    'mobil bozum',
    'mobil ödeme bozum',
    'bakiye bozdurma',
    'dijital bakiye bozdurma',
  ],
  operator: [
    'Vodafone ile dijital ürün satın alma',
    'Turkcell ile dijital kod satın alma',
    'Türk Telekom dijital ürün alım rehberi',
    'mobil ödeme limiti',
  ],
  wallet: [
    'Paycell ile dijital ürün satın alma',
    'Pokus ile dijital ürün satın alma',
    'Vodafone Pay dijital alışveriş rehberi',
  ],
  digitalCode: [
    'Razer Gold bozdurma',
    'Razer Gold TL bozdurma',
    'Razer Gold USD bozdurma',
    'Apple Gift Card bozdurma',
    'iTunes kod bozdurma',
    'Steam cüzdan kodu bozdurma',
  ],
  supporting: [
    'mobil ödeme nasıl açılır',
    'mobil ödeme nasıl çalışır',
    'mobil ödeme güvenli mi',
    'mobil ödeme limiti nasıl öğrenilir',
    'dijital kod nasıl bozdurulur',
    'bozum oranı nasıl hesaplanır',
  ],
} as const;

export type BozumSeoIntentGroup = keyof typeof bozumSeoIntents;
