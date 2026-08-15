"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSiteEditor } from './SiteEditorProvider';

export default function SiteAdminDock() {
  const { isAdmin, isEditMode, toggleEditMode } = useSiteEditor();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!isAdmin || pathname.startsWith('/yonetim')) return null;

  return (
    <aside className={`site-admin-dock ${isOpen ? 'is-open' : ''} ${isEditMode ? 'is-editing' : ''}`} aria-label="Yönetici sayfa düzenleme araçları">
      <button
        type="button"
        className="site-admin-dock__trigger"
        aria-expanded={isOpen}
        aria-controls="site-admin-dock-panel"
        aria-label={isOpen ? 'Yönetici araçlarını kapat' : 'Yönetici araçlarını aç'}
        onClick={() => setIsOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.5 17.5 10.5M4 20l4.1-1 10.7-10.7a2.1 2.1 0 0 0-3-3L5.1 16 4 20Z" />
        </svg>
        <span className="site-admin-dock__status" aria-hidden="true" />
      </button>

      <div id="site-admin-dock-panel" className="site-admin-dock__panel" hidden={!isOpen}>
        <header>
          <div><p>YÖNETİCİ</p><strong>{isEditMode ? 'Düzenleme açık' : 'Sayfa araçları'}</strong></div>
          <button type="button" className="site-admin-dock__close" aria-label="Yönetici araçlarını kapat" onClick={() => setIsOpen(false)}>×</button>
        </header>
        <span>{isEditMode ? 'Düzenlenebilir alanlar sayfa üzerinde işaretlenir.' : 'Sayfayı normal görünümde gezebilir veya düzenleme modunu açabilirsiniz.'}</span>
        <div className="site-admin-dock__actions">
          <button type="button" onClick={toggleEditMode}>{isEditMode ? 'Düzenlemeyi kapat' : 'Düzenlemeyi aç'}</button>
          <Link href="/yonetim">Yönetim merkezi</Link>
        </div>
      </div>
    </aside>
  );
}
