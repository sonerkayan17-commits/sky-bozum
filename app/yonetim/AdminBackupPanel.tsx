'use client';

import { addDoc, collection, getDocs, serverTimestamp, type Firestore } from 'firebase/firestore';
import { useState } from 'react';
import './backup-panel.css';

const backupCollections = [
  { id: 'siteSettings', label: 'Genel site ayarları', detail: 'Marka, iletişim, arama ve ana sayfa metinleri.' },
  { id: 'siteContent', label: 'Sayfa içerik düzenlemeleri', detail: 'Yönetimden kaydedilmiş metin ve görsel bağlantıları.' },
  { id: 'contentArticles', label: 'Bilgi Merkezi içerikleri', detail: 'Taslak, yayındaki ve arşivdeki makale kayıtları.' },
  { id: 'rateOverrides', label: 'Oran ayarları', detail: 'Yönetimden değiştirilmiş oran kayıtları.' },
  { id: 'releaseReadiness', label: 'Yayın kontrol kayıtları', detail: 'Kontrol listesi ve yayın sorumlusu notları.' },
] as const;

type BackupCollection = (typeof backupCollections)[number]['id'];

function serialize(value: unknown): unknown {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, serialize(item)]));
  return value;
}

export default function AdminBackupPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [selected, setSelected] = useState<BackupCollection[]>(backupCollections.map((item) => item.id));
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState('');

  function toggle(id: BackupCollection) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function downloadBackup() {
    if (!db || !selected.length || exporting) return;
    setExporting(true);
    setNotice('');
    try {
      const records = await Promise.all(selected.map(async (collectionId) => {
        const snapshot = await getDocs(collection(db, collectionId));
        return [collectionId, snapshot.docs.map((entry) => ({ id: entry.id, data: serialize(entry.data()) }))] as const;
      }));
      const document = {
        format: 'sky-bozum-admin-backup',
        version: 1,
        exportedAt: new Date().toISOString(),
        scope: 'site-configuration-and-content',
        excluded: ['members', 'operations', 'messages', 'notifications', 'authentication data'],
        collections: Object.fromEntries(records),
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' }));
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `sky-bozum-yonetim-yedegi-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      await addDoc(collection(db, 'contentAudit'), { action: 'admin-backup:downloaded', articleSlug: selected.join(','), actorId, createdAt: serverTimestamp() });
      setNotice(`${selected.length} bölüm içeren yönetim yedeği indirildi.`);
    } catch {
      setNotice('Yedek indirilemedi. Yönetim yetkisini ve bağlantıyı kontrol edin.');
    } finally {
      setExporting(false);
    }
  }

  return <section className="admin-section admin-backup-panel">
    <div className="admin-section-head"><div><span>YEDEK & DIŞA AKTAR</span><h2>Yönetim verini yanında tut</h2></div><p>Yayın sonrası içerik ve site ayarlarını tek dosyada sakla; geri dönüş gerektiğinde düzenli bir referansın olsun.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <section className="admin-backup-scope"><header><div><span>ÜCRETSİZ YÖNETİM YEDEĞİ</span><h3>İndirilecek bölümleri seç</h3></div><small>JSON dosyası cihazına iner; siteye otomatik geri yükleme yapılmaz.</small></header><div>{backupCollections.map((item) => <label key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /><span><b>{item.label}</b><small>{item.detail}</small></span></label>)}</div></section>
    <aside className="admin-backup-safety"><b>Bu dosyaya dahil edilmeyenler</b><p>Üye hesapları, işlem kayıtları, mesajlar, bildirimler ve giriş verileri kişisel veri içerdiği için bu kolay yedekte yer almaz.</p></aside>
    <button className="admin-primary" type="button" disabled={exporting || !selected.length} onClick={() => void downloadBackup()}>{exporting ? 'Yedek hazırlanıyor…' : 'Yönetim yedeğini indir →'}</button>
  </section>;
}
