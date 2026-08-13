import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Calculator from '../components/CalculatorV2';
import { toolPages } from '../lib/tools';
import { absoluteUrl } from '../lib/seo';
import './tools-center-rebuild-v2.css';

export const metadata: Metadata = {
  keywords: ['bozum orani hesaplama', 'mobil odeme hesaplama', 'Razer Gold hesaplama', 'oran karsilastirma', 'net odeme hesaplama', 'metin duzeltici', 'SEO araclari'],
  title: { absolute: 'Araçlar Merkezi | Sky Bozum' },
  description: 'Mobil ödeme, dijital kod, oran karşılaştırma ve metin araçlarını tek merkezden kullanın.',
  alternates: { canonical: '/araclar' },
};

const featuredIds = ['mobil-odeme', 'hedef-odeme', 'oran-karsilastirma', 'islem-sihirbazi'] as const;
const secondaryIds = ['kod-adedi', 'gift-card', 'sms', 'cihaz-maliyeti'] as const;
const seoTools = [
  ['Metin düzeltici', 'Metin yazım ve noktalama kontrolü', 'text'],
  ['Meta önizleyici', 'Arama sonucu görünümünü kontrol et', 'meta'],
  ['Kelime analizi', 'Başlık ve içerik kelime dağılımı', 'keywords'],
  ['İçerik kontrolü', 'Başlık, paragraf ve bağlantı kontrolü', 'content'],
  ['URL oluşturucu', 'Düzenli ve okunabilir bağlantı üret', 'url'],
  ['FAQ Schema', 'SSS yapılandırılmış verisi oluştur', 'faq'],
  ['UTM bağlantısı', 'Kampanya bağlantılarını hazırla', 'utm'],
  ['Okuma analizi', 'Kelime ve tahmini okuma süresi', 'reading'],
] as const;

const toolsSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Sky Bozum Araçlar Merkezi',
  url: absoluteUrl('/araclar'),
  inLanguage: 'tr-TR',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: toolPages.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: absoluteUrl(tool.href),
    })),
  },
};

function getTool(id: string) {
  return toolPages.find((tool) => tool.id === id)!;
}

function ToolImage({ id }: { id: string }) {
  return <div className={`tc2-image tc2-atlas tc2-atlas--${id}`} role="img" aria-label={`${id} aracı görseli`} />;
}

export default function Page() {
  return <main className="tools-center tc2-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }} />

    <section className="tc2-hero">
      <div className="tc2-shell tc2-hero-grid">
        <div className="tc2-hero-copy">
          <p className="tc2-eyebrow">SKY BOZUM / ARAÇLAR</p>
          <h1>Araçlar<br /><span>Merkezi</span></h1>
          <p>Günlük işlemlerinizi hızlı ve doğru şekilde hesaplayın, karşılaştırın ve yönetin.</p>
          <div className="tc2-quick-picks" aria-label="Araç merkezi kullanım alanları">
            <div><span>01</span><b>Hesapla</b><small>Oran ve karşılık</small></div>
            <div><span>02</span><b>Karşılaştır</b><small>Farklı hizmetler</small></div>
            <div><span>03</span><b>Yönünü bul</b><small>Doğru işlem adımı</small></div>
          </div>
        </div>
        <div className="tc2-featured-calculator">
          <div className="tc2-panel-heading"><span className="tc2-panel-icon">+</span><h2>Mobil ödeme hesaplama</h2></div>
          <Calculator embedded />
        </div>
      </div>
    </section>

    <section className="tc2-section tc2-featured-section">
      <div className="tc2-shell">
        <div className="tc2-section-heading"><div><p className="tc2-eyebrow">01 / TEMEL ARAÇLAR</p><h2>İşlemin için doğru aracı seç.</h2></div><span>En çok kullanılan hesaplama ve yönlendirme araçları.</span></div>
        <div className="tc2-featured-grid">{featuredIds.map((id) => { const tool = getTool(id); return <Link href={tool.href} className="tc2-featured-card" key={id}><ToolImage id={id} /><div className="tc2-card-footer"><div><span>{tool.eyebrow}</span><h3>{tool.shortTitle}</h3></div><b aria-hidden="true">→</b></div></Link>; })}</div>
      </div>
    </section>

    <section className="tc2-section tc2-lower-section">
      <div className="tc2-shell tc2-lower-grid">
        <div className="tc2-secondary-block"><div className="tc2-section-heading tc2-section-heading--compact"><div><p className="tc2-eyebrow">02 / DİĞER İŞLEM ARAÇLARI</p><h2>İşlemi tamamlayan araçlar.</h2></div></div><div className="tc2-tool-list">{secondaryIds.map((id) => { const tool = getTool(id); return <Link href={tool.href} className="tc2-list-row" key={id}><span className="tc2-list-icon">+</span><div><h3>{tool.shortTitle}</h3><p>{tool.description}</p></div><b aria-hidden="true">→</b></Link>; })}</div></div>
        <div className="tc2-seo-block"><div className="tc2-section-heading tc2-section-heading--compact"><div><p className="tc2-eyebrow">03 / SEO VE METİN</p><h2>İçeriğini güçlendir.</h2></div></div><div className="tc2-seo-visual"><Image src="/images/araclar/sky-seo-tools-v1.png" alt="Mobil ödeme ve dijital kod içerikleri için metin ve SEO çalışma alanı" fill sizes="(max-width: 900px) 100vw, 30vw" /></div><div className="tc2-seo-list">{seoTools.map(([label, description, tab]) => <Link href={`/araclar/seo?tab=${tab}`} key={tab}><span>{label}</span><small>{description}</small><b aria-hidden="true">→</b></Link>)}</div></div>
      </div>
    </section>
  </main>;
}
