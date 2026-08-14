"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteEditor } from './SiteEditorProvider';

export default function SiteAdminDock() {
  const { isAdmin, isEditMode, toggleEditMode } = useSiteEditor();
  const pathname = usePathname();
  if (!isAdmin || pathname.startsWith('/yonetim')) return null;

  return (
    <aside className="site-admin-dock" aria-label="Yönetici sayfa düzenleme araçları">
      <p>YÖNETİCİ</p>
      <strong>{isEditMode ? 'Düzenleme modu açık' : 'Sayfa düzenleme modu kapalı'}</strong>
      <span>{isEditMode ? 'Çerçeveli alanlardaki Düzenle düğmesiyle değişiklikleri anında yayınlayabilirsiniz.' : 'Normal görünüm korunur. Düzenlemek için modu açın.'}</span>
      <div>
        <button type="button" onClick={toggleEditMode}>{isEditMode ? 'Düzenlemeyi kapat' : 'Düzenleme modunu aç'}</button>
        <Link href="/yonetim">Yönetim merkezi</Link>
      </div>
    </aside>
  );
}
