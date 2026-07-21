'use client';

import Link from 'next/link';
import { siteConfig } from '../lib/site';

const actions = [
  { label: 'Hesapla', href: '/araclar#oran-hesapla', icon: '↗' },
  { label: 'Araçlar', href: '/araclar', icon: '◇' },
  { label: 'Rehber', href: '/bilgi-merkezi', icon: '≡' },
  { label: 'S.S.S.', href: '/sss', icon: '?' },
];

export default function QuickActionDock() {
  return <nav className="quick-dock" aria-label="Hızlı işlemler">
    {actions.map((action) => <Link key={action.href} href={action.href}><span>{action.icon}</span><strong>{action.label}</strong></Link>)}
    <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" className="quick-dock-primary"><span>●</span><strong>WhatsApp</strong></a>
  </nav>;
}
