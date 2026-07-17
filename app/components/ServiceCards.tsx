import Image from 'next/image';
import Link from 'next/link';
import { services as source } from '../lib/site';

const tone: Record<string, string> = {
  emerald: 'from-emerald-400/20 via-emerald-300/5 to-transparent',
  blue: 'from-blue-500/20 via-cyan-300/5 to-transparent',
  violet: 'from-violet-500/20 via-fuchsia-300/5 to-transparent',
  orange: 'from-cyan-400/20 via-blue-300/5 to-transparent',
  rose: 'from-rose-500/20 via-red-300/5 to-transparent',
  slate: 'from-slate-400/20 via-slate-200/5 to-transparent',
};

export default function ServiceCards() {
  return (
    <section className="relative overflow-hidden bg-[#f7faf9] px-5 py-20 dark:bg-[#07110e] lg:px-8 lg:py-28">
      <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[.2em] text-emerald-700 dark:text-emerald-300">
              Hizmetler
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-slate-950 dark:text-white sm:text-5xl">
              İhtiyacınıza uygun bozum hizmetini seçin
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Dijital kodlarınızı ve desteklenen mobil ödeme bakiyelerinizi güncel koşullarla, açık ve anlaşılır bir süreçle değerlendirin.
            </p>
          </div>

          <Link
            href="/hizmetler"
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-black text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg motion-reduce:transform-none dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            Tüm hizmetleri görüntüle
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {source.slice(0, 9).map((service, index) => (
            <Link
              key={service.slug}
              href={`/hizmetler/${service.slug}`}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-[0_24px_60px_rgba(5,46,35,.12)] motion-reduce:transform-none dark:border-white/10 dark:bg-white/[.035] dark:hover:border-emerald-500/30"
            >
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${tone[service.tone]}`} />

              <div className="relative flex items-start justify-between gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950">
                  <Image
                    src={service.logo}
                    alt={`${service.shortName} bozum logosu`}
                    width={72}
                    height={48}
                    className="max-h-10 w-auto object-contain"
                  />
                </div>

                <div className="flex flex-col items-end gap-2">
                  {service.popular ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[.12em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Popüler
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
                  )}
                  <span className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white dark:bg-white dark:text-slate-950">
                    {service.rate}
                  </span>
                </div>
              </div>

              <div className="relative mt-6">
                <p className="text-xs font-black uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-300">
                  {service.category}
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                  {service.shortName}
                </h3>
                <p className="mt-3 min-h-14 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
              </div>

              <div className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-white/10">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Güncel oran için iletişime geçin
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-base font-black text-emerald-700 transition group-hover:translate-x-0.5 group-hover:bg-emerald-500 group-hover:text-white motion-reduce:transform-none dark:bg-emerald-950/60 dark:text-emerald-300">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
