import { articles, getService, type ArticleItem } from './site';

export type TopicHub = {
  slug: string;
  name: string;
  description: string;
  serviceSlug?: string;
  articles: ArticleItem[];
};

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
        articles: items,
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
