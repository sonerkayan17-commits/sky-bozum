import type { Metadata } from 'next';
import SeoToolsHub from './SeoToolsHub';
import './seo-tools.css';

export const metadata: Metadata = { title: 'SEO ve Metin Araclari | Sky Bozum', description: 'SEO baslik, metin duzeltme, kelime analizi, FAQ Schema ve icerik araclari.', alternates: { canonical: '/araclar/seo' } };

export default function Page() { return <main className="seo-tools-page"><SeoToolsHub /></main>; }
