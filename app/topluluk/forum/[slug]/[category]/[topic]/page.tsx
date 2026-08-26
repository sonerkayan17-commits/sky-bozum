import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findForumSection, forumStarterTopics, getForumStarterTopic } from '../../../../../lib/forumTaxonomy';
import { getForumGuidance } from '../../../../../lib/forumGuidance';
import { forumRoutes } from '../../../../../lib/forumRoutes';
import ContentEngagement from '../../../../../components/community/ContentEngagement';
import { absoluteUrl, createMetadata, jsonLd } from '../../../../../lib/seo';
import ForumBreadcrumbs from '../../../../ForumBreadcrumbs';
import './topic.css';

export function generateStaticParams() {
  return forumStarterTopics.map((topic) => ({ slug: topic.sectionSlug, category: topic.categorySlug, topic: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string; topic: string }> }): Promise<Metadata> {
  const { slug, category, topic } = await params;
  const item = getForumStarterTopic(slug, category, topic);
  return item ? createMetadata({
    title: item.title,
    description: `${item.summary} Uygulanabilir kontrol adımlarını, güvenlik sınırlarını ve ilgili Sky Bozum rehberlerini birlikte inceleyin.`,
    path: forumRoutes.topic(slug, category, topic),
    type: 'article',
  }) : { robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ slug: string; category: string; topic: string }> }) {
  const { slug, category, topic } = await params;
  const item = getForumStarterTopic(slug, category, topic);
  if (!item) notFound();
  const section = findForumSection(slug);
  if (!section) notFound();
  const related = forumStarterTopics.filter((entry) => entry.sectionSlug === slug && entry.slug !== item.slug);
  const guidance = getForumGuidance(item.slug, item.title, item.sectionSlug);
  const date = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${item.publishedAt}T12:00:00`));
  const canonical = absoluteUrl(forumRoutes.topic(slug, category, topic));
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DiscussionForumPosting',
        '@id': `${canonical}#post`,
        headline: item.title,
        description: item.summary,
        datePublished: `${item.publishedAt}T12:00:00+03:00`,
        author: { '@type': 'Organization', name: 'Sky Bozum', url: absoluteUrl('/') },
        url: canonical,
        mainEntityOfPage: canonical,
        inLanguage: 'tr-TR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Topluluk', item: absoluteUrl('/topluluk') },
          { '@type': 'ListItem', position: 3, name: section.title, item: absoluteUrl(forumRoutes.section(slug)) },
          { '@type': 'ListItem', position: 4, name: item.category, item: absoluteUrl(forumRoutes.category(slug, category)) },
          { '@type': 'ListItem', position: 5, name: item.title, item: canonical },
        ],
      },
    ],
  };

  return <main className="forum-topic-page"><article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <ForumBreadcrumbs section={{ slug: section.slug, title: section.title }} category={{ slug: category, title: item.category }} topic={item.title} />
    <header><span>SKY BOZUM TOPLULUĞU</span><h1>{item.title}</h1><p>{item.summary}</p><div><b>Sky Bozum</b><time>{date}</time></div></header>
    <div className="forum-topic-body">{item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <section className="forum-topic-guidance" aria-labelledby="forum-guidance-title">
      <div><span>ÖNCE BUNLARI KONTROL EDİN</span><h2 id="forum-guidance-title">{guidance.title}</h2><p>{guidance.summary}</p></div>
      <ol>{guidance.checks.map((check, index) => <li key={check}><b>0{index + 1}</b><span>{check}</span></li>)}</ol>
      <nav aria-label={`${item.title} için ilgili rehberler`}><strong>İlgili rehberler</strong><div>{guidance.links.map((link) => <Link key={link.href} href={link.href}>{link.label}<span aria-hidden="true">→</span></Link>)}</div></nav>
    </section>
    <section className="forum-topic-guidance" aria-labelledby="forum-topic-conclusion-title">
      <div><span>SONUÇ VE KATILIM</span><h2 id="forum-topic-conclusion-title">{item.title} için doğru kararı kayıtla destekleyin</h2><p>{item.category} konusunda tek bir oran, ekran görüntüsü veya kullanıcı deneyimi herkes için değişmez sonuç oluşturmaz. Ürünün tam adını, tarihini, bölgesini ve gördüğünüz hata metnini kişisel bilgi paylaşmadan not edin. Resmî sağlayıcı koşulu değiştiğinde önce resmî kaynağı, ardından ilgili Sky Bozum rehberini yeniden kontrol edin.</p><p>Kontrolü adım adım yapmak, aynı anda birden fazla ayarı değiştirmekten daha güvenilir sonuç verir. Önce hesap ve bölge uyumunu, sonra işlem limitini, ardından ürün ya da kod durumunu doğrulayın. Bir hata mesajı görüyorsanız metni değiştirmeden kaydedin ve işlemi art arda tekrarlamadan önce sağlayıcının güncel yardım sayfasına bakın. Böylece geçici sistem kesintisini, yanlış ürün seçimini ve hesap kısıtını birbirinden ayırabilirsiniz.</p><p>Topluluğa yanıt yazarken yalnız doğrulayabildiğiniz adımları aktarın; telefon, kod, IBAN, kimlik ve hesap erişimi gibi hassas bilgileri yayımlamayın. Sorun çözüldüyse hangi kontrolün sonuç verdiğini belirtmeniz, aynı başlığa daha sonra ulaşan ziyaretçinin doğru adıma daha hızlı geçmesini sağlar. Çözüm henüz doğrulanmadıysa bunu açıkça yazın; tahmini bilgi yerine tarihli ve tekrarlanabilir bir kontrol sonucu paylaşın.</p></div>
      <nav aria-label={`${item.title} sonrası devam bağlantıları`}><strong>Konuyla ilgili güvenli devam adımları</strong><div>{guidance.links.slice(0, 3).map((link) => <Link key={`conclusion-${link.href}`} href={link.href}>{link.label}<span aria-hidden="true">→</span></Link>)}</div></nav>
    </section>
    <ContentEngagement targetId={`forum-${item.sectionSlug}-${item.categorySlug}-${item.slug}`} title={item.title} kind="topic" />
    <footer><Link href={forumRoutes.category(slug, category)}>← {item.category} kategorisine dön</Link></footer>
    {related.length > 0 && <aside><h2>Aynı bölümden başlangıç konuları</h2><div>{related.map((entry) => <Link key={entry.slug} href={forumRoutes.topic(entry.sectionSlug, entry.categorySlug, entry.slug)}>{entry.title}</Link>)}</div></aside>}
  </article></main>;
}
