import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { guidesForService } from '../lib/contentBridges';
import IndependentServiceNotice from '../components/IndependentServiceNotice';

export const metadata: Metadata = {
  keywords: ['Vodafone dijital urun alma', 'Turkcell dijital kod satin alma', 'Turk Telekom dijital urun alim rehberi', 'mobil odeme limiti', 'operator mobil odeme rehberi'],
  title: 'Operatörlerle Dijital Ürün Satın Alma Rehberleri',
  description: 'Vodafone, Turkcell ve Türk Telekom ile desteklenen mağazalardan dijital ürün satın alma, limit ve güvenlik adımlarını inceleyin.',
  alternates: { canonical: '/operatorler' },
};

const operators = [
  {
    name: 'Vodafone',
    logo: '/brands/vodafone/vodafone.svg',
    href: '/hizmetler/vodafone-mobil-odeme',
    label: 'Vodafone ile dijital ürün satın al',
    text: 'Vodafone mobil ödeme ile desteklenen mağazalardan dijital ürün satın alma, limit ve güvenlik adımlarını öğrenin.',
    tone: 'from-red-600/25 to-red-950/10 border-red-500/25',
    serviceSlug: 'vodafone-mobil-odeme',
  },
  {
    name: 'Turkcell',
    logo: '/brands/turkcell/turkcell.svg',
    href: '/hizmetler/turkcell-mobil-odeme',
    label: 'Turkcell ile dijital kod satın al',
    text: 'Turkcell mobil ödeme ve Paycell ile dijital kod satın alırken izlenecek adımları inceleyin.',
    tone: 'from-yellow-400/25 to-blue-950/10 border-yellow-400/25',
    serviceSlug: 'turkcell-mobil-odeme',
  },
  {
    name: 'Türk Telekom',
    logo: '/brands/turktelekom/turktelekom.svg',
    href: '/hizmetler/turk-telekom-mobil-odeme',
    label: 'Türk Telekom dijital ürün alım rehberi',
    text: 'Türk Telekom mobil ödeme ve Pokus ile dijital ürün satın alma adımlarını görün.',
    tone: 'from-cyan-500/25 to-cyan-950/10 border-cyan-400/25',
    serviceSlug: 'turk-telekom-mobil-odeme',
  },
];

export default function OperatorsPage() {
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <section className="relative overflow-hidden border-b border-white/8 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,.14),transparent_44%)]" />
        <div className="content-shell relative text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-400">Operatörünüzü seçin</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Operatörünüzle dijital ürün satın alma adımlarını öğrenin.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400">Her operatörün limit, mağaza ve onay koşulları farklıdır. Hattınızı seçin; satın alma ve güvenlik rehberini işlem öncesinde okuyun.</p>
        </div>
      </section>

      <section className="content-shell py-14 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {operators.map((operator) => (
            <Link key={operator.name} href={operator.href} aria-label={`${operator.name} mobil ödeme rehberini aç`} className={`focus-ring interactive-card group flex h-full flex-col rounded-3xl border bg-gradient-to-br p-5 ${operator.tone}`}>
              <div className="flex h-44 items-center justify-center rounded-2xl border border-white/70 bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,.18)]">
                <Image src={operator.logo} alt={`${operator.name} logosu`} width={320} height={130} sizes="(max-width: 767px) 70vw, 24vw" className="max-h-24 w-[75%] object-contain transition duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-2 pt-6">
                <div><h2 className="text-2xl font-black">{operator.name}</h2><span className="mt-2 inline-flex rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-black text-amber-200">{operator.label}</span></div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{operator.text}</p>
                <span className="mt-auto inline-flex pt-6 text-sm font-extrabold text-rose-300">Operatör rehberini aç <span className="ml-2 transition group-hover:translate-x-1" aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>


        <section className="mt-12" aria-labelledby="operator-guide-title">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-400">Operatöre özel içerikler</p>
          <h2 id="operator-guide-title" className="mt-3 text-3xl font-black">Doğrudan ilgili rehberlere geçin</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {operators.map((operator) => (
              <section key={`${operator.name}-guides`} className="premium-card p-5">
                <h3 className="text-xl font-black">{operator.name} rehberleri</h3>
                <div className="mt-4 space-y-2">
                  {guidesForService(operator.serviceSlug, 4).map((article) => (
                    <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="focus-ring group flex items-start justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.025] p-3">
                      <span className="text-sm font-bold leading-6 text-slate-300 group-hover:text-rose-300">{article.title}</span>
                      <span aria-hidden="true" className="text-rose-300">→</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <div className="premium-card mt-8 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-400">Önemli bilgi</p><h2 className="mt-2 text-2xl font-black">Limitiniz doğrudan nakit bakiye değildir.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">Mobil ödeme limiti, desteklenen dijital ürün satın alımında kullanılabilen operatör limitidir. Mağaza, ürün, bölge ve operatör koşulları değişebilir. Satın alma yapmadan önce ürünün size uygunluğunu ve mağaza koşullarını kontrol edin.</p></div>
          <Link href="/bilgi-merkezi" className="btn-primary focus-ring">Satın alma rehberlerini aç</Link>
        </div>
        <div className="mt-8"><IndependentServiceNotice compact /></div>
      </section>
    </main>
  );
}
