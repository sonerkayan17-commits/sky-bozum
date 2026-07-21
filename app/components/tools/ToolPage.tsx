import Link from 'next/link';
import type { ReactNode } from 'react';
import { getToolDefinition, type ToolId } from '../../lib/tools';
import ToolSeo, { RelatedTools } from './ToolSeo';

type ToolPageProps = {
  toolId: ToolId;
  children: ReactNode;
};

export default function ToolPage({ toolId, children }: ToolPageProps) {
  const tool = getToolDefinition(toolId);

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <ToolSeo tool={tool} />
      <header className="tool-page-hero border-b border-white/8 py-14 sm:py-18">
        <div className="narrow-shell">
          <p className="eyebrow">{tool.eyebrow}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">{tool.pageTitle}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{tool.intro}</p>
        </div>
      </header>

      <section className="narrow-shell py-10 sm:py-14">
        {children}

        <section
          className={`tool-editorial mt-10 grid gap-6 border-t border-white/8 pt-10 ${tool.editorial.length > 1 ? 'md:grid-cols-2' : ''}`}
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
      </section>

      <RelatedTools toolId={toolId} />
    </main>
  );
}
