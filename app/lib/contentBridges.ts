import type { ArticleItem, ServiceItem } from './site';
import { articles, getService, services } from './site';

const faqCategoryArticleSlugs: Record<string, string> = {
  'Mobil Ödeme Bozum': 'mobil-odeme-nasil-acilir',
  'Vodafone Mobil Ödeme': 'vodafone-mobil-odeme-nedir',
  'Turkcell Mobil Ödeme': 'turkcell-mobil-odeme-nasil-kullanilir',
  'Türk Telekom Mobil Ödeme': 'turk-telekom-mobil-odeme-rehberi',
  Paycell: 'paycell-nedir-nasil-kullanilir',
  Pokus: 'pokus-nedir-razer-gold-nasil-alinir',
  'Razer Gold TL': 'razer-gold-nedir',
  'Razer Gold USD': 'razer-gold-nedir',
  'Apple Gift Card': 'dijital-kod-hediye-karti-rehberi',
  Steam: 'dijital-kod-hediye-karti-rehberi',
  'Kod Kontrolü': 'dijital-kod-hediye-karti-rehberi',
  Güvenlik: 'mobil-odeme-guvenli-mi',
  'Dolandırıcılıktan Korunma': 'mobil-bozum-yaparken-dolandirilabilir-miyim',
  'Hat ve Fatura Limitleri': 'mobil-odeme-nasil-acilir',
  'Bozum Oranları': 'guncel-bozum-orani-nasil-ogrenilir',
  'Komisyon ve Net Ödeme': 'guncel-bozum-orani-nasil-ogrenilir',
};

const toolBridgeMap: Record<string, { serviceSlug?: string; articleSlug: string }> = {
  'mobil-odeme': { serviceSlug: 'vodafone-mobil-odeme', articleSlug: 'mobil-odeme-nasil-acilir' },
  'hedef-odeme': { articleSlug: 'guncel-bozum-orani-nasil-ogrenilir' },
  'oran-karsilastirma': { articleSlug: 'guncel-bozum-orani-nasil-ogrenilir' },
  'kod-adedi': { serviceSlug: 'razer-gold-tl', articleSlug: 'razer-gold-nedir' },
  'gift-card': { serviceSlug: 'itunes-apple', articleSlug: 'dijital-kod-hediye-karti-rehberi' },
  sms: { serviceSlug: 'sms-mobil-odeme', articleSlug: 'mobil-odeme-nasil-acilir' },
  'cihaz-maliyeti': { serviceSlug: 'vodafone-mobil-odeme', articleSlug: 'mobil-odeme-nasil-acilir' },
  'islem-sihirbazi': { articleSlug: 'mobil-odeme-bozum-nedir' },
};

export function serviceForArticle(article: ArticleItem): ServiceItem | undefined {
  if (article.serviceSlug) return getService(article.serviceSlug);
  const text = `${article.title} ${article.category} ${(article.keywords ?? []).join(' ')}`.toLocaleLowerCase('tr-TR');
  const inferred = services.find((service) => {
    const terms = [service.shortName, service.name, service.slug.replaceAll('-', ' ')].map((value) => value.toLocaleLowerCase('tr-TR'));
    return terms.some((term) => term.length > 3 && text.includes(term));
  });
  return inferred;
}

export function guidesForService(serviceSlug: string, limit = 5) {
  const direct = articles.filter((article) => article.serviceSlug === serviceSlug);
  if (direct.length >= limit) return direct.slice(0, limit);
  const service = getService(serviceSlug);
  if (!service) return direct.slice(0, limit);
  const terms = [service.shortName, service.name, service.slug.replaceAll('-', ' ')].map((value) => value.toLocaleLowerCase('tr-TR'));
  const inferred = articles.filter((article) => {
    if (direct.some((item) => item.slug === article.slug)) return false;
    const haystack = `${article.title} ${article.excerpt} ${(article.keywords ?? []).join(' ')}`.toLocaleLowerCase('tr-TR');
    return terms.some((term) => term.length > 3 && haystack.includes(term));
  });
  return [...direct, ...inferred].slice(0, limit);
}

export function faqArticle(category: string) {
  const slug = faqCategoryArticleSlugs[category];
  return slug ? articles.find((article) => article.slug === slug) : undefined;
}

export function toolBridge(toolId: string) {
  const bridge = toolBridgeMap[toolId];
  if (!bridge) return undefined;
  return {
    article: articles.find((article) => article.slug === bridge.articleSlug),
    service: bridge.serviceSlug ? getService(bridge.serviceSlug) : undefined,
  };
}
