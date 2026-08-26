'use client';

import { addDoc, collection, getDocs, serverTimestamp, type Firestore } from 'firebase/firestore';
import { type ChangeEvent, useState } from 'react';
import './backup-panel.css';

const backupCollections = [
  { id: 'siteSettings', label: 'Genel site ayarları', detail: 'Marka, iletişim, arama ve ana sayfa metinleri.' },
  { id: 'siteContent', label: 'Sayfa içerik düzenlemeleri', detail: 'Yönetimden kaydedilmiş metin ve görsel bağlantıları.' },
  { id: 'contentArticles', label: 'Bilgi Merkezi içerikleri', detail: 'Taslak, yayındaki ve arşivdeki makale kayıtları.' },
  { id: 'rateOverrides', label: 'Oran ayarları', detail: 'Yönetimden değiştirilmiş oran kayıtları.' },
  { id: 'releaseReadiness', label: 'Yayın kontrol kayıtları', detail: 'Kontrol listesi ve yayın sorumlusu notları.' },
] as const;

type BackupCollection = (typeof backupCollections)[number]['id'];

type BackupDocument = {
  format: 'sky-bozum-admin-backup';
  version: 2;
  exportedAt: string;
  scope: string;
  collections: Record<string, Array<{ id: string; data: unknown }>>;
  counts: Record<string, number>;
  checksum?: string;
};

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

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
  const [verification, setVerification] = useState('');

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
      const unsignedDocument: Omit<BackupDocument, 'checksum'> & { excluded: string[] } = {
        format: 'sky-bozum-admin-backup',
        version: 2,
        exportedAt: new Date().toISOString(),
        scope: 'site-configuration-and-content',
        excluded: ['members', 'operations', 'messages', 'notifications', 'authentication data'],
        collections: Object.fromEntries(records),
        counts: Object.fromEntries(records.map(([collectionId, entries]) => [collectionId, entries.length])),
      };
      const payload = JSON.stringify(unsignedDocument);
      const document = { ...unsignedDocument, checksum: await sha256(payload) };
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

  async function verifyBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setVerification('Yedek doğrulanıyor…');
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error('too-large');
      const parsed = JSON.parse(await file.text()) as BackupDocument;
      if (parsed.format !== 'sky-bozum-admin-backup' || parsed.version !== 2 || !parsed.checksum || !parsed.collections) throw new Error('invalid');
      const { checksum, ...unsigned } = parsed;
      const expected = await sha256(JSON.stringify(unsigned));
      if (checksum !== expected) throw new Error('checksum');
      const total = Object.values(parsed.collections).reduce((sum, entries) => sum + entries.length, 0);
      setVerification(`Yedek sağlam: ${Object.keys(parsed.collections).length} bölüm ve ${total} kayıt doğrulandı. Dosya siteye yüklenmedi.`);
    } catch {
      setVerification('Bu dosya geçerli bir Sky Bozum yönetim yedeği değil veya sonradan değiştirilmiş.');
    }
  }

  return <section className="admin-section admin-backup-panel">
    <div className="admin-section-head"><div><span>YEDEK & DIŞA AKTAR</span><h2>Yönetim verini yanında tut</h2></div><p>Yayın sonrası içerik ve site ayarlarını tek dosyada sakla; geri dönüş gerektiğinde düzenli bir referansın olsun.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <section className="admin-backup-scope"><header><div><span>ÜCRETSİZ YÖNETİM YEDEĞİ</span><h3>İndirilecek bölümleri seç</h3></div><small>JSON dosyası cihazına iner; siteye otomatik geri yükleme yapılmaz.</small></header><div>{backupCollections.map((item) => <label key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /><span><b>{item.label}</b><small>{item.detail}</small></span></label>)}</div></section>
    <aside className="admin-backup-safety"><b>Bu dosyaya dahil edilmeyenler</b><p>Üye hesapları, işlem kayıtları, mesajlar, bildirimler ve giriş verileri kişisel veri içerdiği için bu kolay yedekte yer almaz.</p></aside>
    <div className="admin-backup-actions">
      <button className="admin-primary" type="button" disabled={exporting || !selected.length} onClick={() => void downloadBackup()}>{exporting ? 'Yedek hazırlanıyor…' : 'Yönetim yedeğini indir →'}</button>
      <label className="admin-secondary">Yedek dosyasını doğrula<input type="file" accept="application/json,.json" onChange={(event) => void verifyBackup(event)} hidden /></label>
    </div>
    {verification && <p className="admin-notice" role="status">{verification}</p>}
  </section>;
}
