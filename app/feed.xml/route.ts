import { articles } from '../lib/site';
import { siteConfig } from '../lib/site-config';
import { articleUrl, publishedAt, SITE_URL, updatedAt } from '../lib/seo';

export const dynamic = 'force-static';

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char);
}

export function GET() {
  const items = [...articles]
    .sort((a, b) => new Date(updatedAt(b)).getTime() - new Date(updatedAt(a)).getTime())
    .slice(0, 50)
    .map((article) => `
      <item>
        <title>${escapeXml(article.title)}</title>
        <link>${articleUrl(article)}</link>
        <guid isPermaLink="true">${articleUrl(article)}</guid>
        <description>${escapeXml(article.metaDescription ?? article.excerpt)}</description>
        <category>${escapeXml(article.category)}</category>
        <pubDate>${new Date(publishedAt(article)).toUTCString()}</pubDate>
      </item>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(siteConfig.name)} Bilgi Merkezi</title>
        <link>${SITE_URL}/bilgi-merkezi</link>
        <description>Mobil ödeme, dijital bakiye, hediye kartı ve güvenli işlem rehberleri.</description>
        <language>tr-TR</language>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
}
