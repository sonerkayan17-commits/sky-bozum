import type { ArticleItem } from './site';

export type LearningLevel = 'Başlangıç' | 'Orta' | 'İleri';

export type LearningPath = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  articleSlugs: string[];
};

export const learningPaths: LearningPath[] = [
  {
    slug: 'mobil-odeme-temelleri',
    title: 'Mobil Ödeme Temelleri',
    description: 'Mobil ödemenin mantığını, limitleri ve operatör bazlı kullanım adımlarını doğru sırayla öğrenin.',
    eyebrow: '6 ADIMLIK SERİ',
    articleSlugs: [
      'mobil-odeme-bozum-nedir',
      'mobil-odeme-limiti-nasil-ogrenilir',
      'vodafone-mobil-odeme-nedir',
      'turkcell-mobil-odeme-nasil-kullanilir',
      'turk-telekom-mobil-odeme-rehberi',
      'mobil-odeme-guvenli-mi',
    ],
  },
  {
    slug: 'razer-gold-rehberi',
    title: 'Razer Gold Rehberi',
    description: 'Kod türünü tanımadan bozum talebine kadar tüm Razer Gold sürecini tek akışta takip edin.',
    eyebrow: '4 ADIMLIK SERİ',
    articleSlugs: [
      'razer-gold-nedir',
      'razer-gold-tl-ve-usd-farki',
      'razer-gold-kodu-nasil-satilir',
      'dijital-kod-satin-almadan-once-kontrol-listesi',
    ],
  },
  {
    slug: 'dijital-kod-guvenligi',
    title: 'Dijital Kod Güvenliği',
    description: 'Kod satın alma, bölge kontrolü, teslim sonrası doğrulama ve dolandırıcılık risklerini birlikte yönetin.',
    eyebrow: '5 ADIMLIK SERİ',
    articleSlugs: [
      'dijital-kod-satin-almadan-once-kontrol-listesi',
      'dijital-kod-bolge-hatasi-nedir',
      'dijital-kod-teslim-edilince-ne-yapilmali',
      'mobil-bozum-yaparken-dolandirilabilir-miyim',
      'mobil-odeme-guvenli-mi',
    ],
  },
  {
    slug: 'islem-ve-destek',
    title: 'İşlem ve Destek Akışı',
    description: 'Oran öğrenme, talep oluşturma ve destek alma adımlarını doğru sırada tamamlayın.',
    eyebrow: '4 ADIMLIK SERİ',
    articleSlugs: [
      'guncel-bozum-orani-nasil-ogrenilir',
      'bozum-talebi-nasil-olusturulur',
      'islem-destegi-nasil-alinir',
      'sky-bozum-iletisim-rehberi',
    ],
  },
];

export function getLearningPathForArticle(article: ArticleItem) {
  return learningPaths.find((path) => path.articleSlugs.includes(article.slug));
}

export function getLearningPathPosition(article: ArticleItem) {
  const path = getLearningPathForArticle(article);
  if (!path) return null;
  const index = path.articleSlugs.indexOf(article.slug);
  return {
    path,
    index,
    position: index + 1,
    total: path.articleSlugs.length,
    previousSlug: index > 0 ? path.articleSlugs[index - 1] : undefined,
    nextSlug: index < path.articleSlugs.length - 1 ? path.articleSlugs[index + 1] : undefined,
  };
}

export function getArticleLearningLevel(article: ArticleItem): LearningLevel {
  const source = `${article.title} ${article.category} ${article.slug}`.toLocaleLowerCase('tr-TR');
  if (/(karşılaştır|fark|limit|risk|güvenli|dolandır|bölge hatası)/.test(source)) return 'Orta';
  if (/(ileri|detay|teknik|sorun çöz)/.test(source)) return 'İleri';
  return 'Başlangıç';
}
