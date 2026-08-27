"use client";

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from './DeferredLink';
import { useSiteSettings } from './SiteSettingsProvider';
import { InlineEditableImage, InlineEditableText } from './admin/SiteInlineEditor';
import usePublishedRates from './personalization/usePublishedRates';
import { prefersReducedMotion } from '../lib/motion';
import CredibilityBand from './CredibilityBand';

const featuredIds = ['vodafone', 'turkcell', 'turk-telekom', 'paycell', 'pokus', 'apple', 'razer-tl', 'steam'];
const logos: Record<string, string> = {
  vodafone: '/brands/vodafone/vodafone.svg',
  turkcell: '/brands/turkcell/turkcell.svg',
  'turk-telekom': '/brands/turktelekom/turktelekom.svg',
  paycell: '/brands/paycell/paycell.svg',
  pokus: '/brands/pokus/pokus.svg',
  apple: '/brands/apple/apple.svg',
  'razer-tl': '/brands/razer/razer.svg',
  steam: '/brands/steam/steam.svg',
};

const referenceAssetNames = Array.from({ length: 15 }, (_, index) => {
  const id = String(index + 1).padStart(2, '0');
  return `reference-verified-${id}-r3.webp`;
}).filter((assetName) => assetName !== 'reference-verified-08-r3.webp');

const referenceSlides = referenceAssetNames.map((assetName, index) => ({
  src: `/references/${assetName}`,
  alt: `Redakte edilmiş gerçek işlem referansı ${index + 1}. Kişisel bilgiler gizlenmiştir.`,
}));

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(prefersReducedMotion());
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function DashboardSlide({ whatsapp }: { whatsapp: string }) {
  return (
    <div className="hero-reference-dashboard">
      <div className="hero-pro-apphead">
        <div className="hero-pro-appbrand"><InlineEditableImage contentKey="home.hero.app-logo" defaultSrc="/brand-logo.webp" alt="Sky Bozum amblemi" width={38} height={38} /><span><b>Sky Bozum</b><small>İşlem merkezi</small></span></div>
        <span className="hero-pro-appbadge">Yazılı teyit</span>
      </div>

      <div className="hero-pro-summary">
        <small>Tahmini ödeme</small>
        <strong>3.500,00 <span>TL</span></strong>
        <div><span>5.000 TL bakiye</span><b>%70 taban oran</b></div>
      </div>

      <div className="hero-pro-trust-card" aria-label="Sky Bozum güvenli hizmet mesajı">
        <div className="hero-pro-trust-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M12 2.8 19 5.7v5.2c0 4.8-2.8 8.3-7 10.3-4.2-2-7-5.5-7-10.3V5.7L12 2.8Z" />
            <path d="m8.8 12 2 2 4.5-4.7" />
          </svg>
        </div>
        <div className="hero-pro-trust-message">
          <small>SKY BOZUM</small>
          <strong>Güvenli bozumun<br />tek adresi!</strong>
          <span><i>✓</i> Kontrollü süreç <i>✓</i> Hızlı ödeme</span>
        </div>
        <svg className="hero-pro-trust-watermark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.8 19 5.7v5.2c0 4.8-2.8 8.3-7 10.3-4.2-2-7-5.5-7-10.3V5.7L12 2.8Z" />
          <path d="m8.8 12 2 2 4.5-4.7" />
        </svg>
      </div>

      <div className="hero-pro-flow">
        <div><i>1</i><span><b>Hizmeti seçin</b><small>Bakiyenizi belirtin</small></span></div>
        <div><i>2</i><span><b>Oranı onaylayın</b><small>Yazılı teyit alın</small></span></div>
        <div><i>3</i><span><b>Ödemenizi alın</b><small>Kontrol sonrası aktarım</small></span></div>
      </div>

      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hero-pro-phone-cta">İşleme başlayın <span>→</span></a>
    </div>
  );
}

function ReferenceCarousel({ whatsapp }: { whatsapp: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesReady, setSlidesReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const slideCount = referenceSlides.length + 1;
  const currentLabel = useMemo(() => activeIndex === 0 ? 'Ana ekran' : `${activeIndex} / ${referenceSlides.length}`, [activeIndex]);

  // Keep the first paint focused on the dashboard. Reference images are still
  // available immediately on interaction, then mounted once the first view is
  // settled so they do not compete with the homepage LCP/layout pass.
  useEffect(() => {
    const timer = window.setTimeout(() => setSlidesReady(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  const slideClassName = (index: number) => {
    const previousIndex = (activeIndex - 1 + slideCount) % slideCount;
    const nextIndex = (activeIndex + 1) % slideCount;
    const position = index === activeIndex ? 'is-active' : index === previousIndex ? 'is-prev' : index === nextIndex ? 'is-next' : '';
    return `hero-reference-slide ${position}`.trim();
  };

  const previous = () => {
    setSlidesReady(true);
    setActiveIndex((current) => current === 0 ? referenceSlides.length : current - 1);
  };
  const next = () => {
    setSlidesReady(true);
    setActiveIndex((current) => current >= referenceSlides.length ? 1 : current + 1);
  };

  useEffect(() => {
    if (!slidesReady || paused || reducedMotion) return;
    const timer = window.setTimeout(() => setActiveIndex((current) => current >= referenceSlides.length ? 1 : current + 1), 1500);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, reducedMotion, slidesReady]);

  return (
    <div
      className="hero-reference-carousel"
      aria-roledescription="carousel"
      aria-label="Gerçek işlem referansları. Kişisel bilgiler gizlenmiştir."
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          previous();
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          next();
        }
      }}
      onTouchStart={(event) => { startX.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (startX.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
        startX.current = null;
        if (Math.abs(delta) < 34) return;
        if (delta > 0) previous();
        else next();
      }}
    >
      <div className="hero-reference-frame">
        <div className="hero-reference-track">
          <div className={slideClassName(0)} aria-hidden={activeIndex !== 0}>
            <DashboardSlide whatsapp={whatsapp} />
          </div>
          {(slidesReady ? referenceSlides : []).map((slide, index) => (
            <div
              className={slideClassName(index + 1)}
              key={slide.src}
              aria-hidden={index + 1 !== activeIndex}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 430px) 176px, (max-width: 800px) 208px, 226px"
              />
            </div>
          ))}
        </div>
      </div>
      {activeIndex > 0 && <div className="hero-reference-head">
        <div>
          <small>Gerçek işlem referansları</small>
          <strong>Kişisel bilgiler gizlenmiştir</strong>
        </div>
        <span aria-live="polite">{currentLabel}</span>
      </div>}
      <div className={`hero-reference-controls ${activeIndex === 0 ? 'is-dashboard' : ''}`}>
        <button type="button" onClick={previous} aria-label="Önceki referansı göster">‹</button>
        <span className="hero-reference-position" aria-live="polite">{currentLabel}</span>
        <button type="button" onClick={next} aria-label="Sonraki referansı göster">›</button>
      </div>
    </div>
  );
}

export default function Hero() {
  const settings = useSiteSettings();
  const publishedRates = usePublishedRates();
  const featuredRates = featuredIds
    .map((id) => publishedRates.find((item) => item.id === id))
    .filter((item): item is (typeof publishedRates)[number] => Boolean(item));

  return (
    <section className="hero-pro" aria-labelledby="hero-title">
      <div className="hero-pro-grid" aria-hidden="true" />
      <div className="hero-pro-glow hero-pro-glow-one" aria-hidden="true" />
      <div className="hero-pro-glow hero-pro-glow-two" aria-hidden="true" />

      <div className="content-shell hero-pro-shell">
        <div className="hero-pro-copy">
          <InlineEditableText contentKey="home.hero.title" defaultValue={settings.heroTitle} as="h1" id="hero-title" multiline />
          <InlineEditableText contentKey="home.hero.lead.purchase-guides-v1" defaultValue={settings.heroLead} as="p" className="hero-pro-lead" multiline />
          <p className="hero-pro-assurance">10+ yılı aşkın tecrübe · 7/24 canlı destek</p>

          <div className="hero-pro-actions">
            <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="hero-pro-primary">{settings.heroPrimaryCta} <span>→</span></a>
            <Link href="/araclar#oran-hesapla" className="hero-pro-secondary">Oran hesaplayın</Link>
          </div>

          <div className="hero-pro-trust" aria-label="Hizmet avantajları">
            <div><span>01</span><b>İşlem öncesi oran</b><small>Sürpriz kesinti yok</small></div>
            <div><span>02</span><b>Kontrollü süreç</b><small>Yazılı teyit ile ilerleme</small></div>
            <div><span>03</span><b>Hızlı ödeme</b><small>Onay sonrası aktarım</small></div>
          </div>
        </div>

        <div className="hero-pro-visual" aria-label="Sky Bozum mobil işlem ekranı örneği">
          <div className="hero-pro-orbit hero-pro-orbit-a" aria-hidden="true" />
          <div className="hero-pro-orbit hero-pro-orbit-b" aria-hidden="true" />

          <div className="hero-pro-note hero-pro-note-rate"><small>ÖRNEK TABAN ORAN</small><strong>%70</strong><span>Hizmete göre değişebilir</span></div>
          <div className="hero-pro-note hero-pro-note-secure"><b>✓</b><span><strong>Kontrollü işlem</strong><small>Önce bilgi, sonra onay</small></span></div>

          <div className="hero-pro-phone">
            <div className="hero-pro-phone-rail" aria-hidden="true" />
            <div className="hero-pro-screen">
              <div className="hero-pro-island" aria-hidden="true" />
              <div className="hero-pro-status"><span>09:41</span><span>● ◒ ▰</span></div>
              <ReferenceCarousel whatsapp={settings.whatsapp} />
              <div className="hero-pro-homebar" aria-hidden="true" />
            </div>
          </div>
        </div>

        <aside className="hero-pro-rates" aria-label="Güncel taban oranlar" data-site-editor-protected="true">
          <div className="hero-pro-rates-head">
            <div><small>TABAN ORAN ARALIKLARI</small><h2>Hizmetlere göre oranlar</h2></div>
            <span>İşlem öncesi teyit</span>
          </div>
          <div className="hero-pro-rates-list">
            {featuredRates.map((item) => (
              <Link
                href={`/hizmetler/${item.serviceSlug}`}
                className="hero-pro-rate"
                key={item.id}
                title={`${item.name} detaylarını görüntüle`}
              >
                <span className={`hero-pro-logo hero-pro-logo--${item.id} ${item.id === 'apple' ? 'hero-pro-logo--light' : ''}`}>
                  <Image src={logos[item.id]} alt={`${item.name} logosu`} width={78} height={26} />
                </span>
                <span className="hero-pro-rate-copy">
                  <b>{item.name}</b>
                  <small>{item.category}</small>
                  <span className="hero-pro-rate-detail" aria-hidden="true">Detayları görüntüle <i>→</i></span>
                </span>
                <strong>{item.range}</strong>
              </Link>
            ))}
          </div>
          <Link href="/hizmetler" className="hero-pro-rates-cta">Tüm hizmet ve oran detayları <span>→</span></Link>
        </aside>

        <div className="hero-pro-credibility">
          <CredibilityBand compact />
        </div>
      </div>
    </section>
  );
}
