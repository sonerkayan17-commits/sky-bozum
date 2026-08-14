"use client";

import Link from 'next/link';
import { siteConfig } from '../lib/site-config';
import InlineEditableText from './admin/InlineEditableText';

export default function FinalCta() {
  return (
    <section className="home-contact-band" aria-labelledby="support-card-title">
      <div className="home-contact-band__copy">
        <p><i aria-hidden="true" /> <InlineEditableText contentKey="home-final-eyebrow" defaultValue="Sky Bozum resmî iletişim" /></p>
        <h2 id="support-card-title"><InlineEditableText contentKey="home-final-title" defaultValue="Talebinizi iletin. Net teklifinizi görün." /></h2>
        <InlineEditableText contentKey="home-final-description" defaultValue="Hizmet ve tutarı paylaşın; oranı, tahmini ödemeyi ve işlem koşullarını karar vermeden önce yazılı alın." />
      </div>

      <div className="home-contact-band__actions">
        <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" className="focus-ring">
          WhatsApp’tan teklif alın <b aria-hidden="true">↗</b>
        </a>
        <nav aria-label="Destek bağlantıları">
          <Link href="/iletisim">Tüm iletişim kanalları <span aria-hidden="true">→</span></Link>
          <Link href="/guven-merkezi">Güven standardımız <span aria-hidden="true">→</span></Link>
        </nav>
      </div>

      <div className="home-contact-band__facts" aria-label="İletişim güvenceleri">
        <p><span>01</span><strong>Yazılı teklif</strong><small>Oran ve net ödeme görünür</small></p>
        <p><span>02</span><strong>Kontrollü süreç</strong><small>Karar yalnızca size ait</small></p>
        <p><span>03</span><strong>Güvenli sınır</strong><small>Şifre ve SMS kodu istenmez</small></p>
      </div>
    </section>
  );
}
