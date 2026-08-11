import { articles, services, type ArticleItem, type ServiceItem } from './site';

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

function applicableIntentKinds(service: ServiceItem): IntentKind[] {
  const category = normalize(service.category);
  const slug = normalize(service.slug);
  if (category.includes('dijital kod')) return ['tanım', 'kullanım', 'sorun', 'güvenlik', 'hesaplama', 'sss'];
  if (slug.includes('kart-islem') || category.includes('kart islemleri')) return ['kullanım', 'sorun', 'güvenlik', 'sss'];
  if (slug.includes('paycell') || slug.includes('pokus') || slug.includes('mobil-odeme')) {
    return ['tanım', 'kullanım', 'limit', 'bakiye', 'sorun', 'güvenlik', 'hesaplama', 'sss'];
  }
  return ['tanım', 'kullanım', 'limit', 'sorun', 'güvenlik', 'hesaplama', 'sss'];
}

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
  const serviceMatches = serviceTerms.filter(t => haystack.includes(t)).length;
  const intentMatches = intentTerms[kind].filter(t => haystack.includes(t)).length;
  const exactService = article.serviceSlug === service.slug;

  // Bir hizmete ait genel makaleyi bütün niyetler için yeterli sayma.
  // Eşleşme, hem hizmet bağlamını hem de aranan niyeti açıkça taşımalı.
  if (!exactService && serviceMatches === 0) return 0;
  if (intentMatches === 0) return 0;

  return serviceMatches * 4 + intentMatches * 5 + (exactService ? 6 : 0);
}

function bestArticle(service: ServiceItem, kind: IntentKind) {
  return articles
    .map(article => ({ article, score: articleScore(article, service, kind) }))
    .filter(x => x.score >= 11)
    .sort((a, b) => b.score - a.score)[0]?.article;
}


export const searchIntents: SearchIntent[] = services.flatMap(service => applicableIntentKinds(service).map(kind => {
  const article = bestArticle(service, kind);
  const href = article ? `/bilgi-merkezi/${article.slug}` : kind === 'tanım' || kind === 'kullanım' ? `/bilgi-merkezi/konu/${service.slug}` : undefined;
  const destinationType: SearchIntent['destinationType'] = article ? 'makale' : href ? 'hizmet' : 'planlanan-rehber';
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
