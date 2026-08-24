import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Link from './components/DeferredLink';
import Hero from './components/Hero';
import BrandStrip from './components/BrandStrip';
import HomeTrust from './components/HomeTrust';
import HomeServices from './components/HomeServices';
import HomeBlog from './components/HomeBlog';
import HomeTestimonials from './components/HomeTestimonials';
import FinalCta from './components/FinalCta';
import DeferredViewportSection from './components/home/DeferredViewportSection';

// Keep the complete page in the server HTML for SEO, while splitting interactive
// below-the-fold islands out of the first client bundle.
const DeferredQuickCalculator = dynamic(() => import('./components/home/DeferredQuickCalculator'));
const HomeFaq = dynamic(() => import('./components/HomeFaq'));
import './styles/homepage-legacy.css';
import './styles/homepage-polish.css';
import './styles/content-services-core.css';
import './styles/content-services.css';
import './styles/home-density-fix.css';
import './styles/home-contact-band.css';
import './styles/home-contact-band-final.css';
import './styles/home-trust-editorial.css';
import './styles/home-trust-showcase.css';
import './styles/credibility-band.css';
import './styles/quality-80-pass.css';
import './styles/homepage-flow.css';
import './styles/home-experience-cards.css';

const homeSeoDescription = 'Mobil ödeme bozdurma ve mobil bozum rehberlerini; operatörlerle dijital ürün satın alma adımlarını ve desteklenen dijital kod oranlarını inceleyin.';

export const metadata: Metadata = {
  title: { absolute: 'Mobil Ödeme Bozdurma ve Mobil Bozum | Sky Bozum' },
  description: homeSeoDescription,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Mobil Ödeme Bozdurma ve Mobil Bozum | Sky Bozum',
    description: homeSeoDescription,
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobil Ödeme Bozdurma ve Mobil Bozum | Sky Bozum',
    description: homeSeoDescription,
  },
};

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <div className="home-flow">
        <DeferredViewportSection className="render-later home-flow-band home-flow-band--brands" desktopHeight={430} mobileHeight={646}><BrandStrip /></DeferredViewportSection>
        <DeferredViewportSection className="render-later home-flow-band home-flow-band--services" desktopHeight={650} mobileHeight={1075}><HomeServices /></DeferredViewportSection>
        <DeferredViewportSection className="render-later home-flow-band home-flow-band--trust" desktopHeight={590} mobileHeight={699}><HomeTrust /></DeferredViewportSection>

        <DeferredViewportSection className="render-later home-flow-band home-flow-band--calculator" desktopHeight={500} mobileHeight={850}>
          <section className="home-calculator-band" aria-label="Hesaplama ve bilgi merkezi">
            <div className="content-wide">
              <div className="grid items-stretch gap-4 lg:grid-cols-2">
                <DeferredQuickCalculator />
                <HomeBlog compact sidebar />
              </div>
            </div>
          </section>
        </DeferredViewportSection>

        <DeferredViewportSection className="render-later home-flow-band home-flow-band--experience" desktopHeight={1020} mobileHeight={1230}><HomeTestimonials /></DeferredViewportSection>
        <DeferredViewportSection className="render-later home-flow-band home-flow-band--closing" desktopHeight={760} mobileHeight={1242}>
          <section className="home-final-section content-wide rhythm-md">
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
              <Link href="/iletisim#guvenlik" className="transition hover:text-rose-300">Güvenli İletişim</Link>
            </nav>
          </section>
        </DeferredViewportSection>
      </div>
    </main>
  );
}
