'use client';

import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { rateItems } from '../lib/rates';

type OperationStatus = 'new' | 'awaiting_product' | 'checking' | 'awaiting_payment' | 'completed' | 'cancelled';
type Operation = { id: string; memberId: string; customer: string; contact: string; service: string; amount: number; payout: number; status: OperationStatus; note: string; createdAt: Date | null; updatedAt: Date | null };
const statusLabels: Record<OperationStatus, string> = { new: 'Yeni', awaiting_product: 'Ürün bekleniyor', checking: 'Kontrol ediliyor', awaiting_payment: 'Ödeme bekleniyor', completed: 'Tamamlandı', cancelled: 'İptal edildi' };
const statuses = Object.keys(statusLabels) as OperationStatus[];

export default function AdminOperationPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [filter, setFilter] = useState<'all' | OperationStatus>('all');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ customer: '', contact: '', service: rateItems[0].serviceSlug, amount: '', payout: '', note: '' });

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'operations'), (snapshot) => {
      setOperations(snapshot.docs.map((entry) => {
        const data = entry.data();
        return { id: entry.id, memberId: String(data.memberId || ''), customer: String(data.customer || ''), contact: String(data.contact || ''), service: String(data.service || ''), amount: Number(data.amount) || 0, payout: Number(data.payout) || 0, status: statuses.includes(data.status) ? data.status as OperationStatus : 'new', note: String(data.note || ''), createdAt: data.createdAt?.toDate?.() ?? null, updatedAt: data.updatedAt?.toDate?.() ?? null };
      }).sort((a, b) => (b.updatedAt?.getTime() || b.createdAt?.getTime() || 0) - (a.updatedAt?.getTime() || a.createdAt?.getTime() || 0)));
    }, () => setNotice('İşlem kayıtları okunamadı.'));
  }, [db]);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');
    return operations.filter((operation) => {
      const matchesStatus = filter === 'all' || operation.status === filter;
      const searchable = `${operation.customer} ${operation.contact} ${operation.service} ${operation.note}`.toLocaleLowerCase('tr-TR');
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, operations, query]);
  const metrics = useMemo(() => ({ newRequests: operations.filter((item) => item.status === 'new').length, active: operations.filter((item) => !['completed', 'cancelled'].includes(item.status)).length, awaiting: operations.filter((item) => item.status === 'awaiting_payment').length, completed: operations.filter((item) => item.status === 'completed').length }), [operations]);

  async function createOperation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !form.customer.trim() || !form.contact.trim() || !form.amount) return;
    const amount = Number(form.amount.replace(',', '.'));
    const payout = Number((form.payout || '0').replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(payout) || payout < 0) { setNotice('Tutar ve ödeme değerlerini kontrol edin.'); return; }
    const operation = await addDoc(collection(db, 'operations'), { customer: form.customer.trim().slice(0, 100), contact: form.contact.trim().slice(0, 120), service: form.service, amount, payout, status: 'new', note: form.note.trim().slice(0, 500), createdBy: actorId, updatedBy: actorId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    await addDoc(collection(db, 'contentAudit'), { action: 'operation:created', articleSlug: operation.id, actorId, createdAt: serverTimestamp() });
    setForm({ customer: '', contact: '', service: rateItems[0].serviceSlug, amount: '', payout: '', note: '' });
    setShowForm(false);
    setNotice('İşlem kaydı oluşturuldu.');
  }

  async function changeStatus(operation: Operation, status: OperationStatus) {
    if (!db) return;
    await updateDoc(doc(db, 'operations', operation.id), { status, updatedBy: actorId, updatedAt: serverTimestamp() });
    await addDoc(collection(db, 'contentAudit'), { action: `operation:${status}`, articleSlug: operation.id, actorId, createdAt: serverTimestamp() });
    if (operation.memberId && operation.status !== status) {
      await addDoc(collection(db, 'notifications'), {
        senderId: actorId,
        receiverId: operation.memberId,
        type: 'operation_status',
        text: `${operation.service} talebinizin durumu “${statusLabels[status]}” olarak güncellendi.`,
        href: '/hesabim/talepler',
        read: false,
        createdAt: serverTimestamp(),
      });
    }
    setNotice(`İşlem durumu “${statusLabels[status]}” olarak güncellendi.`);
  }

  return <section className="admin-section">
    <div className="admin-section-head"><div><span>İŞLEM MERKEZİ</span><h2>Bozum taleplerini takip edin</h2></div><p>Her işlem tek kayıt altında müşteri, hizmet, tutar, ödeme ve durum bilgisiyle izlenir.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <div className="admin-metrics admin-operation-metrics"><article><strong>{metrics.newRequests}</strong><span>yeni talep</span></article><article><strong>{metrics.active}</strong><span>aktif işlem</span></article><article><strong>{metrics.awaiting}</strong><span>ödeme bekleyen</span></article><article><strong>{metrics.completed}</strong><span>tamamlanan</span></article></div>
    <div className="admin-filterbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Müşteri, iletişim veya hizmet ara" aria-label="İşlemlerde ara" /><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">Tüm işlemler</option>{statuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select><span>{visible.length} kayıt</span><button className="admin-primary compact" onClick={() => setShowForm(true)}>Yeni işlem →</button></div>
    <div className="admin-table admin-operation-table">{visible.length ? visible.map((operation) => <article key={operation.id}><div><strong>{operation.customer}</strong><span>{operation.contact} · {operation.service}</span><small>{operation.memberId ? 'Üye talebi' : 'Yönetici kaydı'}</small></div><span className={`admin-status ${operation.status === 'completed' ? 'status-approved' : operation.status === 'cancelled' ? 'status-rejected' : 'status-pending'}`}>{statusLabels[operation.status]}</span><b>{operation.amount.toLocaleString('tr-TR')} TL → {operation.payout.toLocaleString('tr-TR')} TL</b><small>{operation.updatedAt?.toLocaleDateString('tr-TR') || operation.createdAt?.toLocaleDateString('tr-TR') || 'Tarih yok'}</small><select aria-label={`${operation.customer} işlem durumu`} value={operation.status} onChange={(event) => void changeStatus(operation, event.target.value as OperationStatus)}>{statuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select>{operation.note && <p>{operation.note}</p>}</article>) : <p className="admin-empty">Henüz işlem kaydı bulunmuyor.</p>}</div>
    {showForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="operation-modal-title"><button className="admin-close" onClick={() => setShowForm(false)} aria-label="Pencereyi kapat">×</button><span>YENİ İŞLEM</span><h2 id="operation-modal-title">Bozum talebi oluştur</h2><form onSubmit={(event) => void createOperation(event)}><label>Müşteri adı<input value={form.customer} onChange={(event) => setForm({ ...form, customer: event.target.value })} required /></label><label>İletişim bilgisi<input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} placeholder="Telefon veya e-posta" required /></label><label>Hizmet<select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })}>{rateItems.map((item) => <option value={item.serviceSlug} key={item.id}>{item.name}</option>)}</select></label><label>Alınan bakiye<input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} inputMode="decimal" required /></label><label>Tahmini net ödeme<input value={form.payout} onChange={(event) => setForm({ ...form, payout: event.target.value })} inputMode="decimal" required /></label><label>İşlem notu<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows={3} /></label><button className="admin-primary" type="submit">İşlemi kaydet →</button></form></section></div>}
  </section>;
}
