'use client';

import { collection, doc, onSnapshot, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { rateItems } from '../lib/rates';

type RateOverride = { rate: number; maxRate: number; status: 'draft' | 'published'; updatedAt: Date | null; updatedBy: string };

export default function AdminRatePanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [overrides, setOverrides] = useState<Record<string, RateOverride>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ rate: '', maxRate: '', status: 'draft' as RateOverride['status'] });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'rateOverrides'), (snapshot) => {
      const next: Record<string, RateOverride> = {};
      snapshot.docs.forEach((entry) => {
        const data = entry.data();
        next[entry.id] = {
          rate: Number(data.rate) || 0,
          maxRate: Number(data.maxRate) || 0,
          status: data.status === 'published' ? 'published' : 'draft',
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          updatedBy: String(data.updatedBy || ''),
        };
      });
      setOverrides(next);
    }, () => setNotice('Oran kayıtları okunamadı.'));
  }, [db]);

  const rows = useMemo(() => rateItems.map((item) => ({ item, override: overrides[item.id] })), [overrides]);

  function start(itemId: string) {
    const item = rateItems.find((entry) => entry.id === itemId)!;
    const current = overrides[itemId];
    setEditing(itemId);
    setForm({ rate: String(current?.rate ?? item.rate), maxRate: String(current?.maxRate ?? item.maxRate), status: current?.status ?? 'draft' });
    setNotice('');
  }

  async function save() {
    if (!db || !editing) return;
    const rate = Number(form.rate.replace(',', '.'));
    const maxRate = Number(form.maxRate.replace(',', '.'));
    if (!Number.isFinite(rate) || !Number.isFinite(maxRate) || rate < 0 || maxRate < rate || maxRate > 100) {
      setNotice('Oran aralığını doğru girin. Üst oran, alt orandan küçük olamaz.');
      return;
    }
    await setDoc(doc(db, 'rateOverrides', editing), { rate, maxRate, status: form.status, updatedBy: actorId, updatedAt: serverTimestamp() }, { merge: true });
    await setDoc(doc(collection(db, 'contentAudit')), { action: `rate:${form.status}`, articleSlug: editing, actorId, createdAt: serverTimestamp() });
    setEditing(null);
    setNotice('Oran kaydı güncellendi.');
  }

  return <section className="admin-section">
    <div className="admin-section-head"><div><span>ORAN YÖNETİMİ</span><h2>Güncel oran kayıtları</h2></div><p>Oran değişiklikleri taslak olarak hazırlanır; yayına alınan kayıtlar tarih ve yönetici bilgisiyle saklanır.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <div className="admin-table">
      {rows.map(({ item, override }) => <article key={item.id}>
        <div><strong>{item.name}</strong><span>{item.category} · varsayılan %{item.rate} - %{item.maxRate}</span></div>
        <span className={`admin-status ${override?.status === 'published' ? 'status-approved' : 'status-pending'}`}>{override?.status === 'published' ? 'Yayında' : override ? 'Taslak' : 'Varsayılan'}</span>
        <b>{override ? `%${override.rate} - %${override.maxRate}` : item.range}</b>
        <small>{override?.updatedAt?.toLocaleDateString('tr-TR') || 'Kod varsayılanı'}</small>
        <button onClick={() => start(item.id)}>Düzenle →</button>
      </article>)}
    </div>
    {editing && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="rate-modal-title">
      <button className="admin-close" onClick={() => setEditing(null)} aria-label="Pencereyi kapat">×</button>
      <span>ORAN KAYDI</span><h2 id="rate-modal-title">{rateItems.find((item) => item.id === editing)?.name}</h2>
      <form onSubmit={(event) => { event.preventDefault(); void save(); }}>
        <label>Alt oran (%)<input value={form.rate} onChange={(event) => setForm({ ...form, rate: event.target.value })} inputMode="decimal" required /></label>
        <label>Üst oran (%)<input value={form.maxRate} onChange={(event) => setForm({ ...form, maxRate: event.target.value })} inputMode="decimal" required /></label>
        <label>Yayın durumu<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as RateOverride['status'] })}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label>
        <button className="admin-primary" type="submit">Oranı kaydet →</button>
      </form>
    </section></div>}
  </section>;
}
