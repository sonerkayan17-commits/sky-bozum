'use client';

import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc, type Firestore } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { rateItems } from '../lib/rates';

type OperationStatus = 'new' | 'awaiting_product' | 'checking' | 'awaiting_payment' | 'completed' | 'cancelled';
type OperationPriority = 'normal' | 'high' | 'urgent';
type Operation = {
  id: string;
  memberId: string;
  customer: string;
  contact: string;
  service: string;
  amount: number;
  payout: number;
  status: OperationStatus;
  priority: OperationPriority;
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};
type OperationNote = { id: string; operationId: string; type: 'note' | 'status' | 'system'; body: string; createdAt: Date | null };

const statusLabels: Record<OperationStatus, string> = {
  new: 'Yeni',
  awaiting_product: 'Ürün bekleniyor',
  checking: 'Kontrol ediliyor',
  awaiting_payment: 'Ödeme bekleniyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal edildi',
};
const priorityLabels: Record<OperationPriority, string> = { normal: 'Normal', high: 'Öncelikli', urgent: 'Acil' };
const noteTypeLabels: Record<OperationNote['type'], string> = { note: 'Ekip notu', status: 'Durum', system: 'Kayıt' };
const statuses = Object.keys(statusLabels) as OperationStatus[];
const priorities = Object.keys(priorityLabels) as OperationPriority[];

function asPriority(value: unknown): OperationPriority {
  return priorities.includes(value as OperationPriority) ? value as OperationPriority : 'normal';
}

export default function AdminOperationPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [operationNotes, setOperationNotes] = useState<OperationNote[]>([]);
  const [filter, setFilter] = useState<'all' | OperationStatus>('all');
  const [query, setQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [noteSavingId, setNoteSavingId] = useState<string | null>(null);
  const [openOperationId, setOpenOperationId] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ customer: '', contact: '', service: rateItems[0].serviceSlug, amount: '', payout: '', priority: 'normal' as OperationPriority, note: '' });

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'operations'), (snapshot) => {
      setOperations(snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          memberId: String(data.memberId || ''),
          customer: String(data.customer || ''),
          contact: String(data.contact || ''),
          service: String(data.service || ''),
          amount: Number(data.amount) || 0,
          payout: Number(data.payout) || 0,
          status: statuses.includes(data.status) ? data.status as OperationStatus : 'new',
          priority: asPriority(data.priority),
          note: String(data.note || ''),
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
        };
      }).sort((a, b) => (b.updatedAt?.getTime() || b.createdAt?.getTime() || 0) - (a.updatedAt?.getTime() || a.createdAt?.getTime() || 0)));
    }, () => setNotice('İşlem kayıtları okunamadı.'));
  }, [db]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'operationNotes'), (snapshot) => {
      setOperationNotes(snapshot.docs.map((entry) => {
        const data = entry.data();
        const type = data.type === 'status' || data.type === 'system' ? data.type : 'note';
        return { id: entry.id, operationId: String(data.operationId || ''), type, body: String(data.body || ''), createdAt: data.createdAt?.toDate?.() ?? null };
      }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
    }, () => setNotice('İç işlem notları okunamadı.'));
  }, [db]);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');
    return operations.filter((operation) => {
      const matchesStatus = filter === 'all' || operation.status === filter;
      const searchable = `${operation.customer} ${operation.contact} ${operation.service} ${operation.note} ${priorityLabels[operation.priority]}`.toLocaleLowerCase('tr-TR');
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, operations, query]);

  const metrics = useMemo(() => ({
    newRequests: operations.filter((item) => item.status === 'new').length,
    active: operations.filter((item) => !['completed', 'cancelled'].includes(item.status)).length,
    urgent: operations.filter((item) => item.priority === 'urgent' && !['completed', 'cancelled'].includes(item.status)).length,
    completed: operations.filter((item) => item.status === 'completed').length,
  }), [operations]);

  async function addTimelineEntry(operationId: string, type: OperationNote['type'], body: string) {
    if (!db) return;
    await addDoc(collection(db, 'operationNotes'), { operationId, type, body: body.slice(0, 600), actorId, createdAt: serverTimestamp() });
  }

  async function createOperation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !form.customer.trim() || !form.contact.trim() || !form.amount) return;
    const amount = Number(form.amount.replace(',', '.'));
    const payout = Number((form.payout || '0').replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(payout) || payout < 0) {
      setNotice('Tutar ve ödeme değerlerini kontrol edin.');
      return;
    }
    try {
      const operation = await addDoc(collection(db, 'operations'), {
        customer: form.customer.trim().slice(0, 100),
        contact: form.contact.trim().slice(0, 120),
        service: form.service,
        amount,
        payout,
        priority: form.priority,
        status: 'new',
        note: form.note.trim().slice(0, 500),
        createdBy: actorId,
        updatedBy: actorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await addTimelineEntry(operation.id, 'system', 'İşlem kaydı yönetim tarafından oluşturuldu.');
      await addDoc(collection(db, 'contentAudit'), { action: 'operation:created', articleSlug: operation.id, actorId, createdAt: serverTimestamp() });
      setForm({ customer: '', contact: '', service: rateItems[0].serviceSlug, amount: '', payout: '', priority: 'normal', note: '' });
      setShowForm(false);
      setNotice('İşlem kaydı oluşturuldu.');
    } catch {
      setNotice('İşlem kaydı oluşturulamadı. Yetki ve bağlantıyı kontrol edin.');
    }
  }

  async function changeStatus(operation: Operation, status: OperationStatus) {
    if (!db || savingId || operation.status === status) return;
    setSavingId(operation.id);
    try {
      await updateDoc(doc(db, 'operations', operation.id), { status, updatedBy: actorId, updatedAt: serverTimestamp() });
      await addTimelineEntry(operation.id, 'status', `Durum “${statusLabels[status]}” olarak güncellendi.`);
      await addDoc(collection(db, 'contentAudit'), { action: `operation:${status}`, articleSlug: operation.id, actorId, createdAt: serverTimestamp() });
      if (operation.memberId) {
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
    } catch {
      setNotice('İşlem durumu güncellenemedi. Yetki ve bağlantıyı kontrol edin.');
    } finally {
      setSavingId(null);
    }
  }

  async function changePriority(operation: Operation, priority: OperationPriority) {
    if (!db || savingId || operation.priority === priority) return;
    setSavingId(operation.id);
    try {
      await updateDoc(doc(db, 'operations', operation.id), { priority, updatedBy: actorId, updatedAt: serverTimestamp() });
      await addTimelineEntry(operation.id, 'status', `Öncelik “${priorityLabels[priority]}” olarak ayarlandı.`);
      await addDoc(collection(db, 'contentAudit'), { action: `operation:priority:${priority}`, articleSlug: operation.id, actorId, createdAt: serverTimestamp() });
      setNotice(`İşlem önceliği “${priorityLabels[priority]}” olarak ayarlandı.`);
    } catch {
      setNotice('İşlem önceliği güncellenemedi.');
    } finally {
      setSavingId(null);
    }
  }

  async function addInternalNote(event: FormEvent<HTMLFormElement>, operation: Operation) {
    event.preventDefault();
    const body = (noteDrafts[operation.id] || '').trim();
    if (!db || body.length < 3 || noteSavingId) return;
    setNoteSavingId(operation.id);
    try {
      await addTimelineEntry(operation.id, 'note', body);
      await updateDoc(doc(db, 'operations', operation.id), { updatedBy: actorId, updatedAt: serverTimestamp() });
      await addDoc(collection(db, 'contentAudit'), { action: 'operation:note', articleSlug: operation.id, actorId, createdAt: serverTimestamp() });
      setNoteDrafts((current) => ({ ...current, [operation.id]: '' }));
      setNotice('Ekip notu işlem geçmişine eklendi.');
    } catch {
      setNotice('Ekip notu eklenemedi.');
    } finally {
      setNoteSavingId(null);
    }
  }

  function exportOperations() {
    if (!visible.length) {
      setNotice('Dışa aktarılacak işlem bulunmuyor.');
      return;
    }
    const escapeCell = (value: string | number) => {
      const text = String(value ?? '');
      const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const header = ['Müşteri', 'İletişim', 'Hizmet', 'Durum', 'Öncelik', 'Alınan tutar', 'Tahmini ödeme', 'Kaynak', 'Tarih'];
    const rows = visible.map((operation) => [
      operation.customer,
      operation.contact,
      operation.service,
      statusLabels[operation.status],
      priorityLabels[operation.priority],
      operation.amount,
      operation.payout,
      operation.memberId ? 'Üye talebi' : 'Yönetici kaydı',
      operation.updatedAt?.toLocaleDateString('tr-TR') || operation.createdAt?.toLocaleDateString('tr-TR') || '',
    ]);
    const csv = [header, ...rows].map((row) => row.map(escapeCell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `sky-bozum-islemler-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`${visible.length} işlem CSV olarak indirildi.`);
  }

  return <section className="admin-section">
    <div className="admin-section-head"><div><span>İŞLEM MERKEZİ</span><h2>Bozum taleplerini takip edin</h2></div><p>Durum, öncelik ve yalnız ekibin görebildiği işlem notları tek kayıtta tutulur.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <div className="admin-metrics admin-operation-metrics"><article><strong>{metrics.newRequests}</strong><span>yeni talep</span></article><article><strong>{metrics.active}</strong><span>aktif işlem</span></article><article><strong>{metrics.urgent}</strong><span>acil takip</span></article><article><strong>{metrics.completed}</strong><span>tamamlanan</span></article></div>
    <div className="admin-filterbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Müşteri, iletişim veya hizmet ara" aria-label="İşlemlerde ara" /><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">Tüm işlemler</option>{statuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select><span>{visible.length} kayıt</span><button className="admin-secondary compact" onClick={exportOperations}>CSV indir</button><button className="admin-primary compact" onClick={() => setShowForm(true)}>Yeni işlem →</button></div>
    <div className="admin-table admin-operation-table">{visible.length ? visible.map((operation) => {
      const notes = operationNotes.filter((item) => item.operationId === operation.id);
      const isOpen = openOperationId === operation.id;
      return <article key={operation.id} className={operation.priority === 'urgent' ? 'is-urgent' : ''}>
        <div>{operation.memberId ? <Link href={`/uyeler/${operation.memberId}`} style={{ color: 'inherit', textDecoration: 'none' }}><strong>{operation.customer}</strong></Link> : <strong>{operation.customer}</strong>}<span>{operation.contact} · {operation.service}</span><small>{operation.memberId ? 'Üye talebi · profile git' : 'Yönetici kaydı'}</small></div>
        <span className={`admin-status ${operation.status === 'completed' ? 'status-approved' : operation.status === 'cancelled' ? 'status-rejected' : 'status-pending'}`}>{statusLabels[operation.status]}</span>
        <b>{operation.amount.toLocaleString('tr-TR')} TL → {operation.payout.toLocaleString('tr-TR')} TL</b>
        <small>{operation.updatedAt?.toLocaleDateString('tr-TR') || operation.createdAt?.toLocaleDateString('tr-TR') || 'Tarih yok'}</small>
        <div className="admin-operation-controls"><select aria-label={`${operation.customer} işlem önceliği`} value={operation.priority} disabled={savingId === operation.id} onChange={(event) => void changePriority(operation, event.target.value as OperationPriority)}>{priorities.map((priority) => <option value={priority} key={priority}>{priorityLabels[priority]}</option>)}</select><select aria-label={`${operation.customer} işlem durumu`} value={operation.status} disabled={savingId === operation.id} onChange={(event) => void changeStatus(operation, event.target.value as OperationStatus)}>{statuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select><button type="button" className="admin-secondary compact" onClick={() => setOpenOperationId(isOpen ? null : operation.id)}>{isOpen ? 'Notları kapat' : `İç notlar (${notes.length})`}</button></div>
        {operation.note && <p className="admin-operation-note">İlk not: {operation.note}</p>}
        {isOpen && <section className="admin-operation-history" aria-label={`${operation.customer} işlem geçmişi`}><header><div><span>EKİP İÇİ</span><h3>İşlem geçmişi</h3></div><small>Bu notlar müşteriye gösterilmez.</small></header><div className="admin-operation-timeline">{notes.length ? notes.map((item) => <div key={item.id}><b>{noteTypeLabels[item.type]}</b><p>{item.body}</p><small>{item.createdAt ? item.createdAt.toLocaleString('tr-TR') : 'Kaydediliyor…'}</small></div>) : <p>Bu işlem için henüz iç not yok.</p>}</div><form onSubmit={(event) => void addInternalNote(event, operation)}><label htmlFor={`operation-note-${operation.id}`}>Ekip notu</label><textarea id={`operation-note-${operation.id}`} value={noteDrafts[operation.id] || ''} onChange={(event) => setNoteDrafts((current) => ({ ...current, [operation.id]: event.target.value }))} maxLength={600} placeholder="Müşteriye görünmez; sadece ekip için takip notu yazın." rows={3} /><button className="admin-primary compact" type="submit" disabled={noteSavingId === operation.id}>{noteSavingId === operation.id ? 'Kaydediliyor…' : 'Notu ekle'}</button></form></section>}
      </article>;
    }) : <p className="admin-empty">Henüz işlem kaydı bulunmuyor.</p>}</div>
    {showForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="operation-modal-title"><button className="admin-close" onClick={() => setShowForm(false)} aria-label="Pencereyi kapat">×</button><span>YENİ İŞLEM</span><h2 id="operation-modal-title">Bozum talebi oluştur</h2><form onSubmit={(event) => void createOperation(event)}><label>Müşteri adı<input value={form.customer} onChange={(event) => setForm({ ...form, customer: event.target.value })} required /></label><label>İletişim bilgisi<input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} placeholder="Telefon veya e-posta" required /></label><label>Hizmet<select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })}>{rateItems.map((item) => <option value={item.serviceSlug} key={item.id}>{item.name}</option>)}</select></label><label>Öncelik<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as OperationPriority })}>{priorities.map((priority) => <option value={priority} key={priority}>{priorityLabels[priority]}</option>)}</select></label><label>Alınan bakiye<input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} inputMode="decimal" required /></label><label>Tahmini net ödeme<input value={form.payout} onChange={(event) => setForm({ ...form, payout: event.target.value })} inputMode="decimal" required /></label><label>İlk işlem notu<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows={3} /></label><button className="admin-primary" type="submit">İşlemi kaydet →</button></form></section></div>}
  </section>;
}
