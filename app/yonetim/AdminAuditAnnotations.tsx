'use client';

import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { ContentAuditEvent } from '../lib/admin';

type Annotation = { id: string; note: string; updatedBy: string; updatedAt: Date | null };

function safeKey(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 160);
}

export default function AdminAuditAnnotations({ db, actorId, events }: { db: Firestore | null; actorId: string; events: ContentAuditEvent[] }) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [eventId, setEventId] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'auditAnnotations'), (snapshot) => setAnnotations(snapshot.docs.map((entry) => {
      const data = entry.data();
      return { id: entry.id, note: String(data.note || ''), updatedBy: String(data.updatedBy || ''), updatedAt: data.updatedAt?.toDate?.() || null };
    })));
  }, [db]);

  const selected = useMemo(() => annotations.find((item) => item.id === safeKey(eventId)), [annotations, eventId]);
  useEffect(() => { setNote(selected?.note || ''); }, [selected]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!db || !eventId || !note.trim() || busy) return;
    setBusy(true); setMessage('');
    try {
      const annotationId = safeKey(eventId);
      await setDoc(doc(db, 'auditAnnotations', annotationId), { sourceEventId: eventId, note: note.trim().slice(0, 800), updatedBy: actorId, updatedAt: serverTimestamp() }, { merge: true });
      await addDoc(collection(db, 'contentAudit'), { action: selected ? 'audit-note:corrected' : 'audit-note:added', articleSlug: eventId, actorId, createdAt: serverTimestamp() });
      setMessage(selected ? 'Açıklama düzeltildi; önceki denetim kaydı değiştirilmedi.' : 'Yönetici açıklaması kaydedildi.');
    } finally { setBusy(false); }
  }

  return <section className="audit-annotation-panel">
    <header><div><span>DENETİM AÇIKLAMASI</span><h3>Kayda not veya düzeltme ekle</h3></div><p>Asıl log silinemez ve değiştirilemez. Düzeltmeler ayrı zaman damgalı kayıt olarak eklenir.</p></header>
    <form onSubmit={save}>
      <label>Denetim kaydı<select value={eventId} onChange={(event) => setEventId(event.target.value)} required><option value="">Kayıt seçin</option>{events.map((item) => <option key={item.id} value={item.id}>{item.action} · {item.articleSlug}</option>)}</select></label>
      <label>Yönetici açıklaması<textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={800} rows={3} placeholder="İşlemin nedeni, düzeltme bilgisi veya takip notu" required /></label>
      <button className="admin-primary" disabled={busy || !eventId}>{busy ? 'Kaydediliyor…' : selected ? 'Açıklamayı düzelt' : 'Açıklama ekle'}</button>
    </form>
    {message ? <p className="admin-success">{message}</p> : null}
  </section>;
}
