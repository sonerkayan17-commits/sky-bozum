'use client';

import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import './release-readiness.css';

const checklist = [
  { id: 'emailFlowTested', title: 'E-posta akışı test edildi', detail: 'Yeni kayıt ve parola yenileme e-postasını gerçek bir adresle, Gelen ve Spam klasörlerinde kontrol ettim.' },
  { id: 'senderDomainAuthenticated', title: 'Gönderen alan adı doğrulandı', detail: 'E-posta hizmetindeki SPF, DKIM ve DMARC kayıtlarının alan adında doğru olduğunu doğruladım.' },
  { id: 'firestoreBackupChecked', title: 'Veri yedek planı doğrulandı', detail: 'Firestore verisinin dışa aktarım/yedek sorumlusu ve geri dönüş planı belirli.' },
  { id: 'supportFlowTested', title: 'Destek kanalı test edildi', detail: 'Canlı destek/WhatsApp bağlantısı ile bir test talebi gönderip yanıt akışını kontrol ettim.' },
  { id: 'productionSmokeTested', title: 'Canlı site temel testi yapıldı', detail: 'Mobil ve masaüstünde ana sayfa, hesap, işlem talebi, forum ve form akışlarını kontrol ettim.' },
  { id: 'mobileNavigationTested', title: 'Gerçek cihazda mobil menü kontrol edildi', detail: 'Menü, arama, alt sabit menü ve dokunmatik yönlendirmeleri en az bir gerçek telefonda test ettim.' },
  { id: 'codeMoneyFlowTested', title: 'Kod ve para akışı uçtan uca test edildi', detail: 'Test kaydıyla kod inceleme, ödeme onayı, cüzdan/IBAN kaydı ve işlem geçmişinin birbirini doğru güncellediğini kontrol ettim.' },
  { id: 'rateFallbackReviewed', title: 'Oran yedeği ve yayın kaydı gözden geçirildi', detail: 'Yayındaki oranların tarihini, kaynak notunu ve statik yedek için kullanıcıya görünen teyit uyarısını kontrol ettim.' },
  { id: 'appCheckEnforced', title: 'Firebase App Check canlıda doğrulandı', detail: 'Firebase Console içinden App Check sağlayıcısının etkin olduğunu ve ilgili ürünlerde zorlamanın bilinçli olarak yapılandırıldığını kontrol ettim.' },
  { id: 'analyticsAlertsConfigured', title: 'İzleme ve uyarı sorumlusu belirlendi', detail: 'Vercel/Firebase hata ve trafik izleme ekranlarını düzenli kontrol edecek kişi veya bildirim kanalı belirlendi.' },
] as const;

type CheckId = (typeof checklist)[number]['id'];
type Checks = Record<CheckId, boolean>;
type LiveMetric = { id: string; value: number; label: string; href: string; tone: 'attention' | 'neutral' };

const emptyChecks: Checks = {
  emailFlowTested: false,
  senderDomainAuthenticated: false,
  firestoreBackupChecked: false,
  supportFlowTested: false,
  productionSmokeTested: false,
  mobileNavigationTested: false,
  codeMoneyFlowTested: false,
  rateFallbackReviewed: false,
  appCheckEnforced: false,
  analyticsAlertsConfigured: false,
};

function readChecks(value: unknown): Checks {
  if (!value || typeof value !== 'object') return emptyChecks;
  return checklist.reduce((all, item) => ({ ...all, [item.id]: (value as Record<string, unknown>)[item.id] === true }), { ...emptyChecks });
}

export default function ReleaseReadinessPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [checks, setChecks] = useState<Checks>(emptyChecks);
  const [notes, setNotes] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [memberPending, setMemberPending] = useState(0);
  const [commentPending, setCommentPending] = useState(0);
  const [openReports, setOpenReports] = useState(0);
  const [newOperations, setNewOperations] = useState(0);
  const [draftArticles, setDraftArticles] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!db) return;
    const stopReadiness = onSnapshot(doc(db, 'releaseReadiness', 'global'), (snapshot) => {
      const data = snapshot.data();
      const nextNotes = String(data?.notes || '');
      setChecks(readChecks(data?.checks));
      setNotes(nextNotes);
      setDraftNotes(nextNotes);
    });
    const count = (collectionName: string, predicate: (value: Record<string, unknown>) => boolean, setValue: (value: number) => void) => onSnapshot(collection(db, collectionName), (snapshot) => setValue(snapshot.docs.filter((entry) => predicate(entry.data())).length));
    const stopMembers = count('members', (item) => item.status === 'pending', setMemberPending);
    const stopComments = count('comments', (item) => item.status === 'pending', setCommentPending);
    const stopReports = count('contentReports', (item) => item.status === 'open', setOpenReports);
    const stopOperations = count('operations', (item) => item.status === 'new', setNewOperations);
    const stopArticles = count('contentArticles', (item) => item.status === 'draft', setDraftArticles);
    return () => { stopReadiness(); stopMembers(); stopComments(); stopReports(); stopOperations(); stopArticles(); };
  }, [db]);

  const liveMetrics = useMemo<LiveMetric[]>(() => [
    { id: 'members', value: memberPending, label: 'onay bekleyen üye', href: '/yonetim?view=members', tone: memberPending ? 'attention' : 'neutral' },
    { id: 'comments', value: commentPending, label: 'bekleyen yorum', href: '/yonetim?view=moderation', tone: commentPending ? 'attention' : 'neutral' },
    { id: 'reports', value: openReports, label: 'açık içerik raporu', href: '/yonetim?view=forum', tone: openReports ? 'attention' : 'neutral' },
    { id: 'operations', value: newOperations, label: 'yeni işlem talebi', href: '/yonetim?view=operations', tone: newOperations ? 'attention' : 'neutral' },
    { id: 'drafts', value: draftArticles, label: 'yayın kararı bekleyen taslak', href: '/yonetim?view=content', tone: draftArticles ? 'attention' : 'neutral' },
  ], [commentPending, draftArticles, memberPending, newOperations, openReports]);
  const completed = checklist.filter((item) => checks[item.id]).length;

  async function save(nextChecks = checks, nextNotes = draftNotes, message = 'Yayın kontrolü kaydedildi.') {
    if (!db) return;
    setSaving(true);
    setNotice('');
    try {
      const cleanNotes = nextNotes.trim().slice(0, 1000);
      await setDoc(doc(db, 'releaseReadiness', 'global'), { checks: nextChecks, notes: cleanNotes, updatedBy: actorId, updatedAt: serverTimestamp() }, { merge: true });
      await addDoc(collection(db, 'contentAudit'), { action: 'release-readiness:updated', articleSlug: 'global', actorId, createdAt: serverTimestamp() });
      setNotes(cleanNotes);
      setDraftNotes(cleanNotes);
      setNotice(message);
    } catch {
      setNotice('Kontrol listesi kaydedilemedi. Yönetim yetkisini ve bağlantıyı kontrol edin.');
    } finally {
      setSaving(false);
    }
  }

  function toggle(id: CheckId) {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    void save(next, draftNotes, next[id] ? 'Kontrol adımı tamamlandı olarak kaydedildi.' : 'Kontrol adımı yeniden açık olarak kaydedildi.');
  }

  return <section className="admin-section release-readiness">
    <div className="admin-section-head"><div><span>YAYIN KONTROLÜ</span><h2>Canlıya çıkış için tek ekran</h2></div><p>Canlı kuyruklar gerçek Firestore kayıtlarından gelir. Dış servis kontrolleri yalnız sizin doğrulamanızla tamamlanır.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <section className="release-live-status" aria-label="Canlı operasyon durumu">
      <header><div><span>CANLI KUYRUKLAR</span><h3>Yayın öncesi karar bekleyen kayıtlar</h3></div><small>Bu rakamlar otomatik güncellenir.</small></header>
      <div>{liveMetrics.map((metric) => <a className={metric.tone === 'attention' ? 'needs-attention' : ''} href={metric.href} key={metric.id}><strong>{metric.value}</strong><span>{metric.label}</span></a>)}</div>
    </section>
    <section className="release-manual-checks">
      <header><div><span>DOĞRULAMA LİSTESİ</span><h3>{completed}/{checklist.length} adım tamamlandı</h3></div><p>Buradaki işaretler gerçek testin yerini tutmaz; yaptığınız kontrolün kalıcı kaydıdır.</p></header>
      <div>{checklist.map((item) => <label key={item.id}><input type="checkbox" checked={checks[item.id]} disabled={saving} onChange={() => toggle(item.id)} /><span><b>{item.title}</b><small>{item.detail}</small></span></label>)}</div>
    </section>
    <label className="release-notes">Yayın notları ve sorumlular<textarea value={draftNotes} maxLength={1000} rows={4} onChange={(event) => setDraftNotes(event.target.value)} placeholder="Örn. E-posta testi 15 Ağustos'ta yapıldı; yedek sorumlusu ..." /><small>{draftNotes.length}/1000 · Son kaydedilen not: {notes ? 'var' : 'yok'}</small></label>
    <button className="admin-primary" type="button" disabled={saving} onClick={() => void save()}>{saving ? 'Kaydediliyor…' : 'Yayın kontrolünü kaydet →'}</button>
  </section>;
}
