export type CategoryVisual = {
  card: string;
  hero: string;
  cardAlt: string;
  heroAlt: string;
};

const categoryVisuals: Record<string, CategoryVisual> = {
  'mobil-odeme': {
    card: '/images/bilgi-merkezi/category-covers-v47/mobil-odeme-category-card-v2.webp',
    hero: '/images/bilgi-merkezi/category-covers-v47/mobil-odeme-category-card-v2.webp',
    cardAlt: 'Telefon, SIM kart ve güvenli ödeme terminaliyle mobil ödeme kategori görseli',
    heroAlt: 'Mobil ödeme bakiyesinin güvenli doğrulama terminaline aktarılmasını gösteren premium kategori görseli',
  },
  'cihaz-finansmani': {
    card: '/images/bilgi-merkezi/cihaz-finansmani/category/cihaz-finansmani-category-card.webp',
    hero: '/images/bilgi-merkezi/cihaz-finansmani/category/cihaz-finansmani-category-hero.webp',
    cardAlt: 'Telefon, finansman kartı ve güvenlik kalkanıyla cihaz finansmanı kategori görseli',
    heroAlt: 'Telefon, tablet, dizüstü bilgisayar, finansman kartı ve güvenli alışveriş öğeleriyle cihaz finansmanı kategori hero görseli',
  },
  hepsipay: {
    card: '/images/bilgi-merkezi/editorial-covers-v46/dijital-cuzdan-konu-merkezi.webp',
    hero: '/images/bilgi-merkezi/editorial-covers-v46/dijital-cuzdan-konu-merkezi.webp',
    cardAlt: 'Dijital cüzdan, güvenli ödeme ve kontrollü alışveriş akışını gösteren premium kategori görseli',
    heroAlt: 'Dijital cüzdan, harcama limiti ve güvenli ödeme adımlarını gösteren metalik kategori hero görseli',
  },
  'hediye-kartlari': {
    card: '/images/bilgi-merkezi/premium-reference-v1/dijital-kod-hediye-karti-rehberi/dijital-kod-hediye-karti-rehberi-cover.webp',
    hero: '/images/bilgi-merkezi/premium-reference-v1/dijital-kod-hediye-karti-rehberi/dijital-kod-hediye-karti-rehberi-cover.webp',
    cardAlt: 'Dijital hediye kartları ve güvenli kod kullanımını gösteren premium kategori görseli',
    heroAlt: 'Hediye kartı, dijital kod ve güvenli kullanım ekosistemini gösteren premium kategori görseli',
  },
  'yemek-kartlari': {
    card: '/images/bilgi-merkezi/yemek-kartlari/pluxee-sodexo-nedir-nerelerde-gecer/pluxee-sodexo-nedir-nerelerde-gecer-card.svg',
    hero: '/article-covers-v32-2/yemek-kartlari-bozdurulur-mu.svg',
    cardAlt: 'Yemek kartı bakiyesi ve kullanım alanlarını anlatan kategori görseli',
    heroAlt: 'Yemek kartlarının kullanım, bakiye ve değerlendirme sürecini anlatan kategori görseli',
  },
  'dijital-kodlar': {
    card: '/blog-covers/dijital-kodlar-premium.svg',
    hero: '/blog-covers/dijital-kod-hediye-karti.svg',
    cardAlt: 'Razer Gold, Steam ve hediye kartlarını temsil eden dijital kod kategori görseli',
    heroAlt: 'Dijital kod satın alma, doğrulama ve güvenli kullanım akışını anlatan kategori görseli',
  },
  hadi: {
    card: '/images/bilgi-merkezi/hadi/hadi-nedir-nasil-kullanilir/hadi-nedir-nasil-kullanilir-card.svg',
    hero: '/images/bilgi-merkezi/hadi/hadi-kredi-karti-limiti/hadi-kredi-karti-limiti-premium-cover.svg',
    cardAlt: 'Hadi kart, limit ve ödeme özelliklerini gösteren kategori görseli',
    heroAlt: 'Hadi kart, kredi limiti ve alışveriş kullanımını gösteren premium kategori görseli',
  },
  iletisim: {
    card: '/images/bilgi-merkezi/editorial-covers-v46/sky-bozum-iletisim-logo-free-v3.webp',
    hero: '/images/bilgi-merkezi/editorial-covers-v46/islem-destegi-logo-free-v3.webp',
    cardAlt: 'İşlem talebi, destek ve iletişim akışını gösteren kategori görseli',
    heroAlt: 'Sky Bozum iletişim ve işlem desteği adımlarını gösteren kategori görseli',
  },
  kredim: {
    card: '/images/bilgi-merkezi/kredim/kredim-nedir-limiti-nasil-alinir/kredim-nedir-limiti-nasil-alinir-card.svg',
    hero: '/article-covers-v32-2/kredim-limiti-nerelerde-gecer.svg',
    cardAlt: 'Kredim limiti, kart ve kullanım alanlarını anlatan kategori görseli',
    heroAlt: 'Kredim başvuru, limit ve kullanım sürecini anlatan kategori görseli',
  },
  'razer-gold': {
    card: '/images/bilgi-merkezi/category-covers-v47/razer-gold-category-card-v2.webp',
    hero: '/images/bilgi-merkezi/category-covers-v47/razer-gold-category-card-v2.webp',
    cardAlt: 'Razer Gold kodu ve güvenli PIN kontrolünü gösteren premium kategori görseli',
    heroAlt: 'Razer Gold kod doğrulama ve güvenli değerlendirme sürecini anlatan premium kategori görseli',
  },
  'ulasim-kartlari': {
    card: '/images/bilgi-merkezi/editorial-covers-v46/istanbulkart-bakiye-uygunluk.webp',
    hero: '/images/bilgi-merkezi/editorial-covers-v46/istanbulkart-bakiye-uygunluk.webp',
    cardAlt: 'İstanbulkart ve ulaşım kartı bakiyesini gösteren kategori görseli',
    heroAlt: 'Ulaşım kartı bakiye yükleme ve kullanım adımlarını anlatan kategori görseli',
  },
  guvenlik: {
    card: '/images/bilgi-merkezi/premium-reference-v1/mobil-odeme-guvenli-mi/mobil-odeme-guvenli-mi-cover.webp',
    hero: '/images/bilgi-merkezi/v40-guide-system/article-infographics/mobil-odeme-guvenlik-kontrol-listesi.webp',
    cardAlt: 'Mobil ödeme güvenliği, risk kontrolü ve doğrulama adımlarını gösteren kategori görseli',
    heroAlt: 'Güvenli mobil ödeme ve bozum için kontrol listesini gösteren kategori görseli',
  },
  paycell: {
    card: '/images/bilgi-merkezi/editorial-covers-v46/paycell-bakiye-limit-bozum.webp',
    hero: '/images/bilgi-merkezi/editorial-covers-v46/paycell-bakiye-limit-bozum.webp',
    cardAlt: 'Paycell kart, mobil cüzdan ve Razer Gold satın alma sürecini gösteren kategori görseli',
    heroAlt: 'Paycell kart kullanımı, limit ve dijital ürün alışverişini anlatan kategori görseli',
  },
  pokus: {
    card: '/article-covers-v32-5/pokus-nedir-razer-gold-nasil-alinir.svg',
    hero: '/article-covers-v32-5/pokus-nedir-razer-gold-nasil-alinir.svg',
    cardAlt: 'Pokus kart ve Razer Gold satın alma adımlarını gösteren kategori görseli',
    heroAlt: 'Pokus kart kullanımı ve dijital ürün değerlendirme sürecini anlatan kategori görseli',
  },
  kartlar: {
    card: '/blog-covers/dijital-odeme-guvenligi.webp',
    hero: '/blog-covers/dijital-odeme-guvenligi.webp',
    cardAlt: 'Sanal kart, ödeme güvenliği ve dijital alışverişi gösteren kategori görseli',
    heroAlt: 'Kart işlemleri, güvenli ödeme ve dijital alışveriş kontrollerini anlatan kategori görseli',
  },
  apple: {
    card: '/images/bilgi-merkezi/premium-reference-v1/dijital-kod-hediye-karti-rehberi/dijital-kod-hediye-karti-rehberi-cover.webp',
    hero: '/blog-covers/dijital-kod-hediye-karti.svg',
    cardAlt: 'Apple Gift Card ve dijital hediye kartı kullanımını gösteren kategori görseli',
    heroAlt: 'Apple kodları, bölge kontrolü ve güvenli kullanım sürecini anlatan kategori görseli',
  },
  steam: {
    card: '/images/bilgi-merkezi/hediye-kartlari/steam-cuzdan-kodu-nedir/steam-cuzdan-kodu-nedir-card.svg',
    hero: '/images/bilgi-merkezi/hediye-kartlari/steam-cuzdan-kodu-nedir/steam-cuzdan-kodu-nedir-card.svg',
    cardAlt: 'Steam cüzdan kodu ve dijital oyun bakiyesini gösteren kategori görseli',
    heroAlt: 'Steam kodu, bölge ve para birimi kontrollerini anlatan kategori görseli',
  },
  vodafone: {
    card: '/images/bilgi-merkezi/vodafone/category/vodafone-category-card.webp',
    hero: '/images/bilgi-merkezi/vodafone/category/vodafone-category-hero.webp',
    cardAlt: 'Vodafone mobil ödeme, güvenlik ve dijital alışveriş temalı premium kategori kartı',
    heroAlt: 'Vodafone mobil ödeme kullanımını, güvenliği ve işlem akışını anlatan premium kategori hero görseli',
  },
  turkcell: {
    card: '/images/bilgi-merkezi/turkcell/category/turkcell-category-card.webp',
    hero: '/images/bilgi-merkezi/turkcell/category/turkcell-category-hero.webp',
    cardAlt: 'Turkcell mobil ödeme ve güvenli dijital alışveriş temalı premium kategori kartı',
    heroAlt: 'Turkcell mobil ödeme kullanımını ve operatör güvencesini anlatan premium kategori hero görseli',
  },
  'turk-telekom': {
    card: '/images/bilgi-merkezi/turk-telekom/category/turk-telekom-category-card.webp',
    hero: '/images/bilgi-merkezi/turk-telekom/category/turk-telekom-category-hero.webp',
    cardAlt: 'Türk Telekom mobil ödeme ve dijital servis temalı premium kategori kartı',
    heroAlt: 'Türk Telekom mobil ödeme kullanımını ve güvenli işlem akışını anlatan premium kategori hero görseli',
  },
};

export function getCategoryVisual(slug: string): CategoryVisual | undefined {
  return categoryVisuals[slug];
}
