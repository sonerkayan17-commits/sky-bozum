import Link from 'next/link';
import { siteConfig } from '../lib/site';

const stats = [
  {
    value: '10+',
    label: 'Yıllık tecrübe',
    description: 'Dijital bakiye ve mobil ödeme işlemlerinde uzun yıllara dayanan deneyim.',
  },
  {
    value: '7/24',
    label: 'Aktif destek',
    description: 'Güncel oran ve işlem süreci için kesintisiz iletişim desteği.',
  },
  {
    value: 'Şeffaf',
    label: 'İşlem süreci',
    description: 'Oran ve ödeme detayları işlem başlamadan önce açıkça paylaşılır.',
  },
] as const;

const trustItems = [
  {
    title: 'Güncel oran bilgisi',
    description:
      'Stok ve hizmet durumuna uygun oran, işlem başlamadan önce net biçimde bildirilir.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17.5 9 12l3.5 3.5L20 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 7.5H20V12" />
      </svg>
    ),
  },
  {
    title: 'Kontrollü doğrulama',
    description:
      'İşlem bilgileri ödeme öncesinde kontrol edilir ve süreç onay adımlarıyla ilerletilir.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.6-2.8 7.7-7 9.3-4.2-1.6-7-4.7-7-9.3V6l7-2.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Kesintisiz iletişim',
    description:
      'İşlem öncesinde ve işlem sırasında ihtiyaç duyduğunuz bilgiye doğrudan ulaşabilirsiniz.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 19.5 7 16.2A7.5 7.5 0 1 1 10.2 19c-1.2 0-2.3-.3-3.2-.7l-1.5 1.2Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
      </svg>
    ),
  },
] as const;

export default function StatisticsTrust() {
  return (
    <section className="relative isolate overflow-hidden bg-[#061713] px-5 py-20 text-white lg:px-8 lg:py-28">
      <div className="hero-green-grid absolute inset-0 opacity-25" />
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-green-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Güvenli ve açık süreç
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-[-.045em] text-white sm:text-5xl">
              Her adımda net bilgi, kontrollü işlem.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Oran bilgisinden ödeme aşamasına kadar süreç açık biçimde paylaşılır. Sürpriz kesinti veya belirsiz adım olmadan, ne olacağını önceden bilirsiniz.
            </p>
          </div>

          <Link
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3.5 font-black text-[#04120f] transition hover:-translate-y-0.5 hover:bg-emerald-400 motion-reduce:transform-none"
          >
            Güncel Oran Al
          </Link>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[.04] backdrop-blur md:grid-cols-3">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              className={`p-7 sm:p-8 ${index > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}
            >
              <p className="text-4xl font-black tracking-[-.04em] text-emerald-400 sm:text-5xl">{stat.value}</p>
              <h3 className="mt-3 text-lg font-black text-white">{stat.label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{stat.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {trustItems.map((item) => (
            <article
              key={item.title}
              className="group rounded-[28px] border border-white/10 bg-white/[.055] p-7 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[.075] motion-reduce:transform-none"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 transition group-hover:bg-emerald-400 group-hover:text-[#04120f]">
                {item.icon}
              </span>
              <h3 className="mt-6 text-xl font-black text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-emerald-300/15 bg-gradient-to-r from-emerald-500/10 to-green-400/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-lg font-black text-white">İşlem yapmadan önce güncel oranınızı öğrenin.</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Oranlar stok durumuna göre değişebilir. Kesin bilgi için destek ekibiyle iletişime geçin.</p>
          </div>
          <Link
            href="/oran-hesapla"
            className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 font-black text-white transition hover:bg-white/15"
          >
            Oran Hesapla
          </Link>
        </div>
      </div>
    </section>
  );
}
