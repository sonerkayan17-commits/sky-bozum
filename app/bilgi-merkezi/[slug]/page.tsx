import type { Metadata } from 'next';
import Image from 'next/image';
import ArticleCover from '../../components/articles/ArticleCover';
import ArticleSectionNavigation from '../../components/articles/ArticleSectionNavigation';
import ArticleInfographic from '../../components/articles/ArticleInfographic';
import ArticleVisual from '../../components/articles/ArticleVisual';
import ArticleSupportLink from '../../components/articles/ArticleSupportLink';
import ArticleLearningPath from '../../components/articles/ArticleLearningPath';
import ArticleFeedback from '../../components/articles/ArticleFeedback';
import ReadingProgress from '../../components/articles/ReadingProgress';
import { slugifyCategory } from '../../lib/articleCategories';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '../../components/ShareButtons';
import { articles, getArticle } from '../../lib/site';
import { siteConfig } from '../../lib/site-config';
import { articleImage, articleUrl, articleWordCount, jsonLd, publishedAt, updatedAt } from '../../lib/seo';
import { relatedArticles } from '../../lib/internalLinks';
import { getArticleEditorialLabels, getArticleEditorialTemplate } from '../../lib/articleEditorialTemplate';
import { serviceForArticle } from '../../lib/contentBridges';
import { getHubForArticle } from '../../lib/topicHubs';


function distributeMedia(sectionCount: number, mediaCount: number, reservedSections: number[] = []) {
  if (sectionCount <= 0 || mediaCount <= 0) return new Map<number, number>();

  const blocked = new Set(reservedSections.filter((index) => index >= 0 && index < sectionCount));
  const used = new Set<number>();
  const result = new Map<number, number>();
  const preferred = Array.from({ length: mediaCount }, (_, index) =>
    Math.round((sectionCount - 1) * ((index + 1) / (mediaCount + 1))),
  );

  preferred.forEach((target, mediaIndex) => {
    const candidates = Array.from({ length: sectionCount }, (_, index) => index)
      .filter((index) => !blocked.has(index) && !used.has(index))
      .sort((a, b) => Math.abs(a - target) - Math.abs(b - target));
    const sectionIndex = candidates[0];
    if (sectionIndex === undefined) return;
    used.add(sectionIndex);
    result.set(sectionIndex, mediaIndex);
  });

  return result;
}

function ArticleMedia({ media }: { media: { src: string; alt: string; caption: string } }) {
  const isDiagram = /\.svg(?:$|\?)/i.test(media.src);
  return (
    <figure className="article-inline-visual mx-auto w-full max-w-[760px]">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-[#080d16] shadow-[0_24px_70px_-48px_rgba(56,189,248,.38)] sm:rounded-2xl">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 64px), 760px"
          className={isDiagram ? 'object-contain p-2 sm:p-4' : 'object-cover'}
        />
      </div>
      <figcaption className="mt-3 px-1 text-sm leading-6 text-slate-500">{media.caption}</figcaption>
    </figure>
  );
}

function headingId(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9çğıöşü]+/gi, '-').replace(/^-|-$/g, '');
}

function sectionHeadingId(title: string, index: number) {
  return `bolum-${index + 1}-${headingId(title) || 'icerik'}`;
}

export function generateStaticParams() { return articles.map((article) => ({ slug: article.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const title = article.seoTitle ?? article.title;
  const description = article.metaDescription ?? article.excerpt;
  const image = articleImage(article);
  return {
    title,
    description,
    keywords: article.keywords ? [...article.keywords] : undefined,
    authors: [{ name: siteConfig.name, url: `https://${siteConfig.domain}` }],
    category: article.category,
    alternates: { canonical: `/bilgi-merkezi/${article.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: articleUrl(article),
      siteName: siteConfig.name,
      locale: 'tr_TR',
      publishedTime: publishedAt(article),
      modifiedTime: updatedAt(article),
      section: article.category,
      tags: article.keywords ? [...article.keywords] : [article.category],
      images: [{ url: image, width: 1200, height: 630, alt: article.coverAlt ?? article.title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return notFound();
  const related = relatedArticles(article, 2);
  const relatedService = serviceForArticle(article);
  const topicHub = getHubForArticle(article);
  const canonicalUrl = articleUrl(article);
  const imageUrl = articleImage(article);
  const published = publishedAt(article);
  const modified = updatedAt(article);
  const schemas = [
    { '@type': 'BlogPosting', '@id': `${canonicalUrl}#article`, url: canonicalUrl, headline: article.title, alternativeHeadline: article.seoTitle, description: article.metaDescription ?? article.excerpt, image: { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 }, thumbnailUrl: imageUrl, mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }, datePublished: published, dateModified: modified, inLanguage: 'tr-TR', articleSection: article.category, keywords: article.keywords ? article.keywords.join(', ') : article.category, wordCount: articleWordCount(article), timeRequired: `PT${Math.max(1, parseInt(article.readTime, 10) || 1)}M`, isPartOf: { '@type': 'Blog', '@id': `https://${siteConfig.domain}/bilgi-merkezi#blog`, name: 'Sky Bozum Bilgi Merkezi' }, author: { '@type': 'Organization', '@id': `https://${siteConfig.domain}/#organization`, name: siteConfig.name, url: `https://${siteConfig.domain}` }, publisher: { '@type': 'Organization', '@id': `https://${siteConfig.domain}/#organization`, name: siteConfig.name, url: `https://${siteConfig.domain}` }, about: [{ '@type': 'Thing', name: article.category }, ...(article.keywords ?? []).slice(0, 5).map((keyword) => ({ '@type': 'Thing', name: keyword }))] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `https://${siteConfig.domain}` },
      { '@type': 'ListItem', position: 2, name: 'Bilgi Merkezi', item: `https://${siteConfig.domain}/bilgi-merkezi` },
      { '@type': 'ListItem', position: 3, name: article.category, item: `https://${siteConfig.domain}/bilgi-merkezi/kategori/${slugifyCategory(article.category)}` },
      { '@type': 'ListItem', position: 4, name: article.title, item: canonicalUrl },
    ] },
    ...(article.faq?.length ? [{ '@type': 'FAQPage', mainEntity: article.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }] : []),
  ];
  const articleSchema = { '@context': 'https://schema.org', '@graph': schemas };
  const sectionNavigation = article.sections.map((section, index) => ({ id: sectionHeadingId(section.title, index), title: section.title }));
  const editorialTemplate = getArticleEditorialTemplate(article);
  const editorialLabels = getArticleEditorialLabels(editorialTemplate);
  const infographicAfterSection = editorialTemplate === 'guide' ? 1 : 0;
  const curatedVisualAfterSection = Math.max(infographicAfterSection + 1, Math.min(article.sections.length - 1, Math.round((article.sections.length - 1) * 0.46)));
  const mediaBySection = distributeMedia(
    article.sections.length,
    article.media?.length ?? 0,
    [infographicAfterSection, curatedVisualAfterSection],
  );

  return (
    <main className={`min-h-screen bg-[#090b10] text-white article-template article-template--${editorialTemplate}`}>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <header className="article-editorial-hero relative overflow-hidden border-b border-white/8 py-9 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_0%,rgba(244,63,94,.14),transparent_45%)]" />
        <div className="content-shell relative max-w-6xl">
          <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/" className="focus-ring rounded hover:text-rose-300">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/bilgi-merkezi" className="focus-ring rounded hover:text-rose-300">Bilgi Merkezi</Link><span aria-hidden="true">/</span><Link href={`/bilgi-merkezi/kategori/${slugifyCategory(article.category)}`} className="focus-ring rounded text-slate-300 hover:text-rose-300">{article.category}</Link><span aria-hidden="true">/</span><span aria-current="page" className="max-w-full truncate text-slate-400 sm:max-w-[34rem]">{article.title}</span></nav>
          <div className="article-editorial-hero__content mt-7">
            <span className="article-editorial-hero__eyebrow">{editorialLabels.eyebrow} · {article.category}</span>
            <h1 className="article-editorial-hero__title mt-4">{article.title}</h1>
            <p className="article-editorial-hero__excerpt mt-5">{article.excerpt}</p>
            <div className="article-editorial-hero__meta mt-6 flex flex-wrap items-center gap-3"><span>Okuma süresi: {article.readTime}</span><span>Güncellendi: {new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(modified))}</span><ShareButtons title={article.title} /></div>
            <div className="article-hero-cover mt-7"><ArticleCover article={article} priority /></div>
          </div>
        </div>
      </header>

      <div className="content-shell py-8 sm:py-10">
        <ArticleSectionNavigation sections={sectionNavigation} variant="mobile" />
        <div className="mt-4 grid gap-8 lg:mt-0 lg:grid-cols-[minmax(0,820px)_280px] lg:justify-center">
        <article className="article-reading-surface">
          <ArticleLearningPath article={article} />
          {article.sections.map((section, index) => (
            <div key={section.title}>
              <section className="article-content-section">
                <div className="article-content-section__heading"><span>{String(index + 1).padStart(2, '0')}</span><h2 id={sectionHeadingId(section.title, index)}><a href={`#${sectionHeadingId(section.title, index)}`} className="focus-ring rounded">{section.title}</a></h2></div>
                <div className="article-section-copy mt-5 space-y-5 text-slate-300">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                {section.bullets && <ul className="article-bullet-list">{section.bullets.map((bullet) => <li key={bullet}><span aria-hidden="true">✓</span><p>{bullet}</p></li>)}</ul>}
                {section.subsections?.map((subsection) => <div key={subsection.title} className="article-subsection"><h3>{subsection.title}</h3><div>{subsection.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>)}
              </section>
              {index === infographicAfterSection ? <ArticleInfographic article={article} template={editorialTemplate} label={editorialLabels.infographicLabel} /> : null}
              {index === curatedVisualAfterSection ? <ArticleVisual article={article} index={0} /> : null}
              {mediaBySection.has(index) ? <ArticleMedia media={article.media![mediaBySection.get(index)!]} /> : null}
            </div>
          ))}

          {article.faq?.length ? <section className="article-faq"><p>SIK SORULAN SORULAR</p><h2>{article.title} hakkında sık sorulan sorular</h2><div>{article.faq.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section> : null}

          <ArticleFeedback slug={article.slug} />

          <section className="article-editorial-close" aria-labelledby="article-close-title">
            <div className="article-editorial-close__header"><p>SONRAKİ ADIM</p><h2 id="article-close-title">{editorialLabels.closeTitle}</h2></div>
            <div className="article-editorial-close__rows article-editorial-close__rows--polished">
              <Link href="/bilgi-merkezi" className="focus-ring rounded-md"><span>Geri dön</span><strong>Tüm Bilgi Merkezi rehberleri</strong><b aria-hidden="true">→</b></Link>
              <Link href={`/bilgi-merkezi/kategori/${slugifyCategory(article.category)}`} className="focus-ring rounded-md"><span>Kategoriye dön</span><strong>{article.category}</strong><b aria-hidden="true">→</b></Link>
              {topicHub ? <Link href={`/bilgi-merkezi/konu/${topicHub.slug}`} className="focus-ring rounded-md"><span>Konu merkezine dön</span><strong>{topicHub.name}</strong><b aria-hidden="true">→</b></Link> : null}
              {relatedService ? <Link href={`/hizmetler/${relatedService.slug}`} className="focus-ring rounded-md"><span>İlgili hizmet</span><strong>{relatedService.shortName}</strong><b aria-hidden="true">→</b></Link> : null}
              {related.slice(0, 1).map((item) => <Link key={item.slug} href={`/bilgi-merkezi/${item.slug}`} className="focus-ring rounded-md"><span>Sıradaki rehber</span><strong>{item.title}</strong><b aria-hidden="true">→</b></Link>)}
              <ArticleSupportLink articleTitle={article.title} articleSlug={article.slug} serviceName={relatedService?.shortName} />
            </div>
          </section>
        </article>

        <aside className="article-editorial-sidebar lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          <ArticleSectionNavigation sections={sectionNavigation} variant="desktop" />
          <section className="article-sidebar-support article-sidebar-support--compact"><p>İŞLEM ÖNCESİ</p><h2>{relatedService ? `${relatedService.shortName} için güncel uygunluğu doğrulayın.` : 'Bu rehber için güncel uygunluğu doğrulayın.'}</h2><ArticleSupportLink articleTitle={article.title} articleSlug={article.slug} serviceName={relatedService?.shortName} variant="sidebar" /></section>
        </aside>
        </div>
      </div>
    </main>
  );
}
