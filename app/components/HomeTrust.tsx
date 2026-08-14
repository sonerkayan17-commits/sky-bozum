"use client";

import Link from 'next/link';
import { siteConfig } from '../lib/site-config';
import InlineEditableText from './admin/InlineEditableText';

const standards = [
  ['01', 'Resmî kanaldan başlayın', 'Görüşme yalnızca bozumcu.net üzerindeki doğrulanmış bağlantılardan başlar.'],
  ['02', 'Tutarı önceden görün', 'Oran, net ödeme ve işlem sırası onay vermeden önce yazılı paylaşılır.'],
  ['03', 'Kontrol sizde kalsın', 'Şifre, SMS kodu, kart şifresi veya ekran erişimi hiçbir aşamada istenmez.'],
] as const;

export default function HomeTrust() {
  return (
    <section className="home-trust-editorial" aria-labelledby="home-trust-title">
      <div className="content-wide">
        <div className="home-trust-editorial__main">
          <div className="home-trust-editorial__copy">
            <p className="home-trust-editorial__eyebrow"><i aria-hidden="true" /> <InlineEditableText contentKey="home-trust-eyebrow" defaultValue="Sky Bozum güven standardı" /></p>
            <h2 id="home-trust-title"><InlineEditableText contentKey="home-trust-title" defaultValue="Güven, işlemden önce görünür olmalı." /></h2>
            <InlineEditableText as="p" contentKey="home-trust-description" defaultValue="Ne paylaşacağınız, ne kadar alacağınız ve sürecin hangi kanaldan ilerleyeceği daha işlem başlamadan netleşir." />
            <div>
              <Link href="/guven-merkezi" className="focus-ring">Güven Merkezini açın <span aria-hidden="true">→</span></Link>
              <Link href="/iletisim" className="focus-ring">Resmî kanallar</Link>
            </div>
          </div>

          <ol className="home-trust-editorial__standards">
            {standards.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3><InlineEditableText contentKey={`home-trust-${number}-title`} defaultValue={title} /></h3><InlineEditableText as="p" contentKey={`home-trust-${number}-description`} defaultValue={text} /></div>
                <b aria-hidden="true">✓</b>
              </li>
            ))}
          </ol>
        </div>

        <div className="home-trust-editorial__registry" aria-label="Doğrulanmış resmî bilgiler">
          <p><span>Alan adı</span><strong>{siteConfig.domain}</strong></p>
          <i aria-hidden="true" />
          <p><span>Destek hattı</span><strong>{siteConfig.phone}</strong></p>
          <i aria-hidden="true" />
          <p><span>Güvenlik sınırı</span><strong>Gizli bilgi talep edilmez</strong></p>
          <small><b aria-hidden="true" /> Doğrulanmış süreç</small>
        </div>
      </div>
    </section>
  );
}
