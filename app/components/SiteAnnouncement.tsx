"use client";

import Link from 'next/link';
import { useSiteSettings } from './SiteSettingsProvider';

export default function SiteAnnouncement() {
  const settings = useSiteSettings();
  if (!settings.announcementEnabled || !settings.announcementText.trim()) return null;
  const isExternal = /^https:\/\//i.test(settings.announcementHref);
  const content = <><span aria-hidden="true">i</span><strong>{settings.announcementText}</strong><b aria-hidden="true">→</b></>;
  return isExternal ? <a className="site-announcement" href={settings.announcementHref} target="_blank" rel="noopener noreferrer">{content}</a> : <Link className="site-announcement" href={settings.announcementHref || '/bilgi-merkezi'}>{content}</Link>;
}
