import type { Metadata } from 'next';
import type { ArticleItem, ServiceItem } from './site';

export const PRODUCTION_SITE_URL = 'https://bozumcu.net';
function normalizeSiteUrl(value?: string) {
  try {
    const parsed = new URL(value || PRODUCTION_SITE_URL);
    if (parsed.protocol !== 'https:') return PRODUCTION_SITE_URL;
    return parsed.origin.replace(/\/$/, '');
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const IS_VERCEL_PREVIEW = process.env.VERCEL_ENV === 'preview' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
export const ALLOW_INDEXING = SITE_URL === PRODUCTION_SITE_URL && !IS_VERCEL_PREVIEW;
export const SITE_NAME = 'Sky Bozum';
export const SITE_LOCALE = 'tr_TR';
export const SITE_LANGUAGE = 'tr-TR';
export const DEFAULT_PUBLISHED_AT = '2026-07-20T09:00:00+03:00';
export const DEFAULT_UPDATED_AT = '2026-07-28T09:00:00+03:00';
export const DEFAULT_OG_IMAGE = '/hero-customer.webp';

export function indexableRobots(noIndex = false): NonNullable<Metadata['robots']> {
  if (noIndex || !ALLOW_INDEXING) return { index: false, follow: false };
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

export type SeoMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  keywords?: readonly string[];
  noIndex?: boolean;
};

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  imageAlt = title,
  type = 'website',
  keywords,
  noIndex = false,
}: SeoMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(image);

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
      images: [{ url: socialImage, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
    robots: indexableRobots(noIndex),
  };
}

export function breadcrumbSchema(items: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(service: ServiceItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl(`/hizmetler/${service.slug}`)}#service`,
    name: service.name,
    alternateName: service.shortName,
    description: service.summary,
    serviceType: service.category,
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    provider: { '@id': `${SITE_URL}/#organization` },
    url: absoluteUrl(`/hizmetler/${service.slug}`),
    mainEntityOfPage: absoluteUrl(`/hizmetler/${service.slug}`),
  };
}

export function articleUrl(article: Pick<ArticleItem, 'slug'>) {
  return absoluteUrl(`/bilgi-merkezi/${article.slug}`);
}

export function articleImage(article: ArticleItem) {
  return absoluteUrl(article.cover ?? `/bilgi-merkezi/${article.slug}/opengraph-image`);
}

export function publishedAt(article: ArticleItem) {
  return article.publishedAt ?? DEFAULT_PUBLISHED_AT;
}

export function updatedAt(article: ArticleItem) {
  return article.updatedAt ?? DEFAULT_UPDATED_AT;
}

export function articleWordCount(article: ArticleItem) {
  const text = [
    article.title,
    article.excerpt,
    ...article.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.bullets ?? []),
      ...(section.subsections?.flatMap((subsection) => [subsection.title, ...subsection.paragraphs]) ?? []),
    ]),
    ...(article.faq?.flatMap((item) => [item.question, item.answer]) ?? []),
  ].join(' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
