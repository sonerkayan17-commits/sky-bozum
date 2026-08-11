import { articles, getService, type ArticleItem } from './site';
import { articleJourneyRank } from './articleCategories';

export type TopicHub = {
  slug: string;
  name: string;
  description: string;
  serviceSlug?: string;
  articles: ArticleItem[];
};

export type TopicHubStage = {
  id: 'baslangic' | 'kullanim' | 'karar' | 'guvenlik' | 'sorun';
  eyebrow: string;
  title: string;
  description: string;
  articles: ArticleItem[];
};

const journeyStages: Omit<TopicHubStage, 'articles'>[] = [
  { id: 'baslangic', eyebrow: '01 · Temel', title: 'Önce sistemi tanıyın', description: 'Kavramları ve işlem modelini kısa temel rehberlerle netleştirin.' },
  { id: 'kullanim', eyebrow: '02 · Uygulama', title: 'Kullanım adımlarına geçin', description: 'Açma, satın alma ve kullanım sürecini doğru sırayla uygulayın.' },
  { id: 'karar', eyebrow: '03 · Karar', title: 'Limit, bakiye ve oranı karşılaştırın', description: 'İşlem öncesinde kullanılabilir tutarı, koşulları ve tahmini sonucu değerlendirin.' },
  { id: 'guvenlik', eyebrow: '04 · Güvenlik', title: 'Riskleri işlemden önce kontrol edin', description: 'Doğru kanal, veri paylaşımı ve ürün uygunluğu kontrollerini tamamlayın.' },
  { id: 'sorun', eyebrow: '05 · Çözüm', title: 'İşlem tamamlanmıyorsa nedeni bulun', description: 'Hata, ret ve gecikme durumlarında güvenli çözüm sırasını izleyin.' },
];

export function getArticleJourneyStages(articles: ArticleItem[]): TopicHubStage[] {
  const buckets = new Map<TopicHubStage['id'], ArticleItem[]>();
  for (const article of articles) {
    const rank = articleJourneyRank(article);
    const id: TopicHubStage['id'] = rank <= 10 ? 'baslangic' : rank <= 20 ? 'kullanim' : rank <= 35 ? 'karar' : rank <= 40 ? 'guvenlik' : 'sorun';
    buckets.set(id, [...(buckets.get(id) ?? []), article]);
  }
  return journeyStages.map(stage => ({ ...stage, articles: buckets.get(stage.id) ?? [] })).filter(stage => stage.articles.length > 0);
}

export function getTopicHubStages(hub: TopicHub): TopicHubStage[] {
  return getArticleJourneyStages(hub.articles);
}

export function getTopicHubs(): TopicHub[] {
  const byService = new Map<string, ArticleItem[]>();
  for (const article of articles) {
    if (!article.serviceSlug) continue;
    const current = byService.get(article.serviceSlug) ?? [];
    current.push(article);
    byService.set(article.serviceSlug, current);
  }

  return [...byService.entries()]
    .filter(([, items]) => items.length >= 2)
    .map(([serviceSlug, items]) => {
      const service = getService(serviceSlug);
      return {
        slug: serviceSlug,
        name: service?.shortName ?? items[0].category,
        description: service?.summary ?? `${items[0].category} hakkında kullanım, limit, güvenlik ve bozum rehberleri.`,
        serviceSlug,
        articles: [...items].sort((a, b) => articleJourneyRank(a) - articleJourneyRank(b) || a.title.localeCompare(b.title, 'tr')),
      };
    })
    .sort((a, b) => b.articles.length - a.articles.length || a.name.localeCompare(b.name, 'tr'));
}

export function getTopicHub(slug: string) {
  return getTopicHubs().find((hub) => hub.slug === slug);
}

export function getHubForArticle(article: ArticleItem) {
  return article.serviceSlug ? getTopicHub(article.serviceSlug) : undefined;
}
