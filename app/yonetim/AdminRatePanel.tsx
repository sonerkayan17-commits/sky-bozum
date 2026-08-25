'use client';

import { collection, doc, onSnapshot, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { RATE_MAX_AGE_DAYS, isRateDataStale, rateDataAgeDays, rateItems } from '../lib/rates';

type RateOverride = { rate: number; maxRate: number; status: 'draft' | 'published'; updatedAt: Date | null; updatedBy: string };

export default function AdminRatePanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [overrides, setOverrides] = useState<Record<string, RateOverride>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ rate: '', maxRate: '', status: 'draft' as RateOverride['status'] });
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

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

  useEffect(() => {
    setCheckedAt(new Date());
  }, []);

  const rows = useMemo(() => rateItems.map((item) => ({ item, override: overrides[item.id] })), [overrides]);
  const freshness = useMemo(() => {
    const published = Object.values(overrides).filter((entry) => entry.status === 'published' && entry.updatedAt);
    const newest = published.reduce<Date | null>((latest, entry) => !latest || (entry.updatedAt && entry.updatedAt > latest) ? entry.updatedAt : latest, null);
    const days = newest && checkedAt ? Math.max(0, Math.floor((checkedAt.getTime() - newest.getTime()) / 86_400_000)) : null;
    const fresh = checkedAt ? (days !== null ? days <= RATE_MAX_AGE_DAYS : !isRateDataStale(checkedAt)) : false;
    return { published: published.length, newest, days, fresh, loading: !checkedAt };
  }, [checkedAt, overrides]);

  function start(itemId: string) {
    const item = rateItems.find((entry) => entry.id === itemId)!;
    const current = overrides[itemId];
    setEditing(itemId);
    setForm({ rate: String(current?.rate ?? item.rate), maxRate: String(current?.maxRate ?? item.maxRate), status: current?.status ?? 'draft' });
    setNotice('');
  }

  async function save() {
    if (!db || !editing || saving) return;
    const item = rateItems.find((entry) => entry.id === editing);
    const rateText = form.rate.trim().replace(',', '.');
    const maxRateText = form.maxRate.trim().replace(',', '.');
    const rate = Number(rateText);
    const maxRate = Number(maxRateText);
    if (!rateText || !maxRateText || !Number.isFinite(rate) || !Number.isFinite(maxRate) || rate <= 0 || maxRate < rate || maxRate > 100) {
      setNotice('Geçerli bir alt ve üst oran girin. Oran sıfırdan büyük olmalı; üst oran alt orandan küçük olamaz.');
      return;
    }
    setSaving(true);
    setNotice('');
    try {
      await setDoc(doc(db, 'rateOverrides', editing), { rate, maxRate, status: form.status, updatedBy: actorId, updatedAt: serverTimestamp() });
      await setDoc(doc(collection(db, 'contentAudit')), { action: `rate:${form.status}`, articleSlug: editing, actorId, createdAt: serverTimestamp() });
      setEditing(null);
      setNotice(`${item?.name || 'Hizmet'} oranı ${form.status === 'published' ? 'yayına alındı' : 'taslak olarak kaydedildi'}: ${rate === maxRate ? `%${rate}` : `%${rate} – %${maxRate}`}.`);
    } catch {
      setNotice('Oran kaydedilemedi. Yönetici yetkisini ve bağlantıyı kontrol edip tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  return <section className="admin-section">
    <div className="admin-section-head"><div><span>ORAN YÖNETİMİ</span><h2>Güncel oran kayıtları</h2></div><p>Oranları yalnızca bu bölümden değiştirin. “Yayında” seçilen kayıt ana sayfa ve hesaplama araçlarına otomatik yansır.</p></div>
    <section className={`admin-rate-freshness ${freshness.fresh ? 'is-fresh' : 'is-stale'}`} aria-label="Oran güncellik durumu">
      <div><span>YAYIN GÜNCELLİĞİ</span><strong>{freshness.loading ? 'Durum hesaplanıyor' : freshness.fresh ? 'Kontrol eşiği içinde' : 'Güncelleme gerekiyor'}</strong><small>{freshness.newest ? `Son yayımlanan oran: ${freshness.newest.toLocaleString('tr-TR')} (${freshness.days} gün önce)` : freshness.loading ? 'Yayın kayıtları kontrol ediliyor.' : `Varsayılan oran seti ${rateDataAgeDays(checkedAt!)} gündür güncellenmedi.`}</small></div>
      <p><b>{freshness.published}/{rateItems.length}</b> oran yayında. {freshness.loading ? 'Kayıtlar okunuyor.' : freshness.fresh ? `Eşik: ${RATE_MAX_AGE_DAYS} gün.` : 'Değişiklik yapmadan önce kaynak ve net oran teyidini kayda alın.'}</p>
    </section>
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
        <button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Kaydediliyor…' : 'Oranı kaydet →'}</button>
      </form>
    </section></div>}
  </section>;
}
