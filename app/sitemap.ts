import type { MetadataRoute } from 'next';
import { articles, services } from './lib/site';
import { toolPages } from './lib/tools';
import { getArticleCategories } from './lib/articleCategories';
import { SITE_URL, DEFAULT_UPDATED_AT, updatedAt } from './lib/seo';
import { getTopicHubs } from './lib/topicHubs';
import { troubleshootingGuides } from './lib/troubleshooting';
import { STATIC_ROUTES, routePath } from './lib/routes';
import { communityEditorials } from './lib/communityEditorials';
import { forumSections, slugifyForumCategory } from './lib/forumTaxonomy';

const updated = new Date(DEFAULT_UPDATED_AT);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route.path}`, lastModified: updated, changeFrequency: route.changeFrequency, priority: route.priority })),
    ...toolPages.map((tool) => ({ url: `${SITE_URL}${tool.href}`, lastModified: updated, changeFrequency: 'monthly' as const, priority: .72 })),
    ...services.map((service) => ({ url: `${SITE_URL}${routePath.service(service.slug)}`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .85 })),
    ...troubleshootingGuides.map((guide) => ({ url: `${SITE_URL}${routePath.troubleshooting(guide.slug)}`, lastModified: updated, changeFrequency: 'monthly' as const, priority: .78 })),
    ...getTopicHubs().map((hub) => ({ url: `${SITE_URL}${routePath.topicHub(hub.slug)}`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .8 })),
    ...getArticleCategories(articles).map((category) => ({ url: `${SITE_URL}${routePath.articleCategory(category.slug)}`, lastModified: updated, changeFrequency: 'weekly' as const, priority: .75 })),
    ...articles.map((article) => ({ url: `${SITE_URL}${routePath.article(article.slug)}`, lastModified: new Date(updatedAt(article)), changeFrequency: 'monthly' as const, priority: .7 })),
    ...communityEditorials.map((article) => ({ url: `${SITE_URL}/topluluk/rehber/${article.slug}`, lastModified: new Date('2026-08-12'), changeFrequency: 'monthly' as const, priority: .65 })),
    ...forumSections.map((section) => ({ url: `${SITE_URL}/topluluk/forum/${section.slug}`, lastModified: new Date('2026-08-12'), changeFrequency: 'weekly' as const, priority: .68 })),
    ...forumSections.flatMap((section) => section.categories.map((category) => ({ url: `${SITE_URL}/topluluk/forum/${section.slug}/${slugifyForumCategory(category)}`, lastModified: new Date('2026-08-12'), changeFrequency: 'weekly' as const, priority: .64 }))),
  ];
}
