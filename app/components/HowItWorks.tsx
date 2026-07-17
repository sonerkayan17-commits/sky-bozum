import Link from 'next/link';
import { siteConfig } from '../lib/site';

const steps = [
  {
    number: '01',
    title: 'Hizmeti seçin',
    description:
      'Değerlendirmek istediğiniz dijital kodu veya desteklenen mobil ödeme yöntemini belirleyin.',
    detail: 'Hizmet sayfasından işlem kapsamını ve güncel bilgileri inceleyin.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16M7 4v7m10-7v7M6.5 13.5h11a2.5 2.5 0 0 1 2.5 2.5v1.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5V16a2.5 2.5 0 0 1 2.5-2.5Z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Güncel oran alın',
    description:
      'WhatsApp üzerinden stok durumuna uygun güncel oranı ve işlem detaylarını net biçimde öğrenin.',
    detail: 'İşlem başlamadan önce oran, ödeme yöntemi ve gerekli adımlar paylaşılır.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.5h9m-9 3.5h6m-8.5 8 2.4-3.2a8 8 0 1 1 3.6 2.1c-1.3 0-2.5-.3-3.6-.8L5 20Z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Ödemenizi alın',
    description:
      'Doğrulama tamamlandıktan sonra ödemeniz, önceden belirlenen yöntemle güvenli biçimde gönderilir.',
    detail: 'Süreç boyunca destek ekibinden kesintisiz bilgi alabilirsiniz.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16v10H4zM8 12.5h.01M12 12.5h4M7 5h10" />
      </svg>
    ),
  },
] as const;

const processHighlights = [
  ['7/24', 'Kesintisiz destek'],
  ['Açık', 'Oran ve süreç bilgisi'],
  ['Güvenli', 'Kontrollü işlem akışı'],
] as const;

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 dark:bg-[#06100d] lg:px-8 lg:py-28">
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-200/25 blur-3xl dark:bg-emerald-500/10" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-green-200/20 blur-3xl dark:bg-green-500/10" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[.2em] text-emerald-700 dark:text-emerald-300">
              Nasıl çalışır?
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-slate-950 dark:text-white sm:text-5xl">
              İşleminizi üç net adımda tamamlayın
            </h2>
          </div>

          <div className="lg:justify-self-end lg:max-w-2xl">
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
              Karmaşık formlar ve belirsiz bekleme süreleri olmadan; hizmet seçimi, güncel oran bilgisi ve ödeme aşamalarını tek bir şeffaf süreçte yönetin.
            </p>
          </div>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-[16%] right-[16%] top-14 hidden h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent lg:block dark:via-emerald-700" />

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="group relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-[#f8fbfa] p-7 shadow-[0_12px_35px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-[0_24px_60px_rgba(5,46,35,.1)] motion-reduce:transform-none dark:border-white/10 dark:bg-white/[.035] dark:hover:border-emerald-500/30"
              >
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-emerald-100/70 to-transparent opacity-80 dark:from-emerald-500/10" />

                <div className="relative flex items-center justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                    {step.icon}
                  </span>
                  <span className="text-5xl font-black tracking-[-.08em] text-emerald-100 dark:text-emerald-950">
                    {step.number}
                  </span>
                </div>

                <div className="relative mt-7">
                  <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>

                <div className="relative mt-6 border-t border-slate-200/80 pt-5 dark:border-white/10">
                  <p className="text-xs font-bold leading-6 text-slate-500 dark:text-slate-400">
                    {step.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 rounded-[30px] border border-emerald-200/80 bg-[#071713] p-6 text-white shadow-[0_24px_60px_rgba(5,46,35,.16)] lg:grid-cols-[1fr_auto] lg:items-center lg:p-8 dark:border-emerald-900">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-emerald-300">
              İşleme hazır mısınız?
            </p>
            <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              Güncel oranı öğrenin, süreci birlikte başlatalım.
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {processHighlights.map(([value, label]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-10 min-w-10 place-items-center rounded-xl bg-emerald-400/10 px-2 text-sm font-black text-emerald-300">
                    {value}
                  </span>
                  <span className="text-xs font-bold leading-5 text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`${siteConfig.whatsapp}?text=Merhaba%2C%20bir%20işlem%20başlatmak%20istiyorum.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 font-black text-[#04120f] shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 motion-reduce:transform-none lg:w-auto"
          >
            WhatsApp&apos;tan İşlemi Başlat
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
