import type { ArticleItem } from './site';

export function slugifyCategory(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function getArticleCategories(articles: ArticleItem[]) {
  const map = new Map<string, { name: string; slug: string; count: number; excerpt: string }>();
  for (const article of articles) {
    const current = map.get(article.category);
    if (current) current.count += 1;
    else map.set(article.category, { name: article.category, slug: slugifyCategory(article.category), count: 1, excerpt: `${article.category} hakkında güncel rehberler, kullanım adımları, limitler ve güvenlik bilgileri.` });
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
}

export function getCategoryBySlug(articles: ArticleItem[], slug: string) {
  return getArticleCategories(articles).find((category) => category.slug === slug);
}
