import type { MetadataRoute } from 'next';
import { articles, services } from './lib/site';
import { toolPages } from './lib/tools';
import { getArticleCategories } from './lib/articleCategories';
import { ALLOW_INDEXING, SITE_URL, DEFAULT_UPDATED_AT, updatedAt } from './lib/seo';
import { getTopicHubs } from './lib/topicHubs';
import { troubleshootingGuides } from './lib/troubleshooting';
import { STATIC_ROUTES, routePath } from './lib/routes';
import { forumSections, forumStarterTopics, slugifyForumCategory } from './lib/forumTaxonomy';
import { siteFeatures } from './lib/features';
import { products } from './lib/products';

const updated = new Date(DEFAULT_UPDATED_AT);

export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING) return [];
  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route.path}`, lastModified: updated, changeFrequency: route.changeFrequency, priority: route.priority })),
    ...toolPages.map((tool) => ({ url: `${SITE_URL}${tool.href}`, lastModified: updated, changeFrequency: 'monthly' as const, priority: .72 })),
    ...services.map((service) => ({ url: `${SITE_URL}${routePath.service(service.slug)}`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .85 })),
    { url: `${SITE_URL}/urunler`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .82 },
    ...products.map((product) => ({ url: `${SITE_URL}/urunler/${product.slug}`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .78 })),
    ...troubleshootingGuides.map((guide) => ({ url: `${SITE_URL}${routePath.troubleshooting(guide.slug)}`, lastModified: updated, changeFrequency: 'monthly' as const, priority: .78 })),
    ...getTopicHubs().map((hub) => ({ url: `${SITE_URL}${routePath.topicHub(hub.slug)}`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .8 })),
    ...getArticleCategories(articles).map((category) => ({ url: `${SITE_URL}${routePath.articleCategory(category.slug)}`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .75 })),
    ...articles.map((article) => ({ url: `${SITE_URL}${routePath.article(article.slug)}`, lastModified: new Date(updatedAt(article)), changeFrequency: 'monthly' as const, priority: .7 })),
    ...(siteFeatures.communityForum ? [
      { url: `${SITE_URL}/topluluk`, lastModified: new Date('2026-08-13'), changeFrequency: 'weekly' as const, priority: .72 },
      ...forumSections.map((section) => ({ url: `${SITE_URL}/topluluk/forum/${section.slug}`, lastModified: new Date('2026-08-13'), changeFrequency: 'weekly' as const, priority: .68 })),
      ...forumSections.flatMap((section) => section.categories.map((category) => ({ url: `${SITE_URL}/topluluk/forum/${section.slug}/${slugifyForumCategory(category)}`, lastModified: new Date('2026-08-13'), changeFrequency: 'weekly' as const, priority: .64 }))),
      ...forumStarterTopics.map((topic) => ({ url: `${SITE_URL}/topluluk/forum/${topic.sectionSlug}/${topic.categorySlug}/${topic.slug}`, lastModified: new Date(topic.publishedAt), changeFrequency: 'monthly' as const, priority: .6 })),
    ] : []),
  ];
}
