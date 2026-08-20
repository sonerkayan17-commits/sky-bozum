import Link from '../DeferredLink';
import { articles } from '../../lib/site';
import { learningPaths } from '../../lib/learningPaths';

export default function LearningPathShowcase() {
  return (
    <section className="py-3 sm:py-4" aria-labelledby="learning-showcase-title">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-rose-400">Rehber serileri</p>
          <h2 id="learning-showcase-title" className="mt-1 text-lg font-black leading-tight tracking-[-0.03em] text-white sm:text-xl">
            Doğru sırada öğrenin.
          </h2>
        </div>
        <span className="hidden text-[10px] text-slate-500 sm:block">Başlangıçtan güvenli işleme kadar</span>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {learningPaths.map((path, index) => {
          const first = articles.find((article) => article.slug === path.articleSlugs[0]);
          return (
            <Link
              key={path.slug}
              href={first ? `/bilgi-merkezi/${first.slug}` : '/bilgi-merkezi'}
              className="focus-ring knowledge-learning-card group !grid !min-h-[88px] !grid-cols-[32px_minmax(0,1fr)_auto] !items-center !gap-3 !overflow-visible !rounded-xl !border-white/8 !bg-white/[0.025] !px-3 !py-3 transition hover:-translate-y-0.5 hover:!border-rose-400/30 hover:!bg-white/[0.04]"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-white/[0.045] text-[11px] font-black text-slate-500">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0">
                <span className="block text-[8px] font-black uppercase tracking-[0.13em] text-rose-400">{path.eyebrow}</span>
                <h3 className="mt-1 truncate text-[13px] font-extrabold leading-tight text-white">{path.title}</h3>
                <p className="mt-1 line-clamp-1 text-[10px] leading-4 text-slate-500">{path.description}</p>
              </div>

              <div className="flex items-center gap-1.5 whitespace-nowrap text-[9px] font-bold text-slate-500">
                <span>{path.articleSlugs.length} makale</span>
                <b className="text-sm font-black text-rose-400 transition group-hover:translate-x-0.5" aria-hidden="true">→</b>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
