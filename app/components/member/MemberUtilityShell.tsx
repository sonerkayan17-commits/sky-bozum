'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const accountLinks = [
  ['Hesap özeti', '/hesabim'],
  ['Talepler', '/hesabim/talepler'],
  ['Banka', '/hesabim/banka-bilgileri'],
  ['Abonelikler', '/hesabim/abonelikler'],
  ['Kaydedilenler', '/hesabim/kaydedilenler'],
  ['Mesajlar', '/hesabim/mesajlar'],
] as const;

export default function MemberUtilityShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="utility-page">
      <div className="member-utility-frame">
        <nav className="member-utility-nav" aria-label="Üye hesabı bölümleri">
          <Link href="/hesabim" className="member-utility-nav__brand"><span>SKY BOZUM</span><strong>Üye Merkezi</strong></Link>
          <div>{accountLinks.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}</div>
        </nav>
        <section className="member-utility-content">
          <header className="member-utility-heading"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div><b><i /> Güvenli hesap alanı</b></header>
          {children}
        </section>
      </div>
    </main>
  );
}
