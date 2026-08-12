import { NextResponse } from 'next/server';
import { articles } from '../../lib/site';
import { getManagedContentArticles, mergeManagedArticles } from '../../lib/managedContent';

export const revalidate = 60;

export async function GET() {
  const managed = await getManagedContentArticles();
  const visible = mergeManagedArticles(articles, managed);
  return NextResponse.json(
    visible.map((article) => ({
      title: article.title,
      description: article.excerpt,
      href: `/bilgi-merkezi/${article.slug}`,
      type: 'Makale' as const,
      keywords: [article.category, ...(article.keywords || []), ...article.sections.map((section) => section.title)],
    })),
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}
