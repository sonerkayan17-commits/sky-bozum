import Hero from './components/Hero';
import HomeDeferredSections from './components/home/HomeDeferredSections';
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
      <HomeDeferredSections />
    </main>
  );
}
