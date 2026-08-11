import Link from 'next/link';
import type { ReactNode } from 'react';
import { getToolDefinition, type ToolId } from '../../lib/tools';
import ToolSeo, { RelatedTools } from './ToolSeo';
import { toolBridge } from '../../lib/contentBridges';
import './tool-page-premium-v1.css';
import './tool-page-wizard-layout-v2.css';
import './tool-page-table-v3.css';
import './tool-page-palette-v4.css';
import './tool-page-related-v5.css';
import './tool-page-mobile-table-v6.css';
import './tool-page-hero-density-v7.css';

type ToolPageProps = {
  toolId: ToolId;
  children: ReactNode;
};

export default function ToolPage({ toolId, children }: ToolPageProps) {
  const tool = getToolDefinition(toolId);
  const bridge = toolBridge(toolId);

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <ToolSeo tool={tool} />
      <header className="tool-page-hero border-b border-white/8 py-10 sm:py-12">
        <div className="narrow-shell">
          <nav className="tool-page-crumb" aria-label="Sayfa yolu">
            <Link href="/">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/araclar">Araç Merkezi</Link><span aria-hidden="true">/</span><span aria-current="page">{tool.shortTitle}</span>
          </nav>
          <p className="eyebrow">{tool.eyebrow}</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight sm:text-5xl">{tool.pageTitle}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">{tool.intro}</p>
          <dl className="tool-page-quickfacts" aria-label="Araç özeti">
            <div><dt>ARAÇ TÜRÜ</dt><dd>{tool.eyebrow}</dd></div>
            <div><dt>SONUÇ</dt><dd>Tahmini aralık</dd></div>
            <div><dt>KULLANIM</dt><dd>İşlem başlatmaz</dd></div>
          </dl>
        </div>
      </header>

      <section className="narrow-shell py-8 sm:py-10">
        {children}

        <section
          className={`tool-editorial mt-8 grid gap-6 ${tool.editorial.length > 1 ? 'md:grid-cols-2' : ''}`}
          aria-label="Hesaplama notları"
        >
          {tool.editorial.map((item) => (
            <article key={item.title} className="tool-editorial-item">
              <h2 className="text-2xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-8 text-slate-400">{item.text}</p>
            </article>
          ))}
        </section>

        {tool.action ? <Link href={tool.action.href} className="btn-secondary mt-8">{tool.action.label}</Link> : null}

        {bridge?.article || bridge?.service ? <section className={`tool-page-bridges mt-8 grid gap-4 ${bridge.service && bridge.article ? 'sm:grid-cols-2' : ''}`} aria-label="İlgili hizmet ve rehberler">
          {bridge.service ? <Link href={`/hizmetler/${bridge.service.slug}`} className="premium-card focus-ring group p-5"><span className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-400">Uygun hizmet</span><h2 className="mt-2 text-xl font-black group-hover:text-rose-300">{bridge.service.shortName}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Hesap sonucundan hizmet koşullarına ve işlem adımlarına geçin.</p><span className="mt-4 inline-flex text-sm font-black text-rose-300">Hizmeti incele →</span></Link> : null}
          {bridge.article ? <Link href={`/bilgi-merkezi/${bridge.article.slug}`} className="premium-card focus-ring group p-5"><span className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-300">İlgili rehber</span><h2 className="mt-2 text-xl font-black group-hover:text-rose-300">{bridge.article.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sonucu uygulamadan önce limit, güvenlik ve kullanım ayrıntılarını okuyun.</p><span className="mt-4 inline-flex text-sm font-black text-rose-300">Rehberi oku →</span></Link> : null}
        </section> : null}
      </section>

      <RelatedTools toolId={toolId} />
    </main>
  );
}
