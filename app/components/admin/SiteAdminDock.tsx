"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteEditor } from './SiteEditorProvider';

export default function SiteAdminDock() {
  const { isAdmin } = useSiteEditor();
  const pathname = usePathname();
  if (!isAdmin || pathname.startsWith('/yonetim')) return null;
  return <aside className="site-admin-dock" aria-label="Yönetici hızlı düzenleme"><span>YÖNETİCİ MODU</span><strong>Bu sayfadaki “Düzenle” düğmeleriyle metin ve görsellere müdahale edebilirsin.</strong><Link href="/yonetim">Kontrol merkezini aç <b>→</b></Link></aside>;
}
