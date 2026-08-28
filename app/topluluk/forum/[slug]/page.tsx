import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findForumSection, forumSections, getForumStarterTopic, slugifyForumCategory } from '../../../lib/forumTaxonomy';
import { forumRoutes } from '../../../lib/forumRoutes';
import { createMetadata } from '../../../lib/seo';
import ForumBreadcrumbs from '../../ForumBreadcrumbs';
import './section.css';

export function generateStaticParams() {
  return forumSections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const section = findForumSection(slug);
  return section ? createMetadata({
    title: `${section.title} Forumu`,
    description: `${section.description} Alt kategorilerdeki doğrulanabilir başlangıç rehberlerini, güncel soruları ve topluluk paylaşımlarını inceleyin.`,
    path: forumRoutes.section(slug),
  }) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = findForumSection(slug);
  if (!section) notFound();

  return <main className="forum-section-page"><div>
    <ForumBreadcrumbs section={{ slug: section.slug, title: section.title }} />
    <header>
      <span aria-hidden="true">{section.icon}</span>
      <div><small>FORUM BÖLÜMÜ</small><h1>{section.title}</h1><p>{section.description}</p></div>
      <Link href="/hesabim/yeni-konu">+ Konu aç</Link>
    </header>
    <section className="forum-category-list"><h2>Alt kategoriler</h2>
      {section.categories.map((category, index) => {
        const categorySlug = slugifyForumCategory(category);
        const starter = getForumStarterTopic(section.slug, categorySlug);
        return <article key={category}>
          <Link className="forum-category-hitarea" href={forumRoutes.category(section.slug, categorySlug)} aria-label={`${category} kategorisine git`} />
          <b>{String(index + 1).padStart(2, '0')}</b>
          <div><Link href={forumRoutes.category(section.slug, categorySlug)}><h3>{category}</h3></Link><p>{starter?.summary}</p></div>
          <aside>{starter && <Link href={forumRoutes.topic(section.slug, categorySlug, starter.slug)}>{starter.title}</Link>}<span>Sky Bozum Yönetim</span></aside>
        </article>;
      })}
    </section>
  </div></main>;
}
