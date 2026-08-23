'use client';

import Link from './DeferredLink';
import { usePathname } from 'next/navigation';
import { siteConfig } from '../lib/site-config';
import { siteFeatures } from '../lib/features';
import { trackConversion } from '../lib/conversion';

type DockAction = {
  label: string;
  href: string;
  icon: string;
  activeRoutes?: string[];
};

const actions: DockAction[] = [
  { label: 'Hesapla', href: '/araclar#oran-hesapla', icon: '↗', activeRoutes: ['/araclar'] },
  { label: 'Rehber', href: '/bilgi-merkezi', icon: '≡', activeRoutes: ['/bilgi-merkezi'] },
  { label: 'S.S.S.', href: '/sss', icon: '?', activeRoutes: ['/sss'] },
  ...(siteFeatures.communityForum ? [{ label: 'Forum', href: '/topluluk', icon: '☵', activeRoutes: ['/topluluk'] }] : []),
];

function routeIsActive(pathname: string, routes: string[] = []) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default function QuickActionDock() {
  const pathname = usePathname();

  return (
    <nav className="quick-dock" aria-label="Hızlı işlemler">
      {actions.map((action) => {
        const isActive = routeIsActive(pathname, action.activeRoutes);

        return (
          <Link
            key={action.href}
            href={action.href}
            className={isActive ? 'is-active' : undefined}
            aria-current={isActive ? 'page' : undefined}
          >
            <span aria-hidden="true">{action.icon}</span>
            <strong>{action.label}</strong>
          </Link>
        );
      })}
      <a
        href={siteConfig.liveSupportHref}
        onClick={() => trackConversion('whatsapp_clicked', { source: 'quick_dock' })}
        target="_blank"
        rel="noopener noreferrer"
        className="quick-dock-primary"
      >
        <span aria-hidden="true">●</span>
        <strong>WhatsApp</strong>
      </a>
    </nav>
  );
}
