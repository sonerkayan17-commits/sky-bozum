'use client';

import Link from '../DeferredLink';
import HomeFaq from '../HomeFaq';
import FinalCta from '../FinalCta';

export default function HomeFaqCta() {
  return (
    <section className="render-later home-final-section content-wide rhythm-md">
      <div className="grid gap-6 lg:grid-cols-2">
        <HomeFaq />
        <FinalCta />
      </div>
      <nav className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-sm font-bold text-slate-400" aria-label="Önemli site bölümleri">
        <span className="text-xs uppercase tracking-[0.16em] text-slate-600">Devam edin</span>
        <Link href="/hizmetler" className="transition hover:text-rose-300">Hizmetler</Link>
        <Link href="/araclar" className="transition hover:text-rose-300">Araçlar Merkezi</Link>
        <Link href="/bilgi-merkezi" className="transition hover:text-rose-300">Bilgi Merkezi</Link>
        <Link href="/urunler" className="transition hover:text-rose-300">Ürünler</Link>
        <Link href="/topluluk" className="transition hover:text-rose-300">Topluluk</Link>
        <Link href="/guven-merkezi" className="transition hover:text-rose-300">Güven Merkezi</Link>
      </nav>
    </section>
  );
}
