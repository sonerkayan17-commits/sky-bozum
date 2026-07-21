import { articles, services, type ArticleItem, type ServiceItem } from './site';
import { toolPages } from './tools';

export type IntentKind = 'tanım' | 'kullanım' | 'limit' | 'bakiye' | 'sorun' | 'güvenlik' | 'hesaplama' | 'sss';
export type IntentPriority = 'yüksek' | 'orta' | 'düşük';

export type SearchIntent = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  kind: IntentKind;
  query: string;
  destinationType: 'makale' | 'hizmet' | 'araç' | 'sss' | 'planlanan-rehber';
  href?: string;
  priority: IntentPriority;
  reason: string;
};

const highValueKinds: IntentKind[] = ['sorun', 'limit', 'bakiye', 'hesaplama'];
const intentLabels: Record<IntentKind, string> = {
  tanım: 'nedir', kullanım: 'nasıl kullanılır', limit: 'limit nasıl öğrenilir', bakiye: 'bakiye nasıl sorgulanır',
  sorun: 'çalışmıyor veya hata veriyor', güvenlik: 'güvenli mi', hesaplama: 'hesaplama', sss: 'sık sorulan sorular',
};

function normalize(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

function articleScore(article: ArticleItem, service: ServiceItem, kind: IntentKind) {
  const haystack = normalize([article.title, article.excerpt, article.category, ...(article.keywords ?? []), ...article.sections.flatMap(s => [s.title, ...s.paragraphs])].join(' '));
  const serviceTerms = [service.shortName, service.name, service.slug.replaceAll('-', ' ')].map(normalize);
  const intentTerms: Record<IntentKind, string[]> = {
    tanım: ['nedir'], kullanım: ['nasil', 'kullan'], limit: ['limit'], bakiye: ['bakiye'], sorun: ['hata', 'calismiyor', 'sorun'],
    güvenlik: ['guvenli', 'dolandiricilik'], hesaplama: ['hesap', 'oran', 'komisyon'], sss: ['sik sorulan', 'soru'],
  };
  return serviceTerms.filter(t => haystack.includes(t)).length * 4 + intentTerms[kind].filter(t => haystack.includes(t)).length * 3 + (article.serviceSlug === service.slug ? 5 : 0);
}

function bestArticle(service: ServiceItem, kind: IntentKind) {
  return articles.map(article => ({ article, score: articleScore(article, service, kind) })).filter(x => x.score > 4).sort((a, b) => b.score - a.score)[0]?.article;
}

function bestTool(kind: IntentKind) {
  if (kind !== 'hesaplama') return undefined;
  return toolPages.find(tool => tool.href.includes('mobil-odeme')) ?? toolPages[0];
}

export const searchIntents: SearchIntent[] = services.flatMap(service => (Object.keys(intentLabels) as IntentKind[]).map(kind => {
  const article = bestArticle(service, kind);
  const tool = bestTool(kind);
  const href = article ? `/bilgi-merkezi/${article.slug}` : tool ? tool.href : kind === 'sss' ? '/sss' : kind === 'tanım' || kind === 'kullanım' ? `/hizmetler/${service.slug}` : undefined;
  const destinationType: SearchIntent['destinationType'] = article ? 'makale' : tool ? 'araç' : kind === 'sss' ? 'sss' : href ? 'hizmet' : 'planlanan-rehber';
  const priority: IntentPriority = highValueKinds.includes(kind) ? 'yüksek' : kind === 'güvenlik' ? 'orta' : 'düşük';
  return {
    id: `${service.slug}-${kind}`,
    serviceSlug: service.slug,
    serviceName: service.shortName,
    kind,
    query: `${service.shortName} ${intentLabels[kind]}`,
    destinationType,
    href,
    priority,
    reason: href ? 'Mevcut içerik ağına bağlandı.' : 'V32–V35 içerik üretim kuyruğuna alınmalı.',
  };
}));

export function getIntentCoverage() {
  const covered = searchIntents.filter(i => Boolean(i.href));
  const missing = searchIntents.filter(i => !i.href);
  return { total: searchIntents.length, covered: covered.length, missing: missing.length, coverage: Math.round((covered.length / searchIntents.length) * 100) };
}

export function getServiceIntentMap(serviceSlug: string) {
  return searchIntents.filter(i => i.serviceSlug === serviceSlug);
}

export function getMissingIntents(limit = 30) {
  const weight: Record<IntentPriority, number> = { yüksek: 3, orta: 2, düşük: 1 };
  return searchIntents.filter(i => !i.href).sort((a, b) => weight[b.priority] - weight[a.priority] || a.query.localeCompare(b.query, 'tr')).slice(0, limit);
}
