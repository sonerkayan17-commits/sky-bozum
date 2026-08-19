'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from '../DeferredLink';

const BrandStrip = dynamic(() => import('../BrandStrip'));
const CredibilityBand = dynamic(() => import('../CredibilityBand'));
const HomeServices = dynamic(() => import('../HomeServices'));
const HomeTrust = dynamic(() => import('../HomeTrust'));
const DeferredQuickCalculator = dynamic(() => import('./DeferredQuickCalculator'));
const HomeBlog = dynamic(() => import('../HomeBlog'));
const HomeTestimonials = dynamic(() => import('../HomeTestimonials'));
const HomeFaq = dynamic(() => import('../HomeFaq'));
const FinalCta = dynamic(() => import('../FinalCta'));

type DeferredSlotProps = {
  children: ReactNode;
  minHeight: string;
  label: string;
};

function DeferredSlot({ children, minHeight, label }: DeferredSlotProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = slotRef.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: '520px 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={slotRef}
      className="home-deferred-slot"
      style={{ minHeight }}
      aria-label={ready ? undefined : label}
      aria-busy={!ready}
    >
      {ready ? children : null}
    </div>
  );
}

export default function HomeDeferredSections() {
  return (
    <>
      <DeferredSlot minHeight="760px" label="Desteklenen hizmetler yükleniyor">
        <BrandStrip />
      </DeferredSlot>
      <DeferredSlot minHeight="300px" label="Sky Bozum deneyim bilgileri yükleniyor">
        <CredibilityBand />
      </DeferredSlot>
      <DeferredSlot minHeight="900px" label="Hizmet seçenekleri yükleniyor">
        <HomeServices />
      </DeferredSlot>
      <DeferredSlot minHeight="720px" label="Güven standardı yükleniyor">
        <HomeTrust />
      </DeferredSlot>

      <DeferredSlot minHeight="1080px" label="Hesaplama ve bilgi merkezi yükleniyor">
        <section className="render-later bg-[#05090f] py-7 sm:py-8" aria-label="Hesaplama ve bilgi merkezi">
          <div className="content-wide">
            <div className="grid items-stretch gap-4 lg:grid-cols-2">
              <DeferredQuickCalculator />
              <HomeBlog compact sidebar />
            </div>
          </div>
        </section>
      </DeferredSlot>

      <DeferredSlot minHeight="820px" label="Hizmet deneyimleri yükleniyor">
        <HomeTestimonials />
      </DeferredSlot>

      <DeferredSlot minHeight="980px" label="Sık sorulan sorular yükleniyor">
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
      </DeferredSlot>
    </>
  );
}
