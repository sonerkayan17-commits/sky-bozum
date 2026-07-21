import type { Metadata } from 'next';
import Link from 'next/link';
import Calculator from '../components/Calculator';
import { toolPages } from '../lib/tools';

export const metadata: Metadata = {
  title: 'Araçlar ve Oran Hesaplama Merkezi | Sky Bozum',
  description: 'Mobil ödeme ve dijital bakiye oranlarını hesaplayın; karşılaştırma, hedef ödeme, kod adedi ve diğer yardımcı araçlara tek merkezden ulaşın.',
  alternates: { canonical: '/araclar' },
  openGraph: {
    title: 'Sky Bozum Araçlar ve Oran Hesaplama Merkezi',
    description: 'Oran hesaplayıcı ve tüm işlem araçlarını tek merkezden kullanın.',
    url: '/araclar',
    type: 'website',
  },
};

const quickPaths = [
  { label: 'Net ödemeyi hesapla', href: '/araclar#oran-hesapla', note: 'Tutar ve hizmet seçerek tahmini sonucu görün.' },
  { label: 'Hizmetleri karşılaştır', href: '/araclar/oran-karsilastirma', note: 'Aynı tutarın farklı hizmetlerdeki karşılığını kıyaslayın.' },
  { label: 'Doğru aracı bul', href: '/araclar/islem-sihirbazi', note: 'Elinizdeki ürün türüne göre doğru yolu seçin.' },
] as const;

export default function Page() {
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <header className="relative overflow-hidden border-b border-white/8 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,.17),transparent_50%)]" />
        <div className="content-shell relative text-center">
          <p className="eyebrow">Sky Bozum Araçlar ve Hesaplama Merkezi</p>
          <h1 className="mx-auto mt-4 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">Araçlar ve oran hesaplama artık tek merkezde.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-400">Bakiyenizin tahmini karşılığını hesaplayın; hizmetleri karşılaştırın, hedef ödemenizi planlayın ve tüm yardımcı araçlara aynı sayfadan ulaşın.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/araclar/islem-sihirbazi" className="btn-primary">Doğru aracı bul</Link>
            <Link href="/araclar#oran-hesapla" className="btn-secondary">Hızlı oran hesapla</Link>
          </div>
        </div>
      </header>

      <Calculator embedded />

      <section className="content-shell border-t border-white/8 py-12 sm:py-16">
        <div className="grid gap-4 lg:grid-cols-3">
          {quickPaths.map((item, index) => (
            <Link key={item.href} href={item.href} className="interactive-card rounded-3xl border border-white/8 bg-white/[.025] p-6 transition hover:bg-white/[.045]">
              <span className="text-xs font-black text-emerald-400">Hızlı yol {index + 1}</span>
              <h2 className="mt-3 text-xl font-black">{item.label}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">{item.note}</p>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Tüm araçlar</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">İhtiyacınıza uygun hesabı seçin.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500">Tüm sonuçlar bilgilendirme amaçlıdır. Güncel uygunluk ve oran işlem öncesinde teyit edilmelidir.</p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {toolPages.map((tool, index) => (
            <Link key={tool.href} href={tool.href} className="interactive-card premium-card group relative flex min-h-[250px] flex-col overflow-hidden p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-400">{String(index + 1).padStart(2, '0')}</span>
                <span className="rounded-full border border-white/8 bg-white/[.03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">Ücretsiz</span>
              </div>
              <h3 className="mt-5 text-xl font-black sm:text-2xl">{tool.shortTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{tool.description}</p>
              <span className="mt-auto pt-7 text-sm font-black text-rose-300 transition group-hover:translate-x-1">Aracı aç →</span>
            </Link>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/8 bg-white/[.025] p-7 sm:p-10" aria-labelledby="tools-trust-title">
          <h2 id="tools-trust-title" className="sr-only">Araç merkezinin özellikleri</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div><strong className="text-3xl font-black text-white">8 araç</strong><p className="mt-2 text-sm leading-6 text-slate-400">Birbirine bağlı, ücretsiz hesaplama ve yönlendirme araçları.</p></div>
            <div><strong className="text-3xl font-black text-white">Ortak veri</strong><p className="mt-2 text-sm leading-6 text-slate-400">Hizmet ve oran sayfalarıyla aynı hesaplama kaynağı kullanılır.</p></div>
            <div><strong className="text-3xl font-black text-white">Şeffaf sonuç</strong><p className="mt-2 text-sm leading-6 text-slate-400">Tahmini sonuçlar kesin teklif gibi sunulmaz.</p></div>
          </div>
        </section>

        <article className="mx-auto mt-14 max-w-4xl border-t border-white/8 pt-10">
          <h2 className="text-3xl font-black">Araçlar nasıl kullanılmalı?</h2>
          <p className="mt-4 text-sm leading-8 text-slate-400">Hesaplayıcılar işlem öncesi senaryo üretmek içindir. Gösterilen oran ve maliyetler kesin teklif oluşturmaz; stok, ürün türü, operatör koşulları ve güncel uygunluk son sonucu değiştirebilir.</p>
          <p className="mt-4 text-sm leading-8 text-slate-400">Herhangi bir kod satın almadan veya mobil ödeme işlemi başlatmadan önce hizmet uygunluğunu ve güncel oranı yazılı olarak teyit edin.</p>
        </article>
      </section>
    </main>
  );
}
