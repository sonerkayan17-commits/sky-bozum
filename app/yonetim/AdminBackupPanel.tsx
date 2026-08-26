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

type EncryptedBackupDocument = {
  format: 'sky-bozum-encrypted-disaster-backup';
  version: 1;
  algorithm: 'AES-GCM';
  keyDerivation: 'PBKDF2-SHA256';
  iterations: number;
  createdAt: string;
  salt: string;
  iv: string;
  payload: string;
};

const disasterCollections = [
  'members', 'operations', 'operationNotes', 'operationEvents', 'productCatalog',
  'productOrders', 'commerceCases', 'stockAlerts', 'notifications', 'contentAudit',
] as const;

function bytesToBase64(value: Uint8Array) {
  let binary = '';
  value.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function deriveBackupKey(passphrase: string, salt: Uint8Array, iterations: number) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

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
  const [passphrase, setPassphrase] = useState('');
  const [secureExporting, setSecureExporting] = useState(false);

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
      if (file.size > 100 * 1024 * 1024) throw new Error('too-large');
      const parsed = JSON.parse(await file.text()) as BackupDocument | EncryptedBackupDocument;
      if (parsed.format === 'sky-bozum-encrypted-disaster-backup') {
        if (passphrase.length < 12 || parsed.version !== 1 || parsed.algorithm !== 'AES-GCM' || parsed.keyDerivation !== 'PBKDF2-SHA256') throw new Error('encrypted-invalid');
        const key = await deriveBackupKey(passphrase, base64ToBytes(parsed.salt), parsed.iterations);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(parsed.iv) as BufferSource }, key, base64ToBytes(parsed.payload));
        const inner = JSON.parse(new TextDecoder().decode(decrypted)) as BackupDocument;
        if (inner.format !== 'sky-bozum-admin-backup' || inner.version !== 2 || !inner.checksum) throw new Error('inner-invalid');
        const { checksum, ...unsigned } = inner;
        if (checksum !== await sha256(JSON.stringify(unsigned))) throw new Error('checksum');
        const total = Object.values(inner.collections).reduce((sum, entries) => sum + entries.length, 0);
        setVerification(`Şifreli kurtarma yedeği sağlam: ${Object.keys(inner.collections).length} bölüm ve ${total} kayıt doğrulandı. Dosya siteye yüklenmedi.`);
        return;
      }
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

  async function downloadEncryptedDisasterBackup() {
    if (!db || secureExporting || passphrase.length < 12) {
      setNotice('Şifreli yedek için en az 12 karakterlik, yalnız sizin bildiğiniz bir parola girin.');
      return;
    }
    setSecureExporting(true);
    setNotice('');
    try {
      const records: Array<[string, Array<{ id: string; data: unknown }>]> = await Promise.all(disasterCollections.map(async (collectionId) => {
        const snapshot = await getDocs(collection(db, collectionId));
        return [collectionId, snapshot.docs.map((entry) => ({ id: entry.id, data: serialize(entry.data()) }))];
      }));
      const catalog = records.find(([id]) => id === 'productCatalog')?.[1] ?? [];
      const codeRecords = await Promise.all(catalog.map(async (entry) => {
        const snapshot = await getDocs(collection(db, 'productCatalog', entry.id, 'codes'));
        return snapshot.docs.map((code) => ({ id: `${entry.id}/${code.id}`, data: serialize(code.data()) }));
      }));
      records.push(['productCatalogCodes', codeRecords.flat()]);
      const unsigned = {
        format: 'sky-bozum-admin-backup' as const,
        version: 2 as const,
        exportedAt: new Date().toISOString(),
        scope: 'encrypted-disaster-recovery',
        collections: Object.fromEntries(records),
        counts: Object.fromEntries(records.map(([id, entries]) => [id, entries.length])),
      };
      const inner = { ...unsigned, checksum: await sha256(JSON.stringify(unsigned)) };
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const iterations = 250_000;
      const key = await deriveBackupKey(passphrase, salt, iterations);
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, new TextEncoder().encode(JSON.stringify(inner)));
      const document: EncryptedBackupDocument = {
        format: 'sky-bozum-encrypted-disaster-backup', version: 1, algorithm: 'AES-GCM', keyDerivation: 'PBKDF2-SHA256', iterations,
        createdAt: new Date().toISOString(), salt: bytesToBase64(salt), iv: bytesToBase64(iv), payload: bytesToBase64(new Uint8Array(encrypted)),
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(document)], { type: 'application/json' }));
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `sky-bozum-sifreli-kurtarma-yedegi-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      await addDoc(collection(db, 'contentAudit'), { action: 'admin-backup:encrypted-disaster-downloaded', articleSlug: disasterCollections.join(','), actorId, createdAt: serverTimestamp() });
      setPassphrase('');
      setNotice(`${records.length} bölüm içeren şifreli kurtarma yedeği indirildi. Parolayı dosyadan ayrı ve güvenli saklayın.`);
    } catch {
      setNotice('Şifreli kurtarma yedeği hazırlanamadı. Yönetim yetkisini ve bağlantıyı kontrol edin.');
    } finally {
      setSecureExporting(false);
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
    <section className="admin-disaster-backup">
      <div><span>ŞİFRELİ FELAKET KURTARMA</span><h3>Para, sipariş, stok ve üye kayıtlarını koru</h3><p>Hassas kayıtlar tarayıcıda AES-256 ile şifrelenir. Açık veri sunucuya veya başka bir hizmete gönderilmez; parola olmadan dosya okunamaz.</p></div>
      <label>Yedek parolası<input type="password" autoComplete="new-password" minLength={12} value={passphrase} onChange={(event) => setPassphrase(event.target.value)} placeholder="En az 12 karakter" /></label>
      <button className="admin-primary" type="button" disabled={secureExporting || passphrase.length < 12} onClick={() => void downloadEncryptedDisasterBackup()}>{secureExporting ? 'Şifreleniyor…' : 'Şifreli tam yedeği indir →'}</button>
      <small>Ürün kodu alt koleksiyonları dahil edilir. Oturum parolaları ve Firebase Authentication kimlik bilgileri hiçbir zaman dışa aktarılmaz.</small>
    </section>
  </section>;
}
