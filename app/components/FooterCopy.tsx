'use client';

import { useSiteSettings } from './SiteSettingsProvider';

export default function FooterCopy() {
  const settings = useSiteSettings();
  return (
    <>
      <p className="mt-5 text-sm leading-7 text-slate-400">{settings.footerDescription}</p>
      <p className="mt-2 text-xs text-slate-500">{settings.brandTagline}</p>
    </>
  );
}
