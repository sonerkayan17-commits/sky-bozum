import type { ArticleItem } from './site';
import { articles } from './site';

function normalize(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokens(article: ArticleItem) {
  return new Set(normalize([
    article.title,
    article.excerpt,
    article.category,
    article.serviceSlug ?? '',
    ...(article.keywords ?? []),
    ...article.sections.flatMap((section) => [section.title, ...(section.subsections?.map((item) => item.title) ?? [])]),
  ].join(' ')).split(/\s+/).filter((token) => token.length > 2));
}

export function relatedArticles(article: ArticleItem, limit = 6) {
  const sourceTokens = tokens(article);
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const candidateTokens = tokens(candidate);
      let shared = 0;
      for (const token of sourceTokens) if (candidateTokens.has(token)) shared += 1;
      const score = shared
        + (candidate.category === article.category ? 18 : 0)
        + (candidate.serviceSlug && candidate.serviceSlug === article.serviceSlug ? 24 : 0)
        + ((candidate.keywords ?? []).some((keyword) => normalize(article.title).includes(normalize(keyword))) ? 5 : 0);
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title, 'tr'))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function sectionRelatedArticles(article: ArticleItem, sectionTitle: string, limit = 2) {
  const sectionTokens = new Set(normalize(sectionTitle).split(/\s+/).filter((token) => token.length > 2));
  return relatedArticles(article, 12)
    .map((candidate) => {
      const candidateText = normalize([candidate.title, candidate.excerpt, ...(candidate.keywords ?? [])].join(' '));
      const score = [...sectionTokens].filter((token) => candidateText.includes(token)).length;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .filter(({ score }) => score > 0)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
