import Link from 'next/link';
import Image from 'next/image';

type ArtworkItem = {
  src: string;
  label: string;
  className?: string;
};

const highlights = [
  {
    service: 'Razer Gold',
    tag: 'Kod bozum akışı',
    quote: 'Kod türü, tutar ve güncel oran işlem başlamadan önce yazılı olarak netleştirilir.',
    accent: 'rose',
    href: '/hizmetler/razer-gold-tl',
    visual: 'code',
    artwork: [
      { src: '/brands/razer/razer.svg', label: 'Razer Gold', className: 'experience-logo--razer' },
    ],
  },
  {
    service: 'Mobil Ödeme',
    tag: 'Operatör süreci',
    quote: 'Vodafone, Turkcell ve Türk Telekom için limit, yöntem ve işlem adımları ayrı ayrı açıklanır.',
    accent: 'gold',
    href: '/operatorler',
    visual: 'operators',
    artwork: [
      { src: '/brands/vodafone/vodafone.svg', label: 'Vodafone' },
      { src: '/brands/turkcell/turkcell.svg', label: 'Turkcell' },
      { src: '/brands/turktelekom/turktelekom.svg', label: 'Türk Telekom' },
    ],
  },
  {
    service: 'iTunes / Apple',
    tag: 'Hediye kartı',
    quote: 'Apple Gift Card bölgesi ve kod uygunluğu kontrol edilir; kesin oran onaydan önce paylaşılır.',
    accent: 'slate',
    href: '/hizmetler/itunes-apple',
    visual: 'apple',
    artwork: [
      { src: '/brands/apple/apple.svg', label: 'Apple', className: 'experience-logo--apple' },
    ],
  },
  {
    service: 'Paycell & Pokus',
    tag: 'Dijital cüzdan',
    quote: 'Cüzdan türüne göre doğru satın alma yöntemi, bakiye kontrolü ve ödeme akışı gösterilir.',
    accent: 'violet',
    href: '/hizmetler/paycell',
    visual: 'wallets',
    artwork: [
      { src: '/brands/paycell/paycell.svg', label: 'Paycell' },
      { src: '/brands/pokus/pokus.svg', label: 'Pokus' },
    ],
  },
  {
    service: 'Banka / Kredi Kartı',
    tag: 'Kart çözümleri',
    quote: 'Kredi kartı ve sanal kart için desteklenen ürün, mağaza ve uygunluk koşulları önceden doğrulanır.',
    accent: 'blue',
    href: '/hizmetler/kredi-karti-sanal-kart',
    visual: 'cards',
    artwork: [
      { src: '/brands/visa/visa.svg', label: 'Visa' },
      { src: '/brands/mastercard/mastercard.svg', label: 'Mastercard' },
    ],
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

function ServiceArtwork({ items, visual }: { items: readonly ArtworkItem[]; visual: string }) {
  return (
    <div className={`experience-artwork experience-artwork--${visual}`} aria-hidden="true">
      <div className="experience-artwork-grid" />
      <div className="experience-artwork-glow" />
      <div className="experience-artwork-orbit experience-artwork-orbit--one" />
      <div className="experience-artwork-orbit experience-artwork-orbit--two" />
      <div className="experience-artwork-logos">
        {items.map((item, index) => (
          <span key={item.src} className={`experience-logo experience-logo--${index + 1} ${item.className ?? ''}`}>
            <Image src={item.src} alt="" fill sizes="96px" className="object-contain" />
          </span>
        ))}
      </div>
      <span className="experience-artwork-status"><i /> DOĞRULANDI</span>
      <span className="experience-artwork-code">{visual === 'cards' ? 'FAST / 3D SECURE' : visual === 'operators' ? '3 OPERATÖR' : visual === 'wallets' ? 'ANLIK BAKİYE' : visual === 'apple' ? 'GIFT CARD' : 'KOD KONTROL'}</span>
    </div>
  );
}

export default function HomeTestimonials() {
  return (
    <section className="experience-showcase" aria-labelledby="experience-title">
      <div className="content-wide experience-shell">
        <div className="experience-heading">
          <div>
            <p className="eyebrow">İşlem deneyimi</p>
            <h2 id="experience-title" className="experience-title">İşlem boyunca sizi ne bekler?</h2>
            <p className="experience-intro">En sık kullanılan hizmetlerde kontrol, oran teyidi ve ödeme adımlarını baştan görün.</p>
          </div>
          <Link href="/hizmetler" className="experience-link">Tüm hizmetleri incele <span aria-hidden="true">→</span></Link>
        </div>

        <div className="experience-grid experience-grid--five">
          {highlights.map((item, index) => (
            <Link key={item.service} href={item.href} className={`experience-card experience-card--${item.accent}`} aria-label={`${item.service} hizmet sayfasını aç`}>
              <div className="experience-card-top">
                <span className="experience-index">0{index + 1}</span>
                <span className="experience-chip">Hizmet rehberi</span>
              </div>
              <ServiceArtwork items={item.artwork} visual={item.visual} />
              <p className="experience-tag">{item.tag}</p>
              <h3>{item.service}</h3>
              <p className="experience-quote">{item.quote}</p>
              <div className="experience-card-footer">
                <span className="experience-check"><ShieldCheck /></span>
                <span>Detaylı rehberi aç</span><span className="ml-auto" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="experience-trustbar">
          <div className="experience-trust-icon"><ShieldCheck /></div>
          <div><strong>İşlem öncesinde net bilgi</strong><p>Hizmet yöntemi ve kesin oran, kod veya bakiye paylaşılmadan önce yazılı olarak teyit edilir.</p></div>
          <Link href="/iletisim">Süreci sorun <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
