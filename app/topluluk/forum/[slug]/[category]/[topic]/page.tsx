import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findForumSection, forumStarterTopics, getForumStarterTopic } from '../../../../../lib/forumTaxonomy';
import { forumRoutes } from '../../../../../lib/forumRoutes';
import ForumBreadcrumbs from '../../../../ForumBreadcrumbs';
import './topic.css';

export function generateStaticParams() {
  return forumStarterTopics.map((topic) => ({ slug: topic.sectionSlug, category: topic.categorySlug, topic: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string; topic: string }> }): Promise<Metadata> {
  const { slug, category, topic } = await params;
  const item = getForumStarterTopic(slug, category, topic);
  return item ? {
    title: item.title,
    description: item.summary,
    alternates: { canonical: forumRoutes.topic(slug, category, topic) },
  } : { robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ slug: string; category: string; topic: string }> }) {
  const { slug, category, topic } = await params;
  const item = getForumStarterTopic(slug, category, topic);
  if (!item) notFound();
  const section = findForumSection(slug);
  if (!section) notFound();
  const related = forumStarterTopics.filter((entry) => entry.sectionSlug === slug && entry.slug !== item.slug);
  const date = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${item.publishedAt}T12:00:00`));

  return <main className="forum-topic-page"><article>
    <ForumBreadcrumbs section={{ slug: section.slug, title: section.title }} category={{ slug: category, title: item.category }} topic={item.title} />
    <header><span>YÖNETİM YAYINI</span><h1>{item.title}</h1><p>{item.summary}</p><div><b>{item.author}</b><time>{date}</time></div></header>
    <div className="forum-topic-body">{item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <footer><Link href={forumRoutes.category(slug, category)}>← {item.category} kategorisine dön</Link></footer>
    {related.length > 0 && <aside><h2>Aynı bölümden başlangıç konuları</h2><div>{related.map((entry) => <Link key={entry.slug} href={forumRoutes.topic(entry.sectionSlug, entry.categorySlug, entry.slug)}>{entry.title}</Link>)}</div></aside>}
  </article></main>;
}
