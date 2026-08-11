import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Calculator from '../components/CalculatorV2';
import { toolPages } from '../lib/tools';
import { absoluteUrl } from '../lib/seo';
import './tools-center-v5.css';
import './tools-center-visuals-v6.css';
import './tools-center-standards-v7.css';
import './tools-center-density-v8.css';
import './tools-center-calculator-v11.css';
import './tools-center-scenes-v12.css';
import './tools-center-arrows-v15.css';
import './tools-center-actions-v16.css';
import './tools-center-utility-actions-v17.css';
import './tools-center-clean-v18.css';
import './tools-center-flow-v20.css';
import './tools-center-visual-layout-v21.css';
import './tools-center-explainer-v22.css';
import './tools-center-hero-flow-v23.css';
import './tools-center-action-fix-v28.css';
import './tools-center-card-density-v41.css';

export const metadata: Metadata = {
  title: { absolute: 'Araçlar ve Oran Hesaplama Merkezi | Sky Bozum' },
  description: 'Mobil ödeme ve dijital kod işlemleriniz için hesaplama, karşılaştırma ve yönlendirme araçları.',
  alternates: { canonical: '/araclar' },
};

const featured = toolPages.slice(0, 4);
const utilities = toolPages.slice(4);
const toolsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': `${absoluteUrl('/araclar')}#tools`, name: 'Sky Bozum Araç Merkezi', url: absoluteUrl('/araclar'), inLanguage: 'tr-TR', description: 'Mobil ödeme ve dijital kod işlemleri için hesaplama, karşılaştırma ve yönlendirme araçları.' },
    { '@type': 'ItemList', name: 'Sky Bozum hesaplama araçları', itemListElement: toolPages.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.shortTitle, url: absoluteUrl(tool.href), description: tool.description })) },
  ],
};
const utilityMeta: Record<string,{label:string,value:string,note:string}> = {
  'gift-card':{label:'KOD / BÖLGE',value:'Apple · Steam · Razer',note:'Bölge ve para birimini kontrol et'},
  sms:{label:'ONAY AKIŞI',value:'Tutar → SMS → Teyit',note:'Operatör limitini önceden gör'},
  'cihaz-maliyeti':{label:'MALİYET PLANI',value:'Vade · Ek bedel · Toplam',note:'Teklifin toplam maliyetini hesapla'},
  'islem-sihirbazi':{label:'AKILLI YÖNLENDİRME',value:'Ürünü seç · Yolu bul',note:'Doğru araç ve rehbere ilerle'},
};

function ToolVisual({ id }: { id: string }) {
  if (id === 'mobil-odeme') return <div className="tc-tool-visual tc-tool-visual--mobile"><div className="tc-tool-visual__logos"><Image src="/brands/vodafone/vodafone.svg" alt="Vodafone" width={36} height={36}/><Image src="/brands/turkcell/turkcell.svg" alt="Turkcell" width={36} height={36}/><Image src="/brands/turktelekom/turktelekom.svg" alt="Türk Telekom" width={36} height={36}/></div><div className="tc-tool-visual__amount"><small>İŞLEM TUTARI</small><b>5.000 TL</b></div><div className="tc-tool-visual__result"><span>TAHMİNİ KARŞILIK</span><strong>2.400 – 3.100 TL</strong></div></div>;
  if (id === 'hedef-odeme') return <div className="tc-tool-visual tc-tool-visual--target"><div><small>ELİNİZE GEÇMESİ İSTENEN</small><b>3.000 TL</b></div><span>GEREKEN BAKİYE</span><div><small>ORAN ARALIĞINA GÖRE</small><b>4.285 – 5.000 TL</b></div></div>;
  if (id === 'oran-karsilastirma') return <div className="tc-tool-visual tc-tool-visual--compare"><p>AYNI TUTAR · FARKLI KARŞILIK</p>{[['Mobil ödeme','2.400 TL','92%'],['Razer Gold','2.900 TL','78%'],['Steam','2.550 TL','62%']].map(([name,value,width])=><div key={name}><span>{name}</span><i style={{'--size':width} as React.CSSProperties}/><b>{value}</b></div>)}</div>;
  if (id === 'kod-adedi') return <div className="tc-tool-visual tc-tool-visual--codes"><p>5.000 TL BAKİYE</p><div><b>3 × 1.000</b><b>2 × 500</b><b>4 × 250</b></div><span>TOPLAM KOD DAĞILIMI</span></div>;
  if (id === 'gift-card') return <div className="tc-tool-visual tc-tool-visual--check"><p>KODU ALMADAN ÖNCE</p><div><span>01</span><b>Kod değeri</b><i>Uygun</i></div><div><span>02</span><b>Bölge</b><i>Kontrol et</i></div><div><span>03</span><b>Para birimi</b><i>Kontrol et</i></div></div>;
  if (id === 'sms') return <div className="tc-tool-visual tc-tool-visual--sms"><div><span>01</span><b>Tutarı kontrol et</b></div><i>→</i><div><span>02</span><b>SMS onayını oku</b></div><i>→</i><div><span>03</span><b>Sonucu teyit et</b></div></div>;
  return <div className="tc-tool-visual tc-tool-visual--generic"><span>PLANLA</span><b>Hesaplama aracını aç</b></div>;
}

export default function Page(){return <main className="tools-center"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }} />
  <section className="tc-hero"><div className="tc-shell tc-hero__grid"><div className="tc-hero__copy"><p className="tc-kicker"><span>SKY BOZUM</span> KARAR MERKEZİ</p><h1>Bozumdan önce<br/><em>rakamları netleştirin.</em></h1><p className="tc-lead">Mobil ödeme veya dijital kodunuzu almadan önce olası karşılığını görün, yöntemleri kıyaslayın ve doğru işlem yoluna ilerleyin.</p><div className="tc-actions"><a href="#hesapla">Hesaplamaya başla <b>↓</b></a><Link href="/araclar/islem-sihirbazi">İşlem yolunu bul <b>↗</b></Link></div><div className="tc-proof"><span><b>8</b> ücretsiz araç</span><span><b>1</b> ortak oran kaynağı</span><span><b>0</b> işlem zorunluluğu</span></div></div><aside className="tc-decision-flow" aria-label="İşlem öncesi karar akışı"><p>İŞLEM ÖNCESİ YOL HARİTASI</p><h2>Üç adımda net karar.</h2><ol><li><span>01</span><div><b>Tutarı hesaplayın</b><small>Olası karşılığı ve gereken bakiyeyi görün.</small></div></li><li><span>02</span><div><b>Yöntemi karşılaştırın</b><small>Elinizdeki bakiye türüne uygun yolu seçin.</small></div></li><li><span>03</span><div><b>Yazılı teyit alın</b><small>Satın almadan önce güncel uygunluğu doğrulayın.</small></div></li></ol><Link href="/guven-merkezi">Güvenli işlem standardı <b>→</b></Link></aside></div></section>
  <nav className="tc-nav" aria-label="Araç merkezi bölümleri"><div className="tc-shell"><a href="#hesapla">Hızlı hesaplama</a><a href="#ana-araclar">Ana araçlar</a><a href="#yardimci-araclar">Yardımcı araçlar</a><Link href="/guven-merkezi">Güven standardı</Link></div></nav>
  <section id="hesapla" className="tc-calc"><span id="oran-hesapla" className="tc-legacy-anchor" aria-hidden="true"/><div className="tc-shell"><header className="tc-section-head"><div><p>01 / CANLI HESAPLAMA</p><h2>Tutarı girin. Sonucu görün.</h2></div><span>Seçiminiz yalnızca hesaplama yapar; işlem başlatmaz.</span></header><Calculator embedded/></div></section>
  <section id="ana-araclar" className="tc-products"><div className="tc-shell"><header className="tc-section-head"><div><p>02 / ANA ARAÇLAR</p><h2>Her karar için ayrı bir çalışma ekranı.</h2></div><span>Bozum sürecinin dört temel hesabı.</span></header><div className="tc-product-list">{featured.map((tool,index)=><Link href={tool.href} className="tc-product" key={tool.id}><figure className="tc-product__visual"><ToolVisual id={tool.id}/></figure><div className="tc-product__body"><span className="tc-product__number">0{index+1}</span><div className="tc-product__title"><p>{tool.eyebrow}</p><h3>{tool.shortTitle}</h3></div><span className="tc-product__description">{tool.description}</span><strong>Aracı aç <i aria-hidden="true">→</i></strong></div></Link>)}</div></div></section>
  <section id="yardimci-araclar" className="tc-utilities"><div className="tc-shell"><header className="tc-section-head"><div><p>03 / YARDIMCI ARAÇLAR</p><h2>Kontrol, planlama ve yönlendirme.</h2></div><span>İşlemi tamamlayan dört yardımcı ekran.</span></header><div className="tc-utility-list">{utilities.map((tool,index)=>{const meta=utilityMeta[tool.id];return <Link href={tool.href} key={tool.id} className="tc-utility">{tool.id === 'gift-card' || tool.id === 'sms' ? <figure><ToolVisual id={tool.id}/></figure> : <span>0{index+5}</span>}<div><small>{meta.label}</small><h3>{meta.value}</h3><p>{meta.note}</p></div><b>Aracı aç</b></Link>})}</div></div></section>
  <section className="tc-standards"><div className="tc-shell"><header className="tc-section-head"><div><p>04 / HESAPLAMA STANDARDI</p><h2>Sonucun arkasındaki iki kontrol.</h2></div><span>Araçların tamamında aynı güvenlik yaklaşımı.</span></header><div className="tc-standard-grid"><Link href="/guven-merkezi"><figure><Image src="/images/araclar/editorial-v6/ortak-veri.webp" alt="Ortak hesaplama kaynağından araç sonuçlarına uzanan veri akışı" fill sizes="(max-width:760px) 100vw,50vw"/></figure><div><p>ORTAK VERİ KAYNAĞI</p><h3>Aynı oran. Tutarlı sonuç.</h3><span>Araçlar farklı hesaplar yapar; oran bilgisini tek merkezden alır.</span><b>Güven standardını incele →</b></div></Link><Link href="/iletisim"><figure><Image src="/images/araclar/editorial-v6/resmi-temas.webp" alt="Talebin resmî kanal üzerinden doğrulanmasını anlatan görsel" fill sizes="(max-width:760px) 100vw,50vw"/></figure><div><p>RESMÎ TEYİT</p><h3>Hesap ayrı. Kesin teklif ayrı.</h3><span>Sonuç bilgilendirme amaçlıdır; güncel uygunluk yazılı olarak doğrulanır.</span><b>Resmî kanala ilerle →</b></div></Link></div></div></section>
  <section className="tc-close"><div className="tc-shell"><p>SKY BOZUM · BOZUMCU.NET</p><h2>Önce hesaplayın.<br/><em>Sonra teyit edin.</em></h2><div><Link href="/iletisim">Resmî iletişim kanalları <b>↗</b></Link><Link href="/guven-merkezi">Güven merkezini inceleyin <b>→</b></Link></div></div></section>
</main>}
