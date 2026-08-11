import type { ArticleItem } from './site';
import { getArticleLayoutKind } from './articleLayout';

export type ArticleEditorialTemplate = 'guide' | 'comparison' | 'security';

export function getArticleEditorialTemplate(article: ArticleItem): ArticleEditorialTemplate {
  const kind = getArticleLayoutKind(article);
  if (kind === 'comparison' || kind === 'limits') return 'comparison';
  if (kind === 'security' || kind === 'troubleshooting') return 'security';
  return 'guide';
}

export function getArticleEditorialLabels(template: ArticleEditorialTemplate) {
  if (template === 'comparison') return {
    eyebrow: 'KARŞILAŞTIRMA REHBERİ',
    closeTitle: 'Kararı güncel koşullarla netleştirin.',
    infographicLabel: 'GÖRSEL KARAR ÇERÇEVESİ',
  };
  if (template === 'security') return {
    eyebrow: 'GÜVENLİK REHBERİ',
    closeTitle: 'İşlem öncesi güvenlik kontrolünü tamamlayın.',
    infographicLabel: 'GÖRSEL GÜVENLİK KONTROLÜ',
  };
  return {
    eyebrow: 'UYGULAMALI REHBER',
    closeTitle: 'Rehberden güvenli işleme geçin.',
    infographicLabel: 'GÖRSEL İŞLEM AKIŞI',
  };
}
