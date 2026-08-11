import type {Metadata, Viewport} from 'next';
import './globals.css';
import './styles/site-search-fix.css';
import Navbar from './components/NavbarV2';
import Footer from './components/Footer';
import VisitorExperienceProvider from './components/personalization/VisitorExperienceProvider';
import { siteConfig } from './lib/site-config';
import { DEFAULT_OG_IMAGE, SITE_LANGUAGE, SITE_LOCALE, SITE_NAME, SITE_URL, jsonLd } from './lib/seo';
import QuickActionDock from './components/QuickActionDock';
import SiteBackButton from './components/SiteBackButton';


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: '#090b10',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Sky Bozum - Mobil Ödeme ve Dijital Bakiye Bozum', template: '%s | Sky Bozum' },
  description: 'Razer Gold, Paycell, Pokus, Vodafone, Turkcell, Türk Telekom, Apple ve Steam işlemleri için oran hesaplama, rehber ve destek.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  icons: { icon: '/brand-logo.webp', apple: '/brand-logo.webp' },
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: {
    title: 'Sky Bozum - Dijital Bakiyeniz, Doğrudan Nakde',
    description: 'Mobil ödeme ve dijital bakiyeler için oran hesaplama, rehber ve kontrollü destek.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1600, height: 900, alt: 'Sky Bozum dijital bakiye işlem merkezi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Mobil ödeme ve dijital bakiye işlemleri için rehber ve oran bilgisi.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: siteConfig.name, url: SITE_URL, logo: `${SITE_URL}/brand-logo.webp`, email: siteConfig.email, telephone: siteConfig.phone.replace(/\D/g, '').replace(/^0/, '+90') },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: siteConfig.name, inLanguage: SITE_LANGUAGE, publisher: { '@id': `${SITE_URL}/#organization` }, potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/bilgi-merkezi?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
  ],
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr" suppressHydrationWarning className=""><body className="min-h-screen bg-[#090b10] text-white antialiased"><div className="grain-overlay" aria-hidden="true"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(structuredData)}}/><VisitorExperienceProvider><a href="#site-content" className="skip-link">Ana içeriğe geç</a><Navbar/><SiteBackButton/><div id="site-content" tabIndex={-1}>{children}</div><Footer/><QuickActionDock/></VisitorExperienceProvider></body></html>}
