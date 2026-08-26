import type { Metadata } from 'next';
import SeoToolsHub from './SeoToolsHub';
import { createMetadata } from '../../lib/seo';
import './seo-tools.css';

export const metadata: Metadata = createMetadata({ title: 'SEO ve Metin Araçları', description: 'SEO başlığı, meta açıklaması, kelime analizi, metin düzenleme ve FAQ Schema araçlarını tek sayfada ücretsiz kullanın.', path: '/araclar/seo' });

export default function Page() { return <main className="seo-tools-page"><SeoToolsHub /></main>; }
