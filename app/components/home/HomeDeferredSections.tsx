'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';

type DeferredComponent = ComponentType<Record<string, never>>;

const loadBrandStrip = () => import('../BrandStrip');
const loadCredibilityBand = () => import('../CredibilityBand');
const loadHomeServices = () => import('../HomeServices');
const loadHomeTrust = () => import('../HomeTrust');
const loadHomeToolsAndBlog = () => import('./HomeToolsAndBlog');
const loadHomeTestimonials = () => import('../HomeTestimonials');
const loadHomeFaqCta = () => import('./HomeFaqCta');

type DeferredSlotProps = {
  load: () => Promise<{ default: DeferredComponent }>;
  minHeight: string;
  label: string;
};

function DeferredSlot({ load, minHeight, label }: DeferredSlotProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [LoadedComponent, setLoadedComponent] = useState<DeferredComponent | null>(null);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    void load().then(({ default: Component }) => {
      if (active) setLoadedComponent(() => Component);
    });
    return () => { active = false; };
  }, [load, ready]);

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
      aria-label={LoadedComponent ? undefined : label}
      aria-busy={!LoadedComponent}
    >
      {LoadedComponent ? <LoadedComponent /> : null}
    </div>
  );
}

export default function HomeDeferredSections() {
  return (
    <>
      <DeferredSlot load={loadBrandStrip} minHeight="760px" label="Desteklenen hizmetler yükleniyor" />
      <DeferredSlot load={loadCredibilityBand} minHeight="300px" label="Sky Bozum deneyim bilgileri yükleniyor" />
      <DeferredSlot load={loadHomeServices} minHeight="900px" label="Hizmet seçenekleri yükleniyor" />
      <DeferredSlot load={loadHomeTrust} minHeight="720px" label="Güven standardı yükleniyor" />
      <DeferredSlot load={loadHomeToolsAndBlog} minHeight="1080px" label="Hesaplama ve bilgi merkezi yükleniyor" />
      <DeferredSlot load={loadHomeTestimonials} minHeight="820px" label="Hizmet deneyimleri yükleniyor" />
      <DeferredSlot load={loadHomeFaqCta} minHeight="980px" label="Sık sorulan sorular yükleniyor" />
    </>
  );
}
