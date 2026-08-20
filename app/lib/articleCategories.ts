import type { ArticleItem } from './site';

export function slugifyCategory(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const categoryDescriptions: Record<string, string> = {
  'mobil-odeme': 'Mobil ödeme açma, operatör limitleri, kullanım adımları, güvenlik kontrolleri ve bozum öncesi karar rehberleri.',
  'dijital-kodlar': 'Razer Gold, Steam ve diğer dijital kodlarda ürün türü, bölge, para birimi, kullanım ve güvenli değerlendirme rehberleri.',
  'hediye-kartlari': 'Hediye kartlarının kullanım alanları, bölge uyumu, bakiye kontrolü, iade koşulları ve güvenli işlem adımları.',
  guvenlik: 'Sahte kanalları ayırt etme, veri paylaşım sınırları, ödeme doğrulama ve şüpheli durumlarda uygulanacak kontroller.',
  kartlar: 'Sanal ve dijital kartlarda limit, internet alışverişi, ödeme reddi ve güvenli kart kullanımı rehberleri.',
  'cihaz-finansmani': 'Cihaz limiti, başvuru koşulları, taksit seçenekleri, değerlendirme ölçütleri ve toplam maliyet karşılaştırmaları.',
  'yemek-kartlari': 'Yemek kartlarında bakiye, geçerli kullanım alanları, online ödeme ve güncel değerlendirme seçenekleri.',
  'ulasim-kartlari': 'Ulaşım kartlarında bakiye yükleme, kullanım, iade ve dijital işlem adımlarına ilişkin açıklayıcı rehberler.',
  iletisim: 'Resmî iletişim kanalları, işlem öncesi hazırlanması gereken bilgiler ve güvenli destek süreci.',
};

export function articleJourneyRank(article: Pick<ArticleItem, 'title' | 'excerpt'>) {
  const value = `${article.title} ${article.excerpt}`.toLocaleLowerCase('tr-TR');
  if (/nedir|temel rehber|başlangıç/.test(value)) return 10;
  if (/nasıl kullanılır|nasıl açılır|nasıl alınır/.test(value)) return 20;
  if (/limit|bakiye|oran|hesapla|nerelerde geçer/.test(value)) return 30;
  if (/güvenli|dikkat|dolandır|risk|kontrol/.test(value)) return 40;
  if (/hata|çalışmıyor|sorun|neden|redded/.test(value)) return 50;
  return 35;
}

export function getArticleCategories(articles: readonly Pick<ArticleItem, 'category'>[]) {
  const map = new Map<string, { name: string; slug: string; count: number; excerpt: string }>();
  for (const article of articles) {
    const current = map.get(article.category);
    if (current) current.count += 1;
    else {
      const slug = slugifyCategory(article.category);
      map.set(article.category, {
        name: article.category,
        slug,
        count: 1,
        excerpt: categoryDescriptions[slug] ?? `${article.category} için temel kavramlar, kullanım adımları, limitler, sorun çözümleri ve güvenlik kontrolleri.`,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
}

export function getCategoryBySlug(articles: ArticleItem[], slug: string) {
  return getArticleCategories(articles).find((category) => category.slug === slug);
}
