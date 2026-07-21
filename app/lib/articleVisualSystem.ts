export type ArticleVisualFamily = 'operator' | 'wallet' | 'digital-code' | 'security' | 'guide' | 'finance' | 'shopping';

export type ArticleVisualMeta = {
  family: ArticleVisualFamily;
  label: string;
  accent: string;
  priority?: boolean;
};

const visualMap: Record<string, ArticleVisualMeta> = {
  'vodafone-mobil-odeme-nedir': { family: 'operator', label: 'Vodafone', accent: '#e60000', priority: true },
  'turkcell-mobil-odeme-nasil-kullanilir': { family: 'operator', label: 'Turkcell', accent: '#ffc900', priority: true },
  'turk-telekom-mobil-odeme-rehberi': { family: 'operator', label: 'Türk Telekom', accent: '#00a7e8', priority: true },
  'paycell-nedir-nasil-kullanilir': { family: 'wallet', label: 'Paycell', accent: '#ffc900', priority: true },
  'pokus-nedir-razer-gold-nasil-alinir': { family: 'wallet', label: 'Pokus', accent: '#6f4cff', priority: true },
  'hepsipay-nedir-nasil-kullanilir': { family: 'wallet', label: 'Hepsipay', accent: '#ff6a00' },
  'hadi-nedir-nasil-kullanilir': { family: 'wallet', label: 'Hadi', accent: '#c238ff' },
  'moneypay-nedir-limitleri': { family: 'wallet', label: 'MoneyPay', accent: '#22c55e' },
  'razer-gold-nedir': { family: 'digital-code', label: 'Razer Gold', accent: '#44d62c', priority: true },
  'razer-gold-kodu-nasil-satilir': { family: 'digital-code', label: 'Kod Rehberi', accent: '#44d62c' },
  'dijital-kod-hediye-karti-rehberi': { family: 'security', label: 'Güvenlik', accent: '#8b5cf6', priority: true },
  'mobil-odeme-nasil-acilir': { family: 'guide', label: 'Başlangıç', accent: '#5b8cff', priority: true },
  'hepsiburada-limiti-nedir': { family: 'shopping', label: 'Hepsiburada', accent: '#ff6000' },
  'hepsiburada-limiti-nasil-alinir': { family: 'shopping', label: 'Başvuru', accent: '#ff7a1a' },
  'hadi-veresiye-limiti-nedir': { family: 'finance', label: 'Hadi Veresiye', accent: '#d946ef' },
  'hadi-taksitli-limit-nedir': { family: 'finance', label: 'Taksitli Limit', accent: '#a855f7' },
  'pluxee-sodexo-nedir-nerelerde-gecer': { family: 'shopping', label: 'Pluxee', accent: '#ff5a1f' },
  'multinet-nedir-nerelerde-gecer': { family: 'shopping', label: 'MultiNet', accent: '#e11d48' },
  'tokenflex-nedir-nerelerde-gecer': { family: 'shopping', label: 'TokenFlex', accent: '#0ea5e9' },
  'ticket-restaurant-nedir-nerelerde-gecer': { family: 'shopping', label: 'Ticket', accent: '#ef4444' },
  'amazon-hediye-karti-nedir': { family: 'digital-code', label: 'Amazon', accent: '#f59e0b' },
  'eneba-hediye-karti-nedir': { family: 'digital-code', label: 'Eneba', accent: '#7c3aed' },
  'istanbulkart-nedir': { family: 'wallet', label: 'İstanbulkart', accent: '#06b6d4' },
  'financell-limiti-nedir': { family: 'finance', label: 'Financell', accent: '#14b8a6' },
};

export function getArticleVisualMeta(slug: string): ArticleVisualMeta | undefined {
  return visualMap[slug];
}

export const premiumVisualCoverage = {
  phase: 'V32.6 / Bölüm 2',
  upgraded: Object.keys(visualMap).length,
  target: 48,
  families: 7,
};
