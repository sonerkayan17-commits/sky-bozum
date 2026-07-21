import type { Metadata } from 'next';
import Image from 'next/image';
import ArticleCover from '../../components/articles/ArticleCover';
import ArticleFeedback from '../../components/articles/ArticleFeedback';
import ArticleVisual from '../../components/articles/ArticleVisual';
import ReadingProgress from '../../components/articles/ReadingProgress';
import SectionRelatedLinks from '../../components/articles/SectionRelatedLinks';
import { slugifyCategory } from '../../lib/articleCategories';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '../../components/ShareButtons';
import { articles, getArticle, getService, siteConfig } from '../../lib/site';
import { articleImage, articleUrl, articleWordCount, jsonLd, publishedAt, updatedAt } from '../../lib/seo';
import { relatedArticles, sectionRelatedArticles } from '../../lib/internalLinks';
import { getHubForArticle } from '../../lib/topicHubs';

function headingId(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9çğıöşü]+/gi, '-').replace(/^-|-$/g, '');
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
  if (!article) notFound();
  const service = article.serviceSlug ? getService(article.serviceSlug) : undefined;
  const related = relatedArticles(article, 6);
  const topicHub = getHubForArticle(article);
  const articleIndex = articles.findIndex((item) => item.slug === article.slug);
  const previousArticle = articleIndex > 0 ? articles[articleIndex - 1] : undefined;
  const nextArticle = articleIndex >= 0 && articleIndex < articles.length - 1 ? articles[articleIndex + 1] : undefined;
  const canonicalUrl = articleUrl(article);
  const imageUrl = articleImage(article);
  const published = publishedAt(article);
  const modified = updatedAt(article);
  const schemas = [
    { '@type': 'BlogPosting', '@id': `${canonicalUrl}#article`, url: canonicalUrl, headline: article.title, alternativeHeadline: article.seoTitle, description: article.metaDescription ?? article.excerpt, image: { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 }, thumbnailUrl: imageUrl, mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }, datePublished: published, dateModified: modified, inLanguage: 'tr-TR', articleSection: article.category, keywords: article.keywords ? article.keywords.join(', ') : article.category, wordCount: articleWordCount(article), timeRequired: `PT${Math.max(1, parseInt(article.readTime, 10) || 1)}M`, isPartOf: { '@type': 'Blog', '@id': `https://${siteConfig.domain}/bilgi-merkezi#blog`, name: 'Sky Bozum Bilgi Merkezi' }, author: { '@type': 'Organization', '@id': `https://${siteConfig.domain}/#organization`, name: siteConfig.name, url: `https://${siteConfig.domain}` }, publisher: { '@type': 'Organization', '@id': `https://${siteConfig.domain}/#organization`, name: siteConfig.name, url: `https://${siteConfig.domain}`, logo: { '@type': 'ImageObject', url: `https://${siteConfig.domain}/brand-logo.webp` } }, about: [{ '@type': 'Thing', name: article.category }, ...(article.keywords ?? []).slice(0, 5).map((keyword) => ({ '@type': 'Thing', name: keyword }))] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `https://${siteConfig.domain}` },
      { '@type': 'ListItem', position: 2, name: 'Bilgi Merkezi', item: `https://${siteConfig.domain}/bilgi-merkezi` },
      { '@type': 'ListItem', position: 3, name: article.category, item: `https://${siteConfig.domain}/bilgi-merkezi/kategori/${slugifyCategory(article.category)}` },
      { '@type': 'ListItem', position: 4, name: article.title, item: canonicalUrl },
    ] },
    ...(article.faq?.length ? [{ '@type': 'FAQPage', mainEntity: article.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }] : []),
  ];
  const articleSchema = { '@context': 'https://schema.org', '@graph': schemas };

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <header className="relative overflow-hidden border-b border-white/8 py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_0%,rgba(244,63,94,.14),transparent_45%)]" />
        <div className="content-shell relative max-w-6xl">
          <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/" className="focus-ring rounded hover:text-rose-300">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/bilgi-merkezi" className="focus-ring rounded hover:text-rose-300">Bilgi Merkezi</Link><span aria-hidden="true">/</span><Link href={`/bilgi-merkezi/kategori/${slugifyCategory(article.category)}`} className="focus-ring rounded text-slate-300 hover:text-rose-300">{article.category}</Link></nav>
          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-rose-400/15 bg-rose-500/[0.07] px-3 py-1.5 text-xs font-extrabold text-rose-300">{article.category}</span>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">{article.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">{article.excerpt}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4"><span className="text-xs font-bold text-slate-500">Okuma süresi: {article.readTime}</span><span className="text-xs font-bold text-slate-500">Güncellendi: {new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(modified))}</span><ShareButtons title={article.title} /></div>
            </div>
            <div className="article-hero-cover"><ArticleCover article={article} priority /></div>
          </div>
        </div>
      </header>

      <div className="content-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,820px)_320px] lg:justify-center">
        <article className="premium-card p-6 sm:p-9">
          {article.sections.map((section, index) => (
            <div key={section.title}>
              <section className={index ? 'mt-10 border-t border-white/8 pt-10' : ''}>
                <h2 id={headingId(section.title)} className="scroll-mt-28 text-2xl font-black leading-tight tracking-tight sm:text-3xl"><a href={`#${headingId(section.title)}`} className="focus-ring rounded decoration-rose-400/60 hover:underline">{section.title}</a></h2>
                <div className="mt-5 space-y-5 text-[15px] leading-8 text-slate-300">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                {section.bullets && <ul className="mt-6 space-y-3">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.025] p-4 text-sm leading-6 text-slate-300"><span className="font-black text-rose-400">✓</span>{bullet}</li>)}</ul>}
                {section.subsections?.map((subsection) => <div key={subsection.title} className="mt-7 rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6"><h3 className="text-xl font-black tracking-tight text-white">{subsection.title}</h3><div className="mt-3 space-y-4 text-[15px] leading-8 text-slate-300">{subsection.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>)}
                {[1, 3, 6].includes(index) && <SectionRelatedLinks items={sectionRelatedArticles(article, section.title)} />}
              </section>
              {article.media?.[index === 1 ? 0 : index === 5 ? 1 : -1] ? (() => { const media = article.media![index === 1 ? 0 : 1]; return <figure className="article-inline-visual"><div className="relative aspect-[16/9] overflow-hidden rounded-2xl"><Image src={media.src} alt={media.alt} fill sizes="(max-width: 1023px) 100vw, 820px" className="object-cover" /></div><figcaption>{media.caption}</figcaption></figure>; })() : ([1, 4].includes(index) ? <ArticleVisual article={article} index={index === 1 ? 0 : 1} /> : null)}
            </div>
          ))}

          {article.links?.length ? <section className="mt-10 border-t border-white/8 pt-10"><h2 className="text-2xl font-black">İlgili hizmet bağlantıları</h2><p className="mt-3 text-sm leading-7 text-slate-400">Rehberde anlatılan işlem türleri için ilgili hizmet sayfalarını doğal akış içinde inceleyin.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{article.links.map((link) => <Link key={link.href} href={link.href} className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] p-4 text-sm font-extrabold transition hover:-translate-y-0.5 hover:border-rose-400/30 hover:bg-rose-500/[0.04]"><span>{link.label}</span><span className="text-rose-400 transition group-hover:translate-x-1">→</span></Link>)}</div></section> : null}

          {article.faq?.length ? <section className="mt-10 border-t border-white/8 pt-10"><h2 className="text-2xl font-black">Sık Sorulan Sorular</h2><div className="mt-5 space-y-3">{article.faq.map((item) => <details key={item.question} className="group rounded-2xl border border-white/8 bg-white/[0.025] p-5"><summary className="cursor-pointer list-none pr-8 text-base font-extrabold text-white">{item.question}</summary><p className="mt-3 text-sm leading-7 text-slate-400">{item.answer}</p></details>)}</div></section> : null}

          <div className="mt-10 rounded-2xl border border-amber-400/15 bg-amber-500/[0.05] p-5"><h2 className="text-sm font-extrabold text-amber-300">Güvenlik notu</h2><p className="mt-2 text-sm leading-7 text-slate-400">Dijital kodları herkese açık alanda paylaşmayın. Kod veya bakiye göndermeden önce hizmet uygunluğunu ve güncel oranı yazılı olarak teyit edin. Operatör ayarları ve limitler değişebileceğinden kesin durum için resmi operatör kanalını kullanın.</p></div>

          <section className="article-author" aria-labelledby="article-author-title"><div className="article-author__mark">SB</div><div><p className="article-author__eyebrow">Editoryal ekip</p><h2 id="article-author-title">Sky Bozum Bilgi Merkezi</h2><p>Bu içerik; kullanıcıların işlem türlerini, limitleri ve güvenlik adımlarını daha açık anlaması için hazırlanır. Değişebilen koşullar düzenli olarak kontrol edilir ve gerektiğinde güncellenir.</p></div></section>

          <ArticleFeedback slug={article.slug} />

          {(previousArticle || nextArticle) && <nav aria-label="Önceki ve sonraki makale" className="article-pagination">{previousArticle ? <Link href={`/bilgi-merkezi/${previousArticle.slug}`} className="article-pagination__item"><span>← Önceki rehber</span><strong>{previousArticle.title}</strong></Link> : <span />}{nextArticle ? <Link href={`/bilgi-merkezi/${nextArticle.slug}`} className="article-pagination__item article-pagination__item--next"><span>Sonraki rehber →</span><strong>{nextArticle.title}</strong></Link> : <span />}</nav>}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Bu yazıda" className="premium-card p-6"><h2 className="text-lg font-black">Bu yazıda</h2><ol className="mt-4 space-y-3">{article.sections.map((section, index) => <li key={section.title}><a href={`#${headingId(section.title)}`} className="focus-ring flex min-h-11 items-center gap-3 rounded-lg text-sm font-bold text-slate-400 transition hover:text-rose-300"><span className="text-xs text-rose-400">{String(index + 1).padStart(2, '0')}</span>{section.title}</a></li>)}</ol></nav>
          {topicHub && <div className="premium-card p-6"><p className="text-xs font-extrabold uppercase tracking-[0.15em] text-rose-400">Konu merkezi</p><h2 className="mt-3 text-xl font-black">{topicHub.name}</h2><p className="mt-3 text-sm leading-6 text-slate-400">Bu konuya bağlı {topicHub.articles.length} rehberi tek merkezde inceleyin.</p><Link href={`/bilgi-merkezi/konu/${topicHub.slug}`} className="mt-5 inline-flex w-full justify-center rounded-xl border border-rose-400/20 bg-rose-500/[0.05] px-5 py-3 text-sm font-extrabold text-rose-200 transition hover:bg-rose-500/[0.1]">Konu merkezine git</Link></div>}
          {service && <div className="premium-card p-6"><p className="text-xs font-extrabold uppercase tracking-[0.15em] text-rose-400">İlgili hizmet</p><h2 className="mt-3 text-xl font-black">{service.name}</h2><p className="mt-3 text-sm leading-6 text-slate-400">Bilgilendirme oranı: <strong className="text-white">{service.rate}</strong></p><Link href={`/hizmetler/${service.slug}`} className="mt-5 inline-flex w-full justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold transition hover:border-rose-400/25">Hizmeti incele</Link></div>}
          <div className="premium-card p-6"><h2 className="text-xl font-black">Kesin oranı öğrenin</h2><p className="mt-3 text-sm leading-7 text-slate-400">Ürün türünü ve tutarı paylaşın; işleme başlamadan önce güncel koşulları alın.</p><a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-5 py-3 text-sm font-extrabold">WhatsApp ile yazın</a></div>
        </aside>
      </div>

      {related.length > 0 && <section className="border-t border-white/8 bg-[#0d1016] py-14"><div className="content-shell"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-400">Okumaya devam edin</p><h2 className="mt-2 text-3xl font-black">İlgili içerikler</h2></div><Link href="/bilgi-merkezi" className="text-sm font-extrabold text-rose-400">Tüm makaleler →</Link></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{related.map((item) => <Link key={item.slug} href={`/bilgi-merkezi/${item.slug}`} className="premium-card group p-5 transition hover:-translate-y-1 hover:border-rose-400/25"><span className="text-xs font-extrabold text-rose-400">{item.category}</span><h3 className="mt-3 text-lg font-black">{item.title}</h3><p className="mt-3 text-xs text-slate-500">{item.readTime} <span className="ml-2 text-rose-400">→</span></p></Link>)}</div></div></section>}
    </main>
  );
}
