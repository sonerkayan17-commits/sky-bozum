import Image from 'next/image';
import Link from './DeferredLink';

type ArtworkItem = {
  src: string;
  label: string;
  className?: string;
};

type Highlight = {
  service: string;
  tag: string;
  quote: string;
  accent: 'rose' | 'gold' | 'slate' | 'violet' | 'blue';
  href: string;
  visual: string;
  artwork?: readonly ArtworkItem[];
  cover?: string;
  coverAlt?: string;
  status: string;
  footer: string;
};

const highlights: readonly Highlight[] = [
  {
    service: 'Razer Gold, Apple & Steam',
    tag: 'Dijital kod rehberleri',
    quote: 'Kod bölgesi, para birimi, kullanım ve değerlendirme koşullarını tek merkezde karşılaştırın.',
    accent: 'rose',
    href: '/bilgi-merkezi/dijital-kod-hediye-karti-rehberi',
    visual: 'codes',
    artwork: [
      { src: '/brands/razer/razer.svg', label: 'Razer Gold', className: 'experience-logo--razer' },
      { src: '/brands/apple/apple.svg', label: 'Apple', className: 'experience-logo--apple' },
      { src: '/brands/steam/steam.svg', label: 'Steam', className: 'experience-logo--steam' },
    ],
    status: '3 KOD GRUBU',
    footer: 'Kod rehberlerini aç',
  },
  {
    service: 'Turkcell, Vodafone & Türk Telekom',
    tag: 'Operatör rehberleri',
    quote: 'Limit, onay, faturalandırma ve dijital ürün satın alma adımlarındaki farkları görün.',
    accent: 'gold',
    href: '/operatorler',
    visual: 'operators',
    artwork: [
      { src: '/brands/turkcell/turkcell.svg', label: 'Turkcell' },
      { src: '/brands/vodafone/vodafone.svg', label: 'Vodafone' },
      { src: '/brands/turktelekom/turktelekom.svg', label: 'Türk Telekom' },
    ],
    status: '3 OPERATÖR',
    footer: 'Operatörleri incele',
  },
  {
    service: 'Paycell, Pokus & Vodafone Pay',
    tag: 'Dijital cüzdan rehberleri',
    quote: 'Bakiye, limit ve desteklenen mağazalarda dijital ürün satın alma seçeneklerini öğrenin.',
    accent: 'violet',
    href: '/bilgi-merkezi/kategori/dijital-cuzdanlar',
    visual: 'wallets',
    artwork: [
      { src: '/brands/paycell/paycell.svg', label: 'Paycell' },
      { src: '/brands/pokus/pokus.svg', label: 'Pokus' },
      { src: '/brands/vodafone/vodafone.svg', label: 'Vodafone Pay' },
    ],
    status: '3 CÜZDAN',
    footer: 'Cüzdan rehberlerini aç',
  },
  {
    service: 'Turkcell, Vodafone, Türk Telekom Karşılaştırması',
    tag: '2026 karşılaştırma rehberi',
    quote: 'Turkcell, Vodafone ve Türk Telekom için limit, onay ve kullanım farklarını yan yana inceleyin.',
    accent: 'gold',
    href: '/bilgi-merkezi/turkcell-vodafone-turk-telekom-mobil-bozum-karsilastirmasi-2026',
    visual: 'editorial',
    cover: '/blog-covers/operator-karsilastirma.webp',
    coverAlt: 'Turkcell, Vodafone ve Türk Telekom mobil ödeme karşılaştırma rehberi',
    status: 'GÜNCEL REHBER',
    footer: 'Karşılaştırmayı oku',
  },
  {
    service: 'Güvenilir Mobil Bozum Sitesi Nasıl Seçilir?',
    tag: '10 güvenlik kontrolü',
    quote: 'Alan adı, yazılı tutar, resmî iletişim ve kişisel bilgi sınırlarını işlemden önce doğrulayın.',
    accent: 'blue',
    href: '/bilgi-merkezi/guvenilir-mobil-bozum-sitesi-nasil-secilir',
    visual: 'editorial',
    cover: '/images/bilgi-merkezi/editorial-covers-v46/mobil-odeme-guvenlik-rehberi-v2.webp',
    coverAlt: 'Güvenilir mobil bozum sitesi seçim rehberi',
    status: '10 KONTROL',
    footer: 'Güvenlik rehberini oku',
  },
  {
    service: 'Sahte Mobil Bozum Sitesi Nasıl Anlaşılır?',
    tag: '7 kırmızı bayrak',
    quote: 'Taklit alan adı, şifre talebi, acele baskısı ve belirsiz ödeme vaatlerini erken fark edin.',
    accent: 'rose',
    href: '/bilgi-merkezi/mobil-bozum-yaparken-dolandirilabilir-miyim',
    visual: 'editorial',
    cover: '/images/bilgi-merkezi/editorial-covers-v46/mobil-bozum-dolandiricilik-kontrolu-v2.webp',
    coverAlt: 'Sahte mobil bozum sitesi ve dolandırıcılık işaretleri',
    status: '7 UYARI',
    footer: 'Kırmızı bayrakları gör',
  },
] as const;

function ShieldCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 19 6v5.3c0 4.4-2.8 7.7-7 9.7-4.2-2-7-5.3-7-9.7V6l7-3Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.7 12 2.1 2.1 4.5-4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceArtwork({ artwork, visual, cover, coverAlt, status }: Pick<Highlight, 'artwork' | 'visual' | 'cover' | 'coverAlt' | 'status'>) {
  return (
    <div className={`experience-artwork experience-artwork--${visual}`}>
      {cover ? <Image src={cover} alt={coverAlt ?? ''} fill sizes="(max-width: 640px) 45vw, (max-width: 900px) 42vw, 30vw" className="experience-artwork-cover" /> : null}
      <div className="experience-artwork-grid" aria-hidden="true" />
      <div className="experience-artwork-glow" aria-hidden="true" />
      <div className="experience-artwork-orbit experience-artwork-orbit--one" aria-hidden="true" />
      <div className="experience-artwork-orbit experience-artwork-orbit--two" aria-hidden="true" />
      {artwork?.length ? (
        <div className="experience-artwork-logos" aria-hidden="true">
          {artwork.map((item, index) => (
            <span key={`${item.src}-${index}`} className={`experience-logo experience-logo--${index + 1} ${item.className ?? ''}`}>
              <Image src={item.src} alt="" fill sizes="96px" className="object-contain" />
            </span>
          ))}
        </div>
      ) : null}
      <span className="experience-artwork-status"><i /> DOĞRULANDI</span>
      <span className="experience-artwork-code">{status}</span>
    </div>
  );
}

export default function HomeTestimonials() {
  return (
    <section className="experience-showcase experience-showcase--compact" aria-labelledby="experience-title">
      <div className="content-wide experience-shell">
        <div className="experience-heading">
          <div>
            <p className="eyebrow">Rehberler ve önemli kontroller</p>
            <h2 id="experience-title" className="experience-title">İşleminize uygun bilgiye doğrudan ulaşın.</h2>
            <p className="experience-intro">Hizmetleri üç anlaşılır grupta inceleyin; karşılaştırma ve güvenlik rehberlerinden doğru adımı seçin.</p>
          </div>
          <Link href="/bilgi-merkezi" className="experience-link">Tüm rehberleri incele <span aria-hidden="true">→</span></Link>
        </div>

        <div className="experience-grid experience-grid--five">
          {highlights.map((item, index) => (
            <Link key={item.service} href={item.href} className={`experience-card experience-card--${item.accent}`} aria-label={`${item.service} sayfasını aç`}>
              <div className="experience-card-top">
                <span className="experience-index">0{index + 1}</span>
                <span className="experience-chip">{index < 3 ? 'Hizmet grubu' : 'Önemli rehber'}</span>
              </div>
              <ServiceArtwork artwork={item.artwork} visual={item.visual} cover={item.cover} coverAlt={item.coverAlt} status={item.status} />
              <p className="experience-tag">{item.tag}</p>
              <h3>{item.service}</h3>
              <p className="experience-quote">{item.quote}</p>
              <div className="experience-card-footer">
                <span className="experience-check"><ShieldCheck /></span>
                <span>{item.footer}</span><span className="ml-auto" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="experience-trustbar">
          <div className="experience-trust-icon"><ShieldCheck /></div>
          <div><strong>Satın almadan önce dört kontrol</strong><p>Ürün, tutar, bölge ve teslim koşulunu doğrulayın; şifre veya SMS kodunuzu paylaşmayın.</p></div>
          <Link href="/bilgi-merkezi/guvenilir-mobil-bozum-sitesi-nasil-secilir">Kontrol listesini aç <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
