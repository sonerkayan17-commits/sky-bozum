'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { addDoc, collection, onSnapshot, query, serverTimestamp, where, type Firestore } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { rateItems } from '../../lib/rates';
import './member-operations.css';

type Status = 'new' | 'awaiting_product' | 'checking' | 'awaiting_payment' | 'completed' | 'cancelled';
type Operation = { id: string; service: string; amount: number; payout: number; status: Status; note: string; createdAt: Date | null };
const labels: Record<Status, string> = { new: 'Talep alındı', awaiting_product: 'Ürün bekleniyor', checking: 'Kontrol ediliyor', awaiting_payment: 'Ödeme hazırlanıyor', completed: 'Tamamlandı', cancelled: 'İptal edildi' };

export default function MemberOperations() {
  const [user, setUser] = useState<User | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [memberName, setMemberName] = useState('');
  const [contact, setContact] = useState('');
  const [service, setService] = useState(rateItems[0].serviceSlug);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const client = getFirebaseClient();
    setDb(client.db);
    if (!client.auth || !client.db) { setLoading(false); return; }
    let stopOperations = () => {};
    const stopAuth = onAuthStateChanged(client.auth, (nextUser) => {
      stopOperations();
      setUser(nextUser);
      if (!nextUser) { setOperations([]); setLoading(false); return; }
      setLoading(true);
      stopOperations = onSnapshot(query(collection(client.db!, 'operations'), where('memberId', '==', nextUser.uid)), (snapshot) => {
        setOperations(snapshot.docs.map((entry) => { const data = entry.data(); const status = data.status as Status; return { id: entry.id, service: String(data.service || ''), amount: Number(data.amount) || 0, payout: Number(data.payout) || 0, status: labels[status] ? status : 'new', note: String(data.note || ''), createdAt: data.createdAt?.toDate?.() ?? null }; }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
        setLoading(false);
      }, () => { setNotice('Talepleriniz yüklenemedi.'); setLoading(false); });
    });
    return () => { stopAuth(); stopOperations(); };
  }, []);

  const active = useMemo(() => operations.filter((item) => !['completed', 'cancelled'].includes(item.status)).length, [operations]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !user || !memberName.trim() || !contact.trim() || submitting) return;
    const numericAmount = Number(amount.replace(',', '.'));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) { setNotice('Geçerli bir tutar girin.'); return; }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'operations'), { memberId: user.uid, customer: memberName.trim().slice(0, 100), contact: contact.trim().slice(0, 120), service, amount: numericAmount, payout: 0, status: 'new', note: note.trim().slice(0, 500), createdBy: user.uid, updatedBy: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    setAmount(''); setNote(''); setShowForm(false); setNotice('Talebiniz alındı. Güncel durumu bu sayfadan takip edebilirsiniz.');
  }
    catch {
      setNotice('Talep kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) return <main className="member-loading">Talepleriniz hazırlanıyor…</main>;
  if (!user) return <main className="member-loading"><div><h1>Üye girişi gerekli</h1><p>Talep oluşturmak ve durumunu izlemek için hesabınıza giriş yapın.</p><Link href="/giris">Giriş yap</Link></div></main>;
  return <main className="member-page"><div className="member-shell"><section className="member-content member-operations-page"><header className="member-head"><span>TALEPLERİM</span><h1>Bozum taleplerinizi takip edin.</h1><p>Talebinizin hangi aşamada olduğunu ve tahmini tutarı tek ekranda görün.</p></header><div className="member-stats"><article><span>Aktif talepler</span><strong>{active}</strong><small>İşlem ekibi tarafından takip ediliyor</small></article><article><span>Toplam talep</span><strong>{operations.length}</strong><small>Hesabınıza ait kayıt</small></article><article><span>Güvenli süreç</span><strong>4 adım</strong><small>Talep, kontrol, teyit, ödeme</small></article></div><div className="member-operation-actions"><button className="member-primary-button" onClick={() => setShowForm(true)}>Yeni bozum talebi oluştur →</button><Link href="/hizmetler">Hizmet koşullarını incele</Link></div>{notice && <p className="member-notice">{notice}</p>}<div className="member-operation-list">{operations.length ? operations.map((operation) => <article key={operation.id}><div className="member-operation-top"><div><span>{operation.service}</span><h2>{operation.amount.toLocaleString('tr-TR')} TL talep</h2></div><b className={`member-operation-status status-${operation.status}`}>{labels[operation.status]}</b></div><div className="member-operation-meta"><span>{operation.payout > 0 ? `Tahmini net ödeme: ${operation.payout.toLocaleString('tr-TR')} TL` : 'Net ödeme kontrol sonrası belirlenir'}</span><time>{operation.createdAt?.toLocaleDateString('tr-TR') || 'Yeni'}</time></div>{operation.note && <p>{operation.note}</p>}</article>) : <div className="member-empty-state"><h2>Henüz talep oluşturmadınız.</h2><p>Hizmet ve tutarınızı belirleyerek ilk bozum talebinizi güvenli kanaldan başlatabilirsiniz.</p></div>}</div></section></div>{showForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal member-request-modal" role="dialog" aria-modal="true" aria-labelledby="member-request-title"><button className="admin-close" onClick={() => setShowForm(false)} aria-label="Pencereyi kapat">×</button><span>YENİ TALEP</span><h2 id="member-request-title">Bozum talebi oluştur</h2><form onSubmit={(event) => void submit(event)}><label>Ad soyad<input value={memberName} onChange={(event) => setMemberName(event.target.value)} required /></label><label>İletişim bilgisi<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Telefon veya e-posta" required /></label><label>Hizmet<select value={service} onChange={(event) => setService(event.target.value)}>{rateItems.map((item) => <option value={item.serviceSlug} key={item.id}>{item.name}</option>)}</select></label><label>Bakiye / ürün tutarı<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="1.000" required /></label><label>Notunuz<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} /></label><button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'Gönderiliyor…' : 'Talebi gönder →'}</button></form></section></div>}</main>;
}
