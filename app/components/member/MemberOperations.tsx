'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, where, writeBatch, type Firestore } from 'firebase/firestore';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { formatCodeValue, payoutMethodLabel, razerCodeValues, type CodeSalePayoutMethod, type RazerCodeCurrency } from '../../lib/codeSales';
import { getFirebaseClient } from '../../lib/firebase';
import { parseTurkishAmount, rateItems, validateAmount } from '../../lib/rates';
import './member-operations.css';
import './member-commerce.css';

type Status = 'new' | 'awaiting_product' | 'checking' | 'awaiting_payment' | 'completed' | 'cancelled';
type Operation = {
  id: string; service: string; amount: number; payout: number; status: Status; note: string;
  operationType: 'standard' | 'code_sale'; currency: RazerCodeCurrency; codeValue: number; codeCount: number;
  payoutMethod: CodeSalePayoutMethod; payoutState: string; payoutReference: string;
  approvedCodeCount: number; rejectedCodeCount: number; reviewState: string;
  createdAt: Date | null; updatedAt: Date | null;
};
type BankInfo = { accountHolder: string; bankName: string; iban: string };
type EncryptedCode = { id: string; codeEncrypted: string };

const labels: Record<Status, string> = { new: 'Talep alındı', awaiting_product: 'Kod bekleniyor', checking: 'Kod kontrol ediliyor', awaiting_payment: 'Ödeme onaylandı', completed: 'Ödeme tamamlandı', cancelled: 'İptal edildi' };
const statusStep: Record<Status, number> = { new: 0, awaiting_product: 0, checking: 1, awaiting_payment: 2, completed: 3, cancelled: -1 };
const steps = ['Talep', 'Kod kontrolü', 'Ödeme onayı', 'Tamamlandı'];

function maskIban(value: string) {
  const clean = value.replace(/\s/g, '');
  return clean.length > 10 ? `${clean.slice(0, 4)} •••• •••• •••• ${clean.slice(-4)}` : clean;
}

export default function MemberOperations() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [memberName, setMemberName] = useState('');
  const [contact, setContact] = useState('');
  const [service, setService] = useState(rateItems[0].serviceSlug);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [formMode, setFormMode] = useState<'standard' | 'code_sale'>('code_sale');
  const [currency, setCurrency] = useState<RazerCodeCurrency>('TRY');
  const [codeValue, setCodeValue] = useState(razerCodeValues.TRY[0]);
  const [codes, setCodes] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<CodeSalePayoutMethod>('balance');
  const [accepted, setAccepted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const requestedService = searchParams.get('service');
    if (requestedService === 'razer-gold-tl' || requestedService === 'razer-gold-usd') {
      const nextCurrency = requestedService.endsWith('usd') ? 'USD' : 'TRY';
      setCurrency(nextCurrency);
      setCodeValue(razerCodeValues[nextCurrency][0]);
      setFormMode('code_sale');
      setShowForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const client = getFirebaseClient();
    setDb(client.db);
    if (!client.auth || !client.db) { setLoading(false); return; }
    let stopOperations = () => {};
    const stopAuth = onAuthStateChanged(client.auth, (nextUser) => {
      stopOperations();
      setUser(nextUser);
      if (!nextUser) { setOperations([]); setLoading(false); return; }
      setMemberName(nextUser.displayName || '');
      setContact(nextUser.email || '');
      void Promise.all([
        getDoc(doc(client.db!, 'members', nextUser.uid)).then((snapshot) => {
          const member = snapshot.data();
          if (!member) return;
          setMemberName(String(member.displayName || nextUser.displayName || ''));
          setContact(String(member.phone || member.email || nextUser.email || ''));
        }),
        getDoc(doc(client.db!, 'memberPrivate', nextUser.uid)).then((snapshot) => {
          const data = snapshot.data();
          setBankInfo(data ? { accountHolder: String(data.accountHolder || ''), bankName: String(data.bankName || ''), iban: String(data.iban || '') } : null);
        }),
      ]).catch(() => undefined);
      setLoading(true);
      stopOperations = onSnapshot(query(collection(client.db!, 'operations'), where('memberId', '==', nextUser.uid)), (snapshot) => {
        setOperations(snapshot.docs.map((entry) => {
          const data = entry.data();
          const status = data.status as Status;
          return {
            id: entry.id, service: String(data.service || ''), amount: Number(data.amount) || 0, payout: Number(data.payout) || 0,
            status: labels[status] ? status : 'new', note: String(data.note || ''), operationType: data.operationType === 'code_sale' ? 'code_sale' : 'standard',
            currency: data.currency === 'USD' ? 'USD' : 'TRY', codeValue: Number(data.codeValue) || 0, codeCount: Math.max(0, Math.trunc(Number(data.codeCount) || 0)),
            payoutMethod: data.payoutMethod === 'iban' ? 'iban' : 'balance', payoutState: String(data.payoutState || 'pending'), payoutReference: String(data.payoutReference || ''),
            approvedCodeCount: Math.max(0, Math.trunc(Number(data.approvedCodeCount) || 0)), rejectedCodeCount: Math.max(0, Math.trunc(Number(data.rejectedCodeCount) || 0)), reviewState: String(data.reviewState || 'pending'),
            createdAt: data.createdAt?.toDate?.() ?? null, updatedAt: data.updatedAt?.toDate?.() ?? null,
          } satisfies Operation;
        }).sort((a, b) => (b.updatedAt?.getTime() || b.createdAt?.getTime() || 0) - (a.updatedAt?.getTime() || a.createdAt?.getTime() || 0)));
        setLoading(false);
      }, () => { setNotice('Talepleriniz yüklenemedi.'); setLoading(false); });
    });
    return () => { stopAuth(); stopOperations(); };
  }, []);

  const active = useMemo(() => operations.filter((item) => !['completed', 'cancelled'].includes(item.status)).length, [operations]);
  const completed = useMemo(() => operations.filter((item) => item.status === 'completed').length, [operations]);
  const requestedService = searchParams.get('service');
  const loginNext = requestedService === 'razer-gold-tl' || requestedService === 'razer-gold-usd' ? `/hesabim/talepler?service=${requestedService}` : '/hesabim/talepler';

  function openCodeSale() { setFormMode('code_sale'); setShowForm(true); setNotice(''); }
  function openStandardRequest() { setFormMode('standard'); setShowForm(true); setNotice(''); }

  async function submitStandard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !user || !memberName.trim() || !contact.trim() || submitting) return;
    const numericAmount = parseTurkishAmount(amount);
    const selectedService = rateItems.find((item) => item.serviceSlug === service) || rateItems[0];
    const amountError = validateAmount(numericAmount, selectedService);
    if (amountError) { setNotice(amountError); return; }
    setSubmitting(true);
    try {
      const operationRef = doc(collection(db, 'operations'));
      const batch = writeBatch(db);
      batch.set(operationRef, { memberId: user.uid, customer: memberName.trim().slice(0, 100), contact: contact.trim().slice(0, 120), service, amount: numericAmount, payout: 0, status: 'new', note: note.trim().slice(0, 500), createdBy: user.uid, updatedBy: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      await batch.commit();
      setAmount(''); setNote(''); setShowForm(false); setNotice('Talebiniz alındı. Güncel durumu bu sayfadan takip edebilirsiniz.');
    } catch { setNotice('Talep kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.'); }
    finally { setSubmitting(false); }
  }

  async function submitCodeSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !user || submitting) return;
    if (memberName.trim().length < 2 || contact.trim().length < 3) { setNotice('Kod satışı için üyelik adınız ve iletişim bilginiz eksiksiz olmalı.'); return; }
    if (!accepted) { setNotice('Kod sahipliği ve kullanılmamış kod onayını işaretleyin.'); return; }
    if (payoutMethod === 'iban' && !bankInfo?.iban) { setNotice('IBAN ödemesi için önce banka bilgilerinizi kaydedin.'); return; }
    setSubmitting(true);
    try {
      const response = await fetch('/api/code-sale/encrypt', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify({ currency, codeValue, codes }) });
      const payload = await response.json() as { encrypted?: EncryptedCode[]; currency?: RazerCodeCurrency; codeValue?: number; error?: string };
      if (!response.ok || !payload.encrypted?.length || !payload.currency || !payload.codeValue) throw new Error(payload.error || 'Kodlar güvenli kasaya hazırlanamadı.');
      const operationRef = doc(collection(db, 'operations'));
      const codeCount = payload.encrypted.length;
      const faceValue = payload.codeValue * codeCount;
      const codeHashes = payload.encrypted.map((item) => item.id);
      const timestamp = serverTimestamp();
      const batch = writeBatch(db);
      batch.set(operationRef, {
        memberId: user.uid, customer: memberName.trim().slice(0, 100), contact: contact.trim().slice(0, 120), service: payload.currency === 'USD' ? 'razer-gold-usd' : 'razer-gold-tl',
        amount: faceValue, payout: 0, status: 'new', note: note.trim().slice(0, 500), operationType: 'code_sale', productLabel: 'Razer Gold', currency: payload.currency,
        codeValue: payload.codeValue, codeCount, codesEncrypted: payload.encrypted.map((item) => item.codeEncrypted), codeHashes, codeReviews: [], approvedCodeCount: 0, rejectedCodeCount: 0, reviewState: 'pending', payoutMethod, payoutState: 'pending',
        createdBy: user.uid, updatedBy: user.uid, createdAt: timestamp, updatedAt: timestamp,
      });
      payload.encrypted.forEach((item) => batch.set(doc(db, 'codeSaleClaims', item.id), { operationId: operationRef.id, memberId: user.uid, createdAt: timestamp }));
      await batch.commit();
      setCodes(''); setNote(''); setAccepted(false); setShowForm(false);
      setNotice(`${codeCount} Razer Gold kodu güvenli inceleme sırasına alındı. Kodlarınız yalnız yetkili yönetici tarafından açılabilir.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Kod talebi kaydedilemedi. Aynı kod daha önce gönderilmiş olabilir.'); }
    finally { setSubmitting(false); }
  }

  if (loading) return <main className="member-loading">Talepleriniz hazırlanıyor…</main>;
  if (!user) return <main className="member-loading"><div><h1>Üye girişi gerekli</h1><p>Kod göndermek ve ödemenizi izlemek için hesabınıza giriş yapın.</p><Link href={`/giris?next=${encodeURIComponent(loginNext)}`}>Giriş yap</Link></div></main>;

  return <main className="member-page"><div className="member-shell"><section className="member-content member-operations-page">
    <header className="member-head"><span>KOD SATIŞI VE BOZUM</span><h1>Kodunuzu gönderin, ödemeyi hesabınızdan izleyin.</h1><p>Razer Gold kodu şifreli kasaya alınır; doğrulama tamamlandıktan sonra onaylanan tutar Sky Bozum bakiyenize veya kayıtlı IBAN’ınıza aktarılır.</p></header>
    <div className="member-operation-trust"><article><b>01</b><div><strong>Şifreli teslim</strong><span>Kodlar açık metin olarak saklanmaz.</span></div></article><article><b>02</b><div><strong>Tekil kod kontrolü</strong><span>Aynı kod ikinci kez talep açılamaz.</span></div></article><article><b>03</b><div><strong>Kayıtlı ödeme</strong><span>Bakiye veya IBAN hareketi işlemle eşleşir.</span></div></article></div>
    <div className="member-stats"><article><span>Aktif işlemler</span><strong>{active}</strong><small>Kontrol veya ödeme aşamasında</small></article><article><span>Tamamlanan</span><strong>{completed}</strong><small>Ödemesi sonuçlanan kayıt</small></article><article><span>Ödeme hedefi</span><strong>{bankInfo?.iban ? '2 seçenek' : 'Bakiye'}</strong><small>{bankInfo?.iban ? 'Bakiye veya kayıtlı IBAN' : 'IBAN ekleyerek genişletebilirsiniz'}</small></article></div>
    <div className="member-operation-actions"><button className="member-primary-button" onClick={openCodeSale}>Razer Gold kodu gönder →</button><button className="member-secondary-button" onClick={openStandardRequest}>Diğer bozum talebi</button><Link href="/hesabim/cuzdan">Cüzdanımı görüntüle</Link></div>
    {notice && <p className="member-notice" role="status">{notice}</p>}
    <div className="member-operation-list">{operations.length ? operations.map((operation) => {
      const step = statusStep[operation.status];
      return <article key={operation.id} className={operation.operationType === 'code_sale' ? 'is-code-sale' : ''}>
        <div className="member-operation-top"><div><span>{operation.operationType === 'code_sale' ? 'RAZER GOLD KOD SATIŞI' : operation.service}</span><h2>{operation.operationType === 'code_sale' ? `${operation.codeCount} × ${formatCodeValue(operation.currency, operation.codeValue)}` : `${operation.amount.toLocaleString('tr-TR')} TL talep`}</h2></div><b className={`member-operation-status status-${operation.status}`}>{labels[operation.status]}</b></div>
        {operation.operationType === 'code_sale' ? <><div className="member-operation-details"><span><small>Toplam kod değeri</small><strong>{formatCodeValue(operation.currency, operation.amount)}</strong></span><span><small>Ödeme yöntemi</small><strong>{payoutMethodLabel(operation.payoutMethod)}</strong></span><span><small>Onaylanan ödeme</small><strong>{operation.payout > 0 ? `${operation.payout.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL` : 'Kontrol sonrası'}</strong></span><span><small>İşlem no</small><strong>{operation.id.slice(0, 10).toUpperCase()}</strong></span></div>{operation.reviewState !== 'pending' ? <div className="member-code-review-result"><span><b>{operation.approvedCodeCount}</b> kod kabul edildi</span><span><b>{operation.rejectedCodeCount}</b> kod kabul edilmedi</span><small>Ödeme yalnız geçerli bulunan kodlar için hesaplanır.</small></div> : null}<div className="member-operation-progress" aria-label="İşlem ilerlemesi">{steps.map((label, index) => <span key={label} className={step >= index ? 'is-done' : ''}><i>{step > index ? '✓' : index + 1}</i><b>{label}</b></span>)}</div>{operation.status === 'completed' && operation.payoutReference ? <p className="member-operation-reference">Ödeme referansı: <strong>{operation.payoutReference}</strong></p> : null}</> : null}
        <div className="member-operation-meta"><span>{operation.payout > 0 ? `Net ödeme: ${operation.payout.toLocaleString('tr-TR')} TL` : 'Net ödeme kod kontrolünden sonra kesinleşir'}</span><time>{operation.updatedAt?.toLocaleString('tr-TR') || operation.createdAt?.toLocaleString('tr-TR') || 'Yeni'}</time></div>{operation.note && <p>{operation.note}</p>}
      </article>;
    }) : <div className="member-empty-state"><h2>Henüz kod veya bozum talebiniz yok.</h2><p>Kullanılmamış Razer Gold kodunuzu güvenli forma girerek ilk kontrol kaydını başlatabilirsiniz.</p><button onClick={openCodeSale}>İlk kodu gönder</button></div>}</div>
  </section></div>
  {showForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal member-request-modal member-code-sale-modal" role="dialog" aria-modal="true" aria-labelledby="member-request-title"><button className="admin-close" onClick={() => setShowForm(false)} disabled={submitting} aria-label="Pencereyi kapat">×</button>{formMode === 'code_sale' ? <>
    <span>ŞİFRELİ KOD KASASI</span><h2 id="member-request-title">Razer Gold kodu gönder</h2><p className="member-code-sale-intro">Kodlarınız güvenli sunucuda şifrelenerek saklanır. Kontrol tamamlanmadan ödeme sözü verilmez.</p>
    <form onSubmit={(event) => void submitCodeSale(event)}>
      <div className="member-form-pair"><label>Para birimi<select value={currency} onChange={(event) => { const next = event.target.value as RazerCodeCurrency; setCurrency(next); setCodeValue(razerCodeValues[next][0]); }} disabled={submitting}><option value="TRY">Razer Gold TL</option><option value="USD">Razer Gold USD</option></select></label><label>Her kodun değeri<select value={codeValue} onChange={(event) => setCodeValue(Number(event.target.value))} disabled={submitting}>{razerCodeValues[currency].map((value) => <option key={value} value={value}>{formatCodeValue(currency, value)}</option>)}</select></label></div>
      <label>Kullanılmamış kodlar<textarea value={codes} onChange={(event) => setCodes(event.target.value)} rows={6} maxLength={4800} required spellCheck={false} placeholder={'Her satıra yalnız bir tam PIN yazın\nXXXX-XXXX-XXXX\nYYYY-YYYY-YYYY'} disabled={submitting} /></label><small className="member-code-hint">En fazla 20 kod. Seri numarası değil, yüklemede kullanılan tam PIN girilmelidir.</small>
      <div className="member-code-sale-summary"><span><small>Girilen satır</small><strong>{codes.split(/\r?\n/).filter((line) => line.trim()).length}</strong></span><span><small>Seçilen değer</small><strong>{formatCodeValue(currency, codeValue)}</strong></span><span><small>Toplam nominal değer</small><strong>{formatCodeValue(currency, codeValue * codes.split(/\r?\n/).filter((line) => line.trim()).length)}</strong></span></div>
      <fieldset className="member-payout-choice"><legend>Ödeme nereye yapılsın?</legend><label className={payoutMethod === 'balance' ? 'is-selected' : ''}><input type="radio" name="payout" checked={payoutMethod === 'balance'} onChange={() => setPayoutMethod('balance')} /><span><strong>Sky Bozum bakiyesi</strong><small>Onaylanınca hesabınıza otomatik eklenir; ürün alışverişinde kullanabilirsiniz.</small></span></label><label className={payoutMethod === 'iban' ? 'is-selected' : ''}><input type="radio" name="payout" checked={payoutMethod === 'iban'} onChange={() => setPayoutMethod('iban')} /><span><strong>Kayıtlı IBAN</strong><small>{bankInfo?.iban ? `${bankInfo.bankName} · ${maskIban(bankInfo.iban)}` : 'Önce banka bilgilerinizi kaydetmeniz gerekir.'}</small></span></label>{payoutMethod === 'iban' && !bankInfo?.iban ? <Link href="/hesabim/banka-bilgileri">Banka bilgilerini ekle →</Link> : null}</fieldset>
      <label>İşlem notu<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} maxLength={500} placeholder="Kodun kaynağı veya kontrol sırasında bilinmesi gereken kısa bilgi" disabled={submitting} /></label>
      <label className="member-code-confirm"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>Kodların bana ait, kullanılmamış ve seçtiğim para birimi/değerde olduğunu onaylıyorum.</span></label>
      <div className="member-code-security"><strong>Göndermeden önce</strong><span>Kod başka yerde paylaşılmışsa talep açmayın. Hesap şifresi, SMS kodu veya banka parolası bu formda istenmez.</span></div>
      <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'Kodlar şifreleniyor…' : 'Kodları güvenli kontrole gönder →'}</button>
    </form></> : <><span>YENİ TALEP</span><h2 id="member-request-title">Diğer bozum talebi oluştur</h2><form onSubmit={(event) => void submitStandard(event)}><label>Ad soyad<input value={memberName} onChange={(event) => setMemberName(event.target.value)} required disabled={submitting} /></label><label>İletişim bilgisi<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Telefon veya e-posta" required disabled={submitting} /></label><label>Hizmet<select value={service} onChange={(event) => setService(event.target.value)} disabled={submitting}>{rateItems.map((item) => <option value={item.serviceSlug} key={item.id}>{item.name}</option>)}</select></label><label>Bakiye / ürün tutarı<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="1.000" required disabled={submitting} /></label><label>Notunuz<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} disabled={submitting} /></label><button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'Gönderiliyor…' : 'Talebi gönder →'}</button></form></>}
  </section></div>}
  </main>;
}
