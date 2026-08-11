import type { ArticleItem } from './site';

export type ArticleLayoutKind =
  | 'definition'
  | 'how-to'
  | 'security'
  | 'limits'
  | 'comparison'
  | 'troubleshooting'
  | 'general';

function normalizedArticleText(article: ArticleItem) {
  return `${article.slug} ${article.title} ${article.category} ${(article.keywords ?? []).join(' ')}`
    .toLocaleLowerCase('tr-TR');
}

export function getArticleLayoutKind(article: ArticleItem): ArticleLayoutKind {
  const text = normalizedArticleText(article);

  if (/karşılaştır|karsilastir|\bmi\b.*\bmi\b|hangisi/.test(text)) return 'comparison';
  if (/limit|ücret|ucret|komisyon|oran/.test(text)) return 'limits';
  if (/güven|guven|dolandır|dolandir|risk|sahte/.test(text)) return 'security';
  if (/hata|sorun|çalışm|calism|neden olm|çözüm|cozum/.test(text)) return 'troubleshooting';
  if (/nasıl|nasil|rehber|adım|adim|açılır|acilir|kullanılır|kullanilir|alınır|alinir|satılır|satilir/.test(text)) return 'how-to';
  if (/nedir|ne demek|temel/.test(text)) return 'definition';
  return 'general';
}

export function getArticleLayout(article: ArticleItem) {
  const kind = getArticleLayoutKind(article);

  return {
    kind,
    showInfoPanel: kind === 'definition' || kind === 'general',
    showProcessMap: kind === 'how-to' || kind === 'troubleshooting',
    showDecisionMatrix: kind === 'limits' || kind === 'comparison' || kind === 'security',
    showPracticalSummary: kind === 'troubleshooting',
  };
}
