import Image from 'next/image';
import Link from 'next/link';
import type { ServiceItem } from '../../lib/site';
import PublishedRateLabel from './PublishedRateLabel';

const tones = {
  emerald: 'from-emerald-500/20 to-emerald-950/10 border-emerald-400/20',
  blue: 'from-cyan-500/20 to-blue-950/10 border-cyan-400/20',
  violet: 'from-violet-500/20 to-violet-950/10 border-violet-400/20',
  orange: 'from-amber-500/20 to-orange-950/10 border-amber-400/20',
  rose: 'from-rose-500/20 to-rose-950/10 border-rose-400/20',
  slate: 'from-slate-400/15 to-slate-950/10 border-slate-300/15',
};

export default function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <Link href={`/hizmetler/${service.slug}`} prefetch={false} aria-label={`${service.name} sayfasını aç`} className="focus-ring interactive-card group flex h-full min-h-80 flex-col rounded-[24px] border border-white/8 bg-[#0e1118] p-4 hover:border-rose-400/25 hover:bg-[#12151d]">
      <div className={`relative flex h-[140px] items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${tones[service.tone]} ${service.slug === 'itunes-apple' ? 'bg-white' : ''}`}>
        <Image src={service.logo} alt={`${service.shortName} logosu`} width={230} height={92} sizes="(max-width: 639px) 70vw, (max-width: 1279px) 34vw, 230px" className="relative z-10 h-[100px] w-full max-w-[230px] object-contain drop-shadow-xl transition duration-300 group-hover:scale-[1.03]" />
        {service.popular && <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">Popüler</span>}
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{service.category}</p><span className="rounded-lg border border-white/8 bg-white/[0.035] px-2.5 py-1 text-xs font-black text-rose-300" title="Kesin oran işlem öncesinde teyit edilir">Aralık <PublishedRateLabel serviceSlug={service.slug} fallback={service.rate} /></span></div>
        <h3 className="mt-3 text-xl font-black tracking-tight text-white">{service.shortName}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{service.description}</p>
        <div className="mt-auto pt-5"><span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[.045] px-4 text-sm font-extrabold text-rose-300 transition group-hover:border-rose-300/30 group-hover:bg-rose-400/10 group-hover:text-orange-200">Hizmeti incele <span aria-hidden="true">→</span></span></div>
      </div>
    </Link>
  );
}
