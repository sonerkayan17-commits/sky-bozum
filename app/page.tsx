import Hero from './components/Hero';
import BrandStrip from './components/BrandStrip';
import HomeTrust from './components/HomeTrust';
import HomeServices from './components/HomeServices';
import QuickCalculator from './components/QuickCalculator';
import HomeBlog from './components/HomeBlog';
import HomeTestimonials from './components/HomeTestimonials';
import HomeFaq from './components/HomeFaq';
import FinalCta from './components/FinalCta';
import CredibilityBand from './components/CredibilityBand';
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
            <QuickCalculator compact />
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
      </section>
    </main>
  );
}
