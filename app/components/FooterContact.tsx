"use client";

import { useSiteSettings } from './SiteSettingsProvider';

export default function FooterContact() {
  const settings = useSiteSettings();

  return (
    <div>
      <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-300">İletişim</h3>
      <div className="mt-4 space-y-3 text-sm text-slate-500">
        <a className="flex items-center gap-2 transition hover:text-[#f2c98a]" href={`mailto:${settings.email}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 0 8 7 8-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {settings.email}
        </a>
        <a className="flex items-center gap-2 transition hover:text-[#f2c98a]" href={`tel:${settings.phone.replace(/\s/g, '')}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2a11 11 0 0 1-5-5l2-2-3-6Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {settings.phone}
        </a>
      </div>
      <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring mt-5 min-h-11 w-full px-4 text-xs">{settings.liveSupportLabel}</a>
    </div>
  );
}
