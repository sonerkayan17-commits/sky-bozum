'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function SiteBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  return <button type="button" className="site-back-button focus-ring" onClick={() => window.history.length > 1 ? router.back() : router.push('/')} aria-label="Önceki sayfaya dön"><span aria-hidden="true">←</span><span>Geri</span></button>;
}
