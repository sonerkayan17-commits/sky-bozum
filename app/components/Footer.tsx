"use client";

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../lib/site-config';
import PrivacyControls from './personalization/PrivacyControls';
import TawkChat from './TawkChat';
import { siteFeatures } from '../lib/features';
import { useSiteSettings } from './SiteSettingsProvider';
import InlineEditableText from './admin/InlineEditableText';

const groups = [
  ['Hizmetlerimiz', [['Vodafone Mobil Ödeme', '/hizmetler/vodafone-mobil-odeme'], ['Turkcell Mobil Ödeme', '/hizmetler/turkcell-mobil-odeme'], ['Türk Telekom Mobil Ödeme', '/hizmetler/turk-telekom-mobil-odeme'], ['Paycell', '/hizmetler/paycell'], ['Pokus', '/hizmetler/pokus'], ['Apple / iTunes', '/hizmetler/itunes-apple'], ['Razer Gold TL & USD', '/hizmetler/razer-gold-tl'], ['Steam Cüzdan Kodu', '/hizmetler/steam']]],
  ['Keşfet', [['Oran Hesapla', '/araclar#hesapla'], ['Operatörler', '/operatorler'], ['Rehber', '/bilgi-merkezi'], ...(siteFeatures.communityForum ? [['Forum', '/topluluk'] as const] : []), ['Referanslar', '/referanslar'], ['S.S.S.', '/sss']]],
  ['Kurumsal', [['Hakkımızda', '/hakkimizda'], ['İş Ortaklığı', '/is-ortakligi'], ['Güven Merkezi', '/guven-merkezi'], ['Gizlilik Politikası', '/gizlilik-politikasi'], ['Kullanım Şartları', '/kullanim-sartlari'], ['İletişim', '/iletisim']]],
] as const;

const socials = [
  { label: 'WhatsApp', href: siteConfig.whatsapp, icon: 'M12 2a9.7 9.7 0 0 0-8.4 14.55L2.3 21.3l4.87-1.28A9.7 9.7 0 1 0 12 2Zm0 17.64a7.9 7.9 0 0 1-4.03-1.1l-.29-.17-2.89.76.77-2.81-.19-.3A7.91 7.91 0 1 1 12 19.64Z' },
  { label: 'E-posta', href: `mailto:${siteConfig.email}`, icon: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 0 8 7 8-7' },
] as const;

export default function Footer() {
  const settings = useSiteSettings();
  return (
    <>
      <TawkChat />
      <footer className="relative overflow-hidden border-t border-white/8 bg-[#07080d] pb-8 pt-14 text-white">
      <div className="content-wide relative">
        <div className="grid gap-10 border-b border-white/8 pb-12 lg:grid-cols-[1.1fr_2.4fr]">
          <div className="max-w-sm">
            <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-lg">
              <Image src="/brand-logo.webp" alt="Sky Bozum Mobil Ödeme" width={52} height={52} className="size-12 rounded-2xl border border-[#e8c27a]/20 object-cover" />
              <span>
                <strong className="block font-[var(--font-display)] text-lg font-bold tracking-tight">{settings.brandName}</strong>
                <span className="mt-0.5 block text-xs font-semibold text-slate-500">bozumcu.net</span>
              </span>
            </Link>
            <InlineEditableText as="p" contentKey="footer-description" defaultValue={settings.footerDescription} className="mt-5 text-sm leading-7 text-slate-400" />

            <p className="mt-2 text-xs text-slate-500">{settings.brandTagline}</p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="focus-ring grid size-9 place-items-center rounded-full border border-white/10 bg-white/[.03] text-slate-400 transition hover:border-[#e8c27a]/35 hover:text-[#f2c98a]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={social.icon} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-4">
            <nav aria-label="Alt menü" className="contents">
              {groups.map(([title, links]) => (
                <div key={title}>
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-300">{title}</h3>
                  <ul className="mt-4 space-y-3">
                    {links.map(([label, href]) => (
                      <li key={href}><Link href={href} className="text-sm text-slate-500 transition hover:text-[#f2c98a]">{label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-300">İletişim</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a className="flex items-center gap-2 transition hover:text-[#f2c98a]" href={`mailto:${settings.email}`}><svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 0 8 7 8-7" strokeLinecap="round" strokeLinejoin="round" /></svg>{settings.email}</a>
                <a className="flex items-center gap-2 transition hover:text-[#f2c98a]" href={`tel:${settings.phone.replace(/\s/g, '')}`}><svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2a11 11 0 0 1-5-5l2-2-3-6Z" strokeLinecap="round" strokeLinejoin="round" /></svg>{settings.phone}</a>
              </div>
              <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring mt-5 min-h-11 w-full px-4 text-xs">{settings.liveSupportLabel}</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>© {new Date().getFullYear()} Sky Bozum. Tüm hakları saklıdır.</p>
            <div className="mt-3"><PrivacyControls /></div>
          </div>
          <p className="max-w-xs text-right leading-5 text-slate-600">Resmî iletişim kanalları ve işlem öncesi yazılı teyit için İletişim sayfasını kullanın.</p>
        </div>
      </div>
      </footer>
    </>
  );
}
