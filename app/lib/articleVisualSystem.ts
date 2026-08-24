export type ArticleVisualFamily = 'operator' | 'wallet' | 'digital-code' | 'security' | 'guide' | 'finance' | 'shopping';

export type ArticleVisualMeta = {
  family: ArticleVisualFamily;
  label: string;
  accent: string;
  priority?: boolean;
};

const visualMap: Record<string, ArticleVisualMeta> = {
  'guvenilir-mobil-bozum-sitesi-nasil-secilir': { family: 'security', label: 'Site Kontrolü', accent: '#fb7185', priority: true },
  'dijital-kod-satin-almadan-once-kontrol-listesi': { family: 'security', label: '10 Nokta Kontrolü', accent: '#c87555', priority: true },
  'kredi-karti-sanal-kart-islem-reddedildi': { family: 'security', label: 'Kart Güvenliği', accent: '#4f7cff', priority: true },
  'paycell-limit-bakiye-farki': { family: 'wallet', label: 'Paycell Kontrol', accent: '#22d3c5', priority: true },
  'pokus-limit-bakiye-farki': { family: 'wallet', label: 'Pokus Kontrol', accent: '#ff7a1a', priority: true },
  'mobil-odeme-limiti-var-islem-reddediliyor': { family: 'operator', label: 'Hata Çözümü', accent: '#ef4765', priority: true },
  'razer-gold-kodu-calismiyor': { family: 'digital-code', label: 'Kod Kontrolü', accent: '#44d62c', priority: true },
  'apple-gift-card-nedir': { family: 'digital-code', label: 'Apple Gift Card', accent: '#64748b', priority: true },
  'vodafone-mobil-odeme-nedir': { family: 'operator', label: 'Vodafone', accent: '#e60000', priority: true },
  'turkcell-mobil-odeme-nasil-kullanilir': { family: 'operator', label: 'Turkcell', accent: '#ffc900', priority: true },
  'turk-telekom-mobil-odeme-rehberi': { family: 'operator', label: 'Türk Telekom', accent: '#00a7e8', priority: true },
  'paycell-nedir-nasil-kullanilir': { family: 'wallet', label: 'Paycell', accent: '#22d3c5', priority: true },
  'pokus-nedir-razer-gold-nasil-alinir': { family: 'wallet', label: 'Pokus', accent: '#ff7a1a', priority: true },
  'hepsipay-nedir-nasil-kullanilir': { family: 'wallet', label: 'Hepsipay', accent: '#ff6a00' },
  'hadi-nedir-nasil-kullanilir': { family: 'wallet', label: 'Hadi', accent: '#c238ff' },
  'hadi-kredi-karti-limiti': { family: 'finance', label: 'Hadi Kart', accent: '#ff8a1f' },
  'a101-hadi-odeme-limitleri': { family: 'finance', label: 'A101 Hadi', accent: '#ff7a1a' },
  'cepte-sok-nedir': { family: 'wallet', label: 'Cepte Şok', accent: '#ffd51f' },
  'bim-card-nedir': { family: 'wallet', label: 'BİM Card', accent: '#e31e24' },
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

  'hepsiburada-limiti-neye-gore-hesaplanir': { family: 'finance', label: 'Limit Hesabı', accent: '#ff7a1a' },
  'hepsiburada-limiti-nasil-kullanilir': { family: 'shopping', label: 'Kullanım', accent: '#ff6000' },
  'hepsiburada-limiti-nerelerde-gecer': { family: 'shopping', label: 'Geçerlilik', accent: '#ff6000' },
  'hepsiburada-limiti-bozdurulur-mu': { family: 'security', label: 'Güvenli Bilgi', accent: '#8b5cf6' },
  'hepsipay-hizli-kredi-nedir': { family: 'finance', label: 'Hızlı Kredi', accent: '#ff7a1a' },
  'yemek-kartlari-bozdurulur-mu': { family: 'security', label: 'Yemek Kartları', accent: '#8b5cf6' },
  'kredim-nedir-limiti-nasil-alinir': { family: 'finance', label: 'Kredim', accent: '#2563eb' },
  'kredim-limiti-nerelerde-gecer': { family: 'shopping', label: 'Kredim', accent: '#2563eb' },
  'kredim-limiti-nasil-aktif-edilir': { family: 'guide', label: 'Aktivasyon', accent: '#2563eb' },
  'kredim-limiti-bozdurulur-mu': { family: 'security', label: 'Kredim', accent: '#8b5cf6' },
  'financell-ile-cihaz-nasil-alinir': { family: 'finance', label: 'Financell', accent: '#14b8a6' },
  'vodafone-faturaya-ek-cihaz': { family: 'finance', label: 'Vodafone', accent: '#e60000' },
  'turk-telekom-faturaya-ek-cihaz': { family: 'finance', label: 'Türk Telekom', accent: '#00a7e8' },
  'fair-finans-limiti-nedir': { family: 'finance', label: 'Fair Finans', accent: '#38bdf8' },
  'defacto-hediye-karti-nedir': { family: 'digital-code', label: 'DeFacto', accent: '#ef4444' },
  'lc-waikiki-hediye-karti-nedir': { family: 'digital-code', label: 'LC Waikiki', accent: '#2563eb' },
  'magaza-hediye-kartlari-rehberi': { family: 'guide', label: 'Mağaza Kartları', accent: '#8b5cf6' },
  'istanbulkart-bakiye-nasil-yuklenir': { family: 'guide', label: 'İstanbulkart', accent: '#06b6d4' },
  'istanbulkart-bozulur-mu': { family: 'security', label: 'İstanbulkart', accent: '#06b6d4' },
  'paycell-ile-razer-gold-nasil-alinir': { family: 'digital-code', label: 'Paycell', accent: '#22d3c5' },
  'google-play-hediye-karti-nedir': { family: 'digital-code', label: 'Google Play', accent: '#34a853' },
  'steam-cuzdan-kodu-nedir': { family: 'digital-code', label: 'Steam', accent: '#1b4f72' },
  'playstation-store-hediye-karti-nedir': { family: 'digital-code', label: 'PlayStation', accent: '#0070d1' },
  'razer-gold-pin-nasil-kullanilir': { family: 'digital-code', label: 'Razer Gold', accent: '#44d62c' },
  'mobil-odeme-bozum-nedir': { family: 'guide', label: 'Temel Rehber', accent: '#fb7185', priority: true },
  'mobil-bozum-yaparken-dolandirilabilir-miyim': { family: 'security', label: 'Güvenlik', accent: '#8b5cf6', priority: true },
  'dijital-kod-bolge-hatasi-nedir': { family: 'security', label: 'Bölge Kontrolü', accent: '#f59e0b' },
  'sky-bozum-iletisim-rehberi': { family: 'guide', label: 'İletişim', accent: '#fb7185' },
  'islem-destegi-nasil-alinir': { family: 'guide', label: 'İşlem Desteği', accent: '#38bdf8' },
  'guncel-bozum-orani-nasil-ogrenilir': { family: 'finance', label: 'Güncel Oran', accent: '#22c55e' },
  'bozum-talebi-nasil-olusturulur': { family: 'guide', label: 'Talep Akışı', accent: '#fb7185' },
  'dijital-kod-teslim-edilince-ne-yapilmali': { family: 'digital-code', label: 'Kod Teslimi', accent: '#f59e0b' },
  'mobil-odeme-guvenli-mi': { family: 'security', label: 'Güvenlik', accent: '#8b5cf6', priority: true },
  'mobil-odeme-limiti-nasil-ogrenilir': { family: 'guide', label: 'Limit Bilgisi', accent: '#5b8cff' },
  'mobil-odeme-limit-sifir-gorunuyor': { family: 'security', label: 'Sorun Çözme', accent: '#ef4444' },
};

export function getArticleVisualMeta(slug: string): ArticleVisualMeta | undefined {
  return visualMap[slug];
}

export const premiumVisualCoverage = {
  phase: 'V45.137 / Öne çıkan, Popüler ve Son eklenen kart kapakları doğrudan public varlıklardan öncelikli yükleniyor',
  upgraded: Object.keys(visualMap).length,
  target: 55,
  families: 7,
};
