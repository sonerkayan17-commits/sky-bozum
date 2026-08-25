'use client';

import { collection, doc, onSnapshot, serverTimestamp, writeBatch, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { commerceCaseKindLabels, commerceCaseStatusLabels, type CommerceCase, type CommerceCaseStatus } from '../lib/commerceCases';
import './admin-commerce-cases.css';

const statuses: CommerceCaseStatus[] = ['open', 'reviewing', 'resolved', 'rejected'];

export default function AdminCommerceCasePanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [cases, setCases] = useState<CommerceCase[]>([]);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'commerceCases'), (snapshot) => setCases(snapshot.docs.map((entry) => {
      const data = entry.data();
      return {
        id: entry.id,
        memberId: String(data.memberId || ''),
        targetType: data.targetType === 'order' ? 'order' : 'operation',
        targetId: String(data.targetId || ''),
        kind: data.kind,
        reason: String(data.reason || ''),
        status: statuses.includes(data.status) ? data.status : 'open',
        resolution: String(data.resolution || ''),
        createdAt: data.createdAt?.toDate?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.() ?? null,
      } as CommerceCase;
    }).sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))), () => setNotice('İnceleme kuyruğu yüklenemedi.'));
  }, [db]);

  const visible = useMemo(() => filter === 'all' ? cases : cases.filter((item) => ['open', 'reviewing'].includes(item.status)), [cases, filter]);

  async function update(item: CommerceCase, status: CommerceCaseStatus) {
    if (!db || busy) return;
    const resolution = (drafts[item.id] ?? item.resolution).trim();
    if (['resolved', 'rejected'].includes(status) && resolution.length < 5) { setNotice('Kapanan kayıt için üyeye gösterilecek kısa bir sonuç yazın.'); return; }
    setBusy(item.id); setNotice('');
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'commerceCases', item.id), { status, resolution: resolution.slice(0, 500), updatedBy: actorId, updatedAt: serverTimestamp() });
      const auditRef = doc(collection(db, 'contentAudit'));
      batch.set(auditRef, { articleSlug: item.targetId, action: `commerce-case:${status}`, actorId, targetLabel: `${item.targetType === 'order' ? 'Sipariş' : 'İşlem'} ${item.targetId.slice(0, 10)}`, createdAt: serverTimestamp() });
      const notificationRef = doc(collection(db, 'notifications'));
      batch.set(notificationRef, { senderId: actorId, receiverId: item.memberId, type: 'system', text: `${commerceCaseKindLabels[item.kind]} kaydınız: ${commerceCaseStatusLabels[status]}.`, href: item.targetType === 'order' ? '/hesabim/siparisler' : '/hesabim/talepler', read: false, createdAt: serverTimestamp() });
      await batch.commit();
      setNotice('İnceleme kaydı ve üye bildirimi güncellendi.');
    } catch { setNotice('Kayıt güncellenemedi. Yetki ve bağlantıyı kontrol edin.'); }
    finally { setBusy(''); }
  }

  return <section className="admin-section admin-commerce-cases">
    <div className="admin-section-head"><div><span>MÜŞTERİ İNCELEME KUYRUĞU</span><h2>İptal, teslimat ve ödeme kayıtları</h2></div><p>Bu ekran yalnız inceleme kaydı yönetir; bakiye, kod, stok veya ödeme kendiliğinden değiştirilmez.</p></div>
    <div className="admin-filterbar"><button className={filter === 'active' ? 'is-active' : ''} onClick={() => setFilter('active')}>Açık kayıtlar</button><button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Tüm geçmiş</button><span>{visible.length} kayıt</span></div>
    {notice ? <p className="admin-notice">{notice}</p> : null}
    <div className="admin-commerce-case-list">{visible.length ? visible.map((item) => <article key={item.id}>
      <header><div><span>{commerceCaseKindLabels[item.kind]}</span><h3>{item.targetType === 'order' ? 'Sipariş' : 'İşlem'} · {item.targetId.slice(0, 12).toUpperCase()}</h3></div><b className={`is-${item.status}`}>{commerceCaseStatusLabels[item.status]}</b></header>
      <p>{item.reason}</p><small>Üye: {item.memberId.slice(0, 12)} · {item.createdAt?.toLocaleString('tr-TR') || 'Yeni'}</small>
      <textarea value={drafts[item.id] ?? item.resolution} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: event.target.value }))} maxLength={500} rows={2} placeholder="Üyeye gösterilecek inceleme sonucu" />
      <div><button disabled={busy === item.id} onClick={() => void update(item, 'reviewing')}>İnceleniyor</button><button disabled={busy === item.id} onClick={() => void update(item, 'resolved')}>Çözüldü</button><button className="admin-danger" disabled={busy === item.id} onClick={() => void update(item, 'rejected')}>Uygun değil</button></div>
    </article>) : <div className="admin-empty">Açık müşteri inceleme kaydı yok.</div>}</div>
  </section>;
}
