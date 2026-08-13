import type { Metadata } from 'next';
import SeoToolsHub from './SeoToolsHub';
import './seo-tools.css';

export const metadata: Metadata = { title: 'SEO ve Metin Araçları | Sky Bozum', description: 'SEO başlık, metin düzeltme, kelime analizi, FAQ Schema ve içerik araçları.' };

export default function Page() { return <main className="seo-tools-page"><SeoToolsHub /></main>; }
