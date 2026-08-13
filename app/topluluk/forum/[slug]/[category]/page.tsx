import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommunityTopics from '../../../../components/member/CommunityTopics';
import { findForumCategory, forumSections, getForumStarterTopic, slugifyForumCategory } from '../../../../lib/forumTaxonomy';
import { forumRoutes } from '../../../../lib/forumRoutes';
import ForumBreadcrumbs from '../../../ForumBreadcrumbs';
import './category.css';

export function generateStaticParams() {
  return forumSections.flatMap((section) => section.categories.map((category) => ({ slug: section.slug, category: slugifyForumCategory(category) })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }): Promise<Metadata> {
  const { slug, category } = await params;
  const result = findForumCategory(slug, category);
  return result ? {
    title: `${result.title} - ${result.section.title}`,
    description: `${result.title} hakkında bilgi, soru, deneyim ve topluluk paylaşımları.`,
    alternates: { canonical: forumRoutes.category(slug, category) },
  } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const result = findForumCategory(slug, category);
  if (!result) notFound();
  const starter = getForumStarterTopic(slug, category);

  return <main className="forum-category-page"><div>
    <ForumBreadcrumbs section={{ slug: result.section.slug, title: result.section.title }} category={{ slug: result.slug, title: result.title }} />
    <header><small>{result.section.title}</small><h1>{result.title}</h1><p>Bu alan, {result.title.toLocaleLowerCase('tr-TR')} hakkında doğrulanabilir bilgi, deneyim, soru ve uyarıların düzenli biçimde paylaşılması için ayrılmıştır.</p><div><Link href="/hesabim/yeni-konu">+ Yeni konu aç</Link><Link href={forumRoutes.section(result.section.slug)}>Tüm alt kategoriler</Link></div></header>
    {starter && <article className="forum-starter-topic">
      <span>BAŞLANGIÇ KONUSU</span><h2><Link href={forumRoutes.topic(result.section.slug, result.slug, starter.slug)}>{starter.title}</Link></h2><p>{starter.summary}</p>
      <footer><b>{starter.author}</b><time>{new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${starter.publishedAt}T12:00:00`))}</time></footer>
    </article>}
    <CommunityTopics sectionSlug={result.section.slug} categorySlug={result.slug} />
  </div></main>;
}
