import Link from 'next/link';
import { siteConfig } from '../lib/site';

const supportPoints = [
  { title: 'Yazılı teklif', text: 'Oran ve yaklaşık ödeme işlemden önce paylaşılır.', icon: 'doc' },
  { title: 'Gerekli bilgi kadar', text: 'Yalnızca teklif ve işlem için gereken bilgiler istenir.', icon: 'lock' },
  { title: 'Açık işlem akışı', text: 'Teklif, onay ve ödeme aşamaları yazılı ilerler.', icon: 'flow' },
] as const;

function Icon({ type }: { type: string }) {
  const path = type === 'lock' ? 'M7 10V7a5 5 0 0 1 10 0v3m-11 0h12v11H6V10Z' : type === 'flow' ? 'M5 7h9m0 0-3-3m3 3-3 3M19 17h-9m0 0 3-3m-3 3 3 3' : 'M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h6M10 17h6';
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={path} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function FinalCta() {
  return (
    <div className="home-support-card" aria-labelledby="support-card-title">
      <div className="home-support-card__orb home-support-card__orb--one" aria-hidden="true" />
      <div className="home-support-card__orb home-support-card__orb--two" aria-hidden="true" />
      <div className="home-support-card__content">
        <span className="home-support-card__badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1.1-5a8.4 8.4 0 0 1 8.5-11.4A8.4 8.4 0 0 1 21 11.5Z" /></svg>
          Bozum teklifi
        </span>

        <div className="home-support-card__heading">
          <p>Hızlı ve yazılı</p>
          <h2 id="support-card-title">Hizmeti ve tutarı iletin, bozum teklifinizi alın.</h2>
          <span>Oran, yaklaşık ödeme ve işlem koşulları onayınızdan önce yazılı olarak paylaşılır.</span>
        </div>

        <div className="home-support-card__visual" aria-label="Teklif, onay ve ödeme adımlarını gösteren görsel">
          <div className="home-support-card__phone">
            <div className="home-support-card__phone-head"><i /> Sky Bozum</div>
            <div className="home-support-card__quote"><small>İşlem öncesi teklif</small><strong>Yazılı olarak paylaşılır</strong><span>Hizmet + tutar + oran</span></div>
            <div className="home-support-card__steps"><span className="is-active">1<small>Bilgi</small></span><i /><span className="is-active">2<small>Onay</small></span><i /><span>3<small>Ödeme</small></span></div>
          </div>
          <div className="home-support-card__seal"><Icon type="lock" /><span><b>Kontrollü süreç</b><small>Her aşama yazılı</small></span></div>
        </div>

        <div className="home-support-card__points">
          {supportPoints.map((item) => <div key={item.title}><span><Icon type={item.icon} /></span><p><b>{item.title}</b><small>{item.text}</small></p></div>)}
        </div>

        <div className="home-support-card__footer">
          <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" className="focus-ring">WhatsApp’tan teklif alın <span>→</span></a>
          <nav aria-label="Destek kartı bağlantıları"><Link href="/gizlilik-politikasi">Gizlilik</Link><Link href="/kullanim-sartlari">Koşullar</Link><Link href="/iletisim">İletişim</Link></nav>
        </div>
      </div>
    </div>
  );
}
