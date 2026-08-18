import Link from './components/DeferredLink';
import Hero from './components/Hero';
import BrandStrip from './components/BrandStrip';
import HomeTrust from './components/HomeTrust';
import HomeServices from './components/HomeServices';
import DeferredQuickCalculator from './components/home/DeferredQuickCalculator';
import HomeBlog from './components/HomeBlog';
import HomeTestimonials from './components/HomeTestimonials';
import HomeFaq from './components/HomeFaq';
import FinalCta from './components/FinalCta';
import CredibilityBand from './components/CredibilityBand';
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

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <div className="render-later"><BrandStrip /></div>
      <div className="render-later"><CredibilityBand /></div>
      <div className="render-later"><HomeServices /></div>
      <div className="render-later"><HomeTrust /></div>

      <section className="render-later bg-[#05090f] py-7 sm:py-8" aria-label="Hesaplama ve bilgi merkezi">
        <div className="content-wide">
          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            <DeferredQuickCalculator />
            <HomeBlog compact sidebar />
          </div>
        </div>
      </section>

      <div className="render-later"><HomeTestimonials /></div>
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
    </main>
  );
}
