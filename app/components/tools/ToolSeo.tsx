import { getRelatedTools, type ToolDefinition, type ToolId } from '../../lib/tools';
import Link from 'next/link';
import { SITE_URL as siteUrl } from '../../lib/seo';

type ToolSeoProps = {
  tool: ToolDefinition;
};

export default function ToolSeo({ tool }: ToolSeoProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Araç Merkezi', item: `${siteUrl}/araclar` },
          { '@type': 'ListItem', position: 3, name: tool.title, item: `${siteUrl}${tool.href}` },
        ],
      },
      {
        '@type': 'WebApplication',
        name: tool.title,
        description: tool.seoDescription,
        url: `${siteUrl}${tool.href}`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
        provider: { '@type': 'Organization', name: 'Sky Bozum', url: siteUrl },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

export function RelatedTools({ toolId }: { toolId: ToolId }) {
  const related = getRelatedTools(toolId);
  return (
    <section className="narrow-shell pb-14 sm:pb-20" aria-labelledby="related-tools-title">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Hesabı tamamlayın</p>
            <h2 id="related-tools-title" className="mt-3 text-2xl font-black sm:text-3xl">İlgili araçlar</h2>
          </div>
          <Link href="/araclar" className="text-sm font-black text-rose-300">Tüm araçları gör →</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {related.map((tool) => (
            <Link key={tool.href} href={tool.href} className="tool-related-card interactive-card group flex flex-col p-5">
              <h3 className="text-lg font-black">{tool.shortTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{tool.description}</p>
              <span className="mt-auto inline-flex pt-5 text-sm font-black text-rose-300">Aracı aç →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
