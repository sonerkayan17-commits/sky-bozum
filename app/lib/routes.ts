export type StaticRoute = {
  path: `/${string}` | '';
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
};

/**
 * Public, indexable routes that are not generated from content registries.
 * Keep this list as the single source of truth for static sitemap entries.
 */
export const STATIC_ROUTES = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/hizmetler', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/operatorler', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/araclar', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/bilgi-merkezi', changeFrequency: 'daily', priority: 0.85 },
  { path: '/bilgi-merkezi/arama-niyeti', changeFrequency: 'monthly', priority: 0.65 },
  { path: '/bilgi-merkezi/sorun-cozme', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/referanslar', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/is-ortakligi', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/sss', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/iletisim', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/hakkimizda', changeFrequency: 'monthly', priority: 0.65 },
  { path: '/gizlilik-politikasi', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/kullanim-sartlari', changeFrequency: 'monthly', priority: 0.4 },
] as const satisfies readonly StaticRoute[];

export const routePath = {
  service: (slug: string) => `/hizmetler/${slug}` as const,
  article: (slug: string) => `/bilgi-merkezi/${slug}` as const,
  articleCategory: (slug: string) => `/bilgi-merkezi/kategori/${slug}` as const,
  topicHub: (slug: string) => `/bilgi-merkezi/konu/${slug}` as const,
  troubleshooting: (slug: string) => `/bilgi-merkezi/sorun-cozme/${slug}` as const,
} as const;
