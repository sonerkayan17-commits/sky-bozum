import Image from 'next/image';
import Link from './DeferredLink';

const cards = [
  {
    slug: 'mobil-odeme-nasil-acilir',
    eyebrow: 'Operatör Rehberi',
    title: 'Mobil Ödeme Rehberi',
    description: 'Limit, kullanım ve güvenli işlem adımlarını tek rehberde öğrenin.',
    tags: ['Turkcell', 'Türk Telekom', 'Vodafone'],
    cover: '/blog-covers/operatorler-premium.svg',
    coverAlt: 'Turkcell, Türk Telekom ve Vodafone premium marka kompozisyonu',
  },
  {
    slug: 'dijital-kod-hediye-karti-rehberi',
    eyebrow: 'Dijital Kod Rehberi',
    title: 'Dijital Kod Rehberi',
    description: 'Kod teslimi, kontrol süreci ve ödeme adımlarını güvenle takip edin.',
    tags: ['iTunes / Apple', 'Razer Gold', 'Steam'],
    cover: '/blog-covers/dijital-kodlar-premium.svg',
    coverAlt: 'Apple, Razer Gold ve Steam premium marka kompozisyonu',
  },
] as const;

type HomeBlogProps = {
  compact?: boolean;
  sidebar?: boolean;
};

export default function HomeBlog({ compact = false, sidebar = false }: HomeBlogProps) {
  const shellClass = sidebar
    ? 'relative flex h-full min-h-[540px] flex-col overflow-hidden rounded-[22px] border border-white/[0.12] bg-[radial-gradient(circle_at_100%_0%,rgba(245,190,54,.07),transparent_31%),linear-gradient(180deg,rgba(10,18,27,.985),rgba(6,12,19,.995))] p-5 shadow-[0_24px_64px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.045)]'
    : 'relative overflow-hidden rounded-[22px] border border-white/[0.12] bg-[radial-gradient(circle_at_100%_0%,rgba(245,190,54,.05),transparent_30%),linear-gradient(180deg,rgba(10,18,27,.98),rgba(6,12,19,.99))] p-4 shadow-[0_22px_56px_rgba(0,0,0,.22),inset_0_1px_0_rgba(255,255,255,.04)] sm:p-5';

  return (
    <section className={compact ? 'h-full text-white' : 'section-band rhythm-lg bg-[#080a10] text-white'}>
      <div className={compact ? 'h-full' : 'content-wide'}>
        <div className={shellClass}>
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f3bf31]/30 to-transparent" />

          <div className={sidebar ? 'mb-4 flex shrink-0 items-end justify-between gap-4' : 'mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end'}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#f3bf31]">Bilgi Merkezi</p>
              <h2 className={sidebar ? 'mt-1 text-[27px] font-black tracking-[-.04em]' : 'mt-0.5 text-[23px] font-black tracking-[-.035em]'}>Güncel Rehberler</h2>
            </div>
            <Link href="/bilgi-merkezi" className="group/all inline-flex shrink-0 items-center gap-2 rounded-full border border-[#f1c43d]/15 bg-[#f1c43d]/[0.055] px-3 py-1.5 text-[10px] font-black text-[#f1c43d] transition hover:border-[#f1c43d]/30 hover:bg-[#f1c43d]/[0.09]">Tüm rehberler <span className="transition group-hover/all:translate-x-0.5">→</span></Link>
          </div>

          <div className={sidebar ? 'grid min-h-0 flex-1 grid-rows-2 gap-3' : 'grid gap-3 md:grid-cols-2'}>
            {cards.map((card) => (
              <Link
                key={card.slug}
                href={`/bilgi-merkezi/${card.slug}`}
                className={sidebar
                  ? 'group relative grid min-h-0 overflow-hidden rounded-[17px] border border-white/[0.09] bg-[linear-gradient(135deg,rgba(255,255,255,.035),rgba(255,255,255,.015))] transition duration-300 hover:-translate-y-0.5 hover:border-[#e8b84f]/35 hover:bg-white/[0.045] hover:shadow-[0_18px_38px_rgba(0,0,0,.24)] sm:grid-cols-[40%_1fr]'
                  : 'group relative grid min-h-[150px] overflow-hidden rounded-[17px] border border-white/[0.09] bg-[linear-gradient(135deg,rgba(255,255,255,.035),rgba(255,255,255,.015))] transition duration-300 hover:-translate-y-0.5 hover:border-[#e8b84f]/35 hover:bg-white/[0.045] hover:shadow-[0_18px_38px_rgba(0,0,0,.24)] sm:grid-cols-[160px_1fr]'}
              >
                <div className={sidebar ? 'relative min-h-[132px] overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.045),transparent_58%),#071019] sm:min-h-0 sm:border-b-0 sm:border-r' : 'relative min-h-[118px] overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.045),transparent_58%),#071019] sm:min-h-full sm:border-b-0 sm:border-r'}>
                  <Image
                    src={card.cover}
                    alt={card.coverAlt}
                    fill
                    sizes={sidebar ? '(min-width: 640px) 260px, 100vw' : '(min-width: 768px) 160px, 100vw'}
                    className="object-contain p-3.5 transition duration-700 ease-out group-hover:scale-[1.018]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10" />
                </div>

                <div className="relative flex min-w-0 flex-col justify-center px-[18px] py-4">
                  <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#f1c43d]/80">{card.eyebrow}</p>
                  <h3 className="mt-1 text-[18px] font-black tracking-[-.025em] text-white">{card.title}</h3>
                  <p className="mt-1.5 max-w-[360px] text-[11.5px] leading-[1.62] text-white/58">{card.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => <span key={tag} className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-[8px] font-bold text-white/48">{tag}</span>)}
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black text-[#f1c43d]">Rehberi oku <span className="transition group-hover:translate-x-1">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
