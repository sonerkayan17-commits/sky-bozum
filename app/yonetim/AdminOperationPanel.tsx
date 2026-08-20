'use client';

import { addDoc, collection, doc, getDoc, onSnapshot, runTransaction, serverTimestamp, updateDoc, type Firestore } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { formatCodeValue, payoutMethodLabel, type CodeSalePayoutMethod, type RazerCodeCurrency } from '../lib/codeSales';
import { getFirebaseClient } from '../lib/firebase';
import { parsePriceMinor } from '../lib/store';
import { rateItems } from '../lib/rates';
import './admin-code-sales.css';

type OperationStatus = 'new' | 'awaiting_product' | 'checking' | 'awaiting_payment' | 'completed' | 'cancelled';
type OperationPriority = 'normal' | 'high' | 'urgent';
type CodeReviewStatus = 'approved' | 'rejected';
type CodeReview = { codeHash: string; status: CodeReviewStatus; reason: string };
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
  operationType: 'standard' | 'code_sale';
  currency: RazerCodeCurrency;
  codeValue: number;
  codeCount: number;
  payoutMethod: CodeSalePayoutMethod;
  payoutState: string;
  payoutReference: string;
  codeHashes: string[];
  codeReviews: CodeReview[];
  approvedCodeCount: number;
  rejectedCodeCount: number;
  reviewState: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};
type OperationNote = { id: string; operationId: string; type: 'note' | 'status' | 'system'; body: string; createdAt: Date | null };
type BankInfo = { accountHolder: string; bankName: string; iban: string };

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
  const [revealedCodes, setRevealedCodes] = useState<Record<string, string[]>>({});
  const [bankDetails, setBankDetails] = useState<Record<string, BankInfo | null>>({});
  const [payoutDrafts, setPayoutDrafts] = useState<Record<string, string>>({});
  const [referenceDrafts, setReferenceDrafts] = useState<Record<string, string>>({});
  const [rejectionReasonDrafts, setRejectionReasonDrafts] = useState<Record<string, string>>({});
  const [paymentSavingId, setPaymentSavingId] = useState<string | null>(null);
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
          operationType: data.operationType === 'code_sale' ? 'code_sale' : 'standard',
          currency: data.currency === 'USD' ? 'USD' : 'TRY',
          codeValue: Number(data.codeValue) || 0,
          codeCount: Math.max(0, Math.trunc(Number(data.codeCount) || 0)),
          payoutMethod: data.payoutMethod === 'iban' ? 'iban' : 'balance',
          payoutState: String(data.payoutState || 'pending'),
          payoutReference: String(data.payoutReference || ''),
          codeHashes: Array.isArray(data.codeHashes) ? data.codeHashes.map(String) : [],
          codeReviews: Array.isArray(data.codeReviews) ? data.codeReviews.flatMap((item: unknown) => {
            if (!item || typeof item !== 'object') return [];
            const review = item as Record<string, unknown>;
            if (review.status !== 'approved' && review.status !== 'rejected') return [];
            return [{ codeHash: String(review.codeHash || ''), status: review.status, reason: String(review.reason || '') } as CodeReview];
          }) : [],
          approvedCodeCount: Math.max(0, Math.trunc(Number(data.approvedCodeCount) || 0)),
          rejectedCodeCount: Math.max(0, Math.trunc(Number(data.rejectedCodeCount) || 0)),
          reviewState: String(data.reviewState || 'pending'),
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
        } satisfies Operation;
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

  useEffect(() => {
    const closeVaults = () => { if (document.visibilityState === 'hidden') setRevealedCodes({}); };
    document.addEventListener('visibilitychange', closeVaults);
    return () => document.removeEventListener('visibilitychange', closeVaults);
  }, []);

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

  async function addTimelineEntry(
    operationId: string,
    type: OperationNote['type'],
    body: string,
    memberId = '',
    publicBody = '',
  ) {
    if (!db) return;
    await addDoc(collection(db, 'operationNotes'), { operationId, type, body: body.slice(0, 600), actorId, createdAt: serverTimestamp() });
    if (memberId && publicBody) {
      await addDoc(collection(db, 'operationEvents'), {
        operationId,
        memberId,
        type: type === 'status' ? 'status' : 'system',
        body: publicBody.slice(0, 300),
        createdAt: serverTimestamp(),
      });
    }
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
    if (operation.operationType === 'code_sale' && (status === 'completed' || status === 'awaiting_payment' || operation.status === 'completed')) {
      setNotice('Kod satışında ödeme onayı ve tamamlama yalnız güvenli ödeme bölümünden yapılabilir. Tamamlanmış ödeme yeniden açılamaz.');
      return;
    }
    setSavingId(operation.id);
    try {
      await updateDoc(doc(db, 'operations', operation.id), { status, updatedBy: actorId, updatedAt: serverTimestamp() });
      await addTimelineEntry(
        operation.id,
        'status',
        `Durum “${statusLabels[status]}” olarak güncellendi.`,
        operation.memberId,
        `İşleminiz “${statusLabels[status]}” aşamasına geçti.`,
      );
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

  async function toggleOperation(operation: Operation) {
    const nextOpen = openOperationId !== operation.id;
    setOpenOperationId(nextOpen ? operation.id : null);
    if (!nextOpen || operation.operationType !== 'code_sale' || !operation.memberId || bankDetails[operation.id] !== undefined || !db) return;
    try {
      const snapshot = await getDoc(doc(db, 'memberPrivate', operation.memberId));
      const data = snapshot.data();
      setBankDetails((current) => ({ ...current, [operation.id]: data ? { accountHolder: String(data.accountHolder || ''), bankName: String(data.bankName || ''), iban: String(data.iban || '') } : null }));
    } catch {
      setBankDetails((current) => ({ ...current, [operation.id]: null }));
    }
  }

  async function revealOperationCodes(operation: Operation) {
    if (revealedCodes[operation.id] || paymentSavingId) return;
    const authUser = getFirebaseClient().auth?.currentUser;
    if (!authUser) { setNotice('Yönetici oturumu doğrulanamadı.'); return; }
    setPaymentSavingId(operation.id);
    try {
      const response = await fetch('/api/admin/code-sales/reveal', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await authUser.getIdToken()}` }, body: JSON.stringify({ operationId: operation.id }) });
      const payload = await response.json() as { codes?: string[]; error?: string };
      if (!response.ok || !payload.codes?.length) throw new Error(payload.error || 'Kodlar açılamadı.');
      setRevealedCodes((current) => ({ ...current, [operation.id]: payload.codes || [] }));
      await addTimelineEntry(operation.id, 'system', `${payload.codes.length} şifreli kod yönetici kontrolü için açıldı.`);
      if (db) await addDoc(collection(db, 'contentAudit'), { action: 'code-sale:revealed', articleSlug: operation.id, actorId, createdAt: serverTimestamp() }).catch(() => undefined);
      if (operation.status === 'new') await changeStatus(operation, 'checking');
      setNotice(`${payload.codes.length} kod yalnız bu yönetici oturumu için açıldı.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Kodlar açılamadı.'); }
    finally { setPaymentSavingId(null); }
  }

  async function approvePayout(operation: Operation) {
    if (!db || paymentSavingId) return;
    if (operation.codeReviews.length !== operation.codeCount) { setNotice('Ödeme onayından önce tüm kodları tek tek inceleyin.'); return; }
    if (operation.approvedCodeCount < 1) { setNotice('Ödeme için en az bir kodun geçerli olarak onaylanması gerekir.'); return; }
    const priceMinor = parsePriceMinor(payoutDrafts[operation.id] || operation.payout);
    if (!priceMinor) { setNotice('Onaylanan ödeme tutarını TL olarak girin.'); return; }
    const payout = priceMinor / 100;
    const acceptedFaceValue = operation.codeValue * operation.approvedCodeCount;
    if (operation.currency === 'TRY' && payout > acceptedFaceValue) { setNotice('TL ödeme tutarı yalnız geçerli bulunan kodların toplam değerini aşamaz.'); return; }
    setPaymentSavingId(operation.id);
    try {
      await updateDoc(doc(db, 'operations', operation.id), { payout, status: 'awaiting_payment', payoutState: 'approved', updatedBy: actorId, updatedAt: serverTimestamp() });
      await addTimelineEntry(
        operation.id,
        'status',
        `${payout.toLocaleString('tr-TR')} TL net ödeme onaylandı; hedef: ${payoutMethodLabel(operation.payoutMethod)}.`,
        operation.memberId,
        `${payout.toLocaleString('tr-TR')} TL net ödeme onaylandı. Ödeme hedefi: ${payoutMethodLabel(operation.payoutMethod)}.`,
      );
      await notifyMember(operation, `Razer Gold kod kontrolünüz tamamlandı. ${operation.approvedCodeCount} kod kabul edildi ve ${payout.toLocaleString('tr-TR')} TL ödeme onaylandı.`).catch(() => undefined);
      setNotice('Net ödeme onaylandı ve müşterinin ekranına yansıtıldı.');
    } catch { setNotice('Ödeme tutarı onaylanamadı.'); }
    finally { setPaymentSavingId(null); }
  }

  async function completeBalancePayout(operation: Operation) {
    if (!db || paymentSavingId || operation.payoutMethod !== 'balance') return;
    if (operation.status !== 'awaiting_payment' || operation.payoutState !== 'approved' || operation.payout <= 0 || !operation.memberId) { setNotice('Önce kod incelemesini ve net ödeme onayını tamamlayın.'); return; }
    const operationRef = doc(db, 'operations', operation.id);
    const memberRef = doc(db, 'members', operation.memberId);
    const ledgerRef = doc(db, 'memberLedger', `code-sale-${operation.id}`);
    setPaymentSavingId(operation.id);
    try {
      await runTransaction(db, async (transaction) => {
        const [operationSnapshot, memberSnapshot, ledgerSnapshot] = await Promise.all([transaction.get(operationRef), transaction.get(memberRef), transaction.get(ledgerRef)]);
        if (!operationSnapshot.exists() || !memberSnapshot.exists()) throw new Error('İşlem veya üye kaydı bulunamadı.');
        const currentOperation = operationSnapshot.data();
        if (currentOperation.status === 'completed' || ledgerSnapshot.exists()) throw new Error('Bu ödeme daha önce tamamlanmış.');
        if (currentOperation.status !== 'awaiting_payment' || currentOperation.payoutState !== 'approved') throw new Error('Ödeme henüz yönetici onayında değil.');
        if (currentOperation.payoutMethod !== 'balance') throw new Error('Ödeme hedefi bakiye değil.');
        const persistedPayoutMinor = Math.round((Number(currentOperation.payout) || 0) * 100);
        if (persistedPayoutMinor <= 0) throw new Error('Onaylanmış ödeme tutarı bulunamadı.');
        const payout = persistedPayoutMinor / 100;
        const currentMinor = Math.round((Number(memberSnapshot.data().balance) || 0) * 100);
        const nextBalance = (currentMinor + persistedPayoutMinor) / 100;
        const reference = `SKY-BAL-${operation.id.slice(0, 8).toUpperCase()}`;
        const timestamp = serverTimestamp();
        transaction.update(memberRef, { balance: nextBalance, updatedAt: timestamp });
        transaction.update(operationRef, { payout, status: 'completed', payoutState: 'paid', payoutReference: reference, paidAt: timestamp, updatedBy: actorId, updatedAt: timestamp });
        transaction.set(ledgerRef, { memberId: operation.memberId, kind: 'balance', amount: payout, balanceAfter: nextBalance, note: `Razer Gold kod satışı ödemesi · ${operation.id.slice(0, 10).toUpperCase()}`, operationId: operation.id, performedBy: actorId, createdAt: timestamp });
      });
      await addTimelineEntry(
        operation.id,
        'status',
        `${operation.payout.toLocaleString('tr-TR')} TL üye bakiyesine aktarıldı ve işlem tamamlandı.`,
        operation.memberId,
        `${operation.payout.toLocaleString('tr-TR')} TL Sky Bozum bakiyenize aktarıldı. İşlem tamamlandı.`,
      );
      await notifyMember(operation, `${operation.payout.toLocaleString('tr-TR')} TL Razer Gold kod satış ödemeniz Sky Bozum cüzdanınıza aktarıldı.`).catch(() => undefined);
      setNotice('Ödeme üye bakiyesine atomik olarak aktarıldı.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Bakiye ödemesi tamamlanamadı.'); }
    finally { setPaymentSavingId(null); }
  }

  async function completeIbanPayout(operation: Operation) {
    if (!db || paymentSavingId || operation.payoutMethod !== 'iban') return;
    const reference = (referenceDrafts[operation.id] || '').trim();
    if (operation.status !== 'awaiting_payment' || operation.payoutState !== 'approved' || operation.payout <= 0) { setNotice('Önce kod incelemesini ve net ödeme onayını tamamlayın.'); return; }
    if (reference.length < 4) { setNotice('Banka hareketi veya dekont referansını girin.'); return; }
    setPaymentSavingId(operation.id);
    try {
      await updateDoc(doc(db, 'operations', operation.id), { status: 'completed', payoutState: 'paid', payoutReference: reference.slice(0, 120), paidAt: serverTimestamp(), updatedBy: actorId, updatedAt: serverTimestamp() });
      await addTimelineEntry(
        operation.id,
        'status',
        `${operation.payout.toLocaleString('tr-TR')} TL kayıtlı IBAN'a ödendi. Referans: ${reference.slice(0, 120)}`,
        operation.memberId,
        `${operation.payout.toLocaleString('tr-TR')} TL kayıtlı IBAN'ınıza gönderildi. Referans: ${reference.slice(0, 120)}`,
      );
      await notifyMember(operation, `${operation.payout.toLocaleString('tr-TR')} TL Razer Gold kod satış ödemeniz kayıtlı IBAN'ınıza gönderildi. Referans: ${reference.slice(0, 120)}`).catch(() => undefined);
      setNotice('IBAN ödemesi referansla birlikte tamamlandı.');
    } catch { setNotice('IBAN ödemesi tamamlandı olarak kaydedilemedi.'); }
    finally { setPaymentSavingId(null); }
  }

  async function notifyMember(operation: Operation, text: string) {
    if (!db || !operation.memberId) return;
    await addDoc(collection(db, 'notifications'), { senderId: actorId, receiverId: operation.memberId, type: 'operation_status', text: text.slice(0, 180), href: '/hesabim/talepler', read: false, createdAt: serverTimestamp() });
  }

  async function reviewCode(operation: Operation, index: number, status: CodeReviewStatus) {
    if (!db || paymentSavingId || operation.status === 'awaiting_payment' || operation.status === 'completed' || !revealedCodes[operation.id]?.[index]) return;
    const codeHash = operation.codeHashes[index];
    if (!codeHash) { setNotice('Kod kimliği bulunamadı; işlem kaydını kontrol edin.'); return; }
    const reasonKey = `${operation.id}:${index}`;
    const reason = status === 'rejected' ? (rejectionReasonDrafts[reasonKey] || 'Geçersiz veya kullanılmış kod') : '';
    const byHash = new Map(operation.codeReviews.map((item) => [item.codeHash, item]));
    byHash.set(codeHash, { codeHash, status, reason });
    const codeReviews = operation.codeHashes.flatMap((hash) => byHash.get(hash) || []);
    const approvedCodeCount = codeReviews.filter((item) => item.status === 'approved').length;
    const rejectedCodeCount = codeReviews.filter((item) => item.status === 'rejected').length;
    const reviewState = codeReviews.length === operation.codeCount ? 'complete' : 'in_progress';
    setPaymentSavingId(operation.id);
    try {
      await updateDoc(doc(db, 'operations', operation.id), { codeReviews, approvedCodeCount, rejectedCodeCount, reviewState, status: 'checking', updatedBy: actorId, updatedAt: serverTimestamp() });
      if (reviewState === 'complete') {
        await addTimelineEntry(
          operation.id,
          'status',
          `Kod incelemesi tamamlandı: ${approvedCodeCount} geçerli, ${rejectedCodeCount} geçersiz.`,
          operation.memberId,
          `Kod kontrolü tamamlandı: ${approvedCodeCount} kod kabul edildi, ${rejectedCodeCount} kod kabul edilmedi.`,
        );
      }
      setNotice(`Kod ${index + 1} “${status === 'approved' ? 'geçerli' : 'geçersiz'}” olarak kaydedildi.`);
    } catch { setNotice('Kod inceleme sonucu kaydedilemedi.'); }
    finally { setPaymentSavingId(null); }
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
    <div className="admin-section-head"><div><span>KOD SATIŞI VE İŞLEM MERKEZİ</span><h2>Kod kontrolü ve ödemeleri yönetin</h2></div><p>Şifreli Razer Gold kodlarını tek tek doğrulayın; kabul edilen kodlar için net tutarı onaylayıp cüzdan veya IBAN ödemesini referansla tamamlayın.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <div className="admin-metrics admin-operation-metrics"><article><strong>{metrics.newRequests}</strong><span>yeni talep</span></article><article><strong>{metrics.active}</strong><span>aktif işlem</span></article><article><strong>{metrics.urgent}</strong><span>acil takip</span></article><article><strong>{metrics.completed}</strong><span>tamamlanan</span></article></div>
    <div className="admin-filterbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Müşteri, iletişim veya hizmet ara" aria-label="İşlemlerde ara" /><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">Tüm işlemler</option>{statuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select><span>{visible.length} kayıt</span><button className="admin-secondary compact" onClick={exportOperations}>CSV indir</button><button className="admin-primary compact" onClick={() => setShowForm(true)}>Yeni işlem →</button></div>
    <div className="admin-table admin-operation-table">{visible.length ? visible.map((operation) => {
      const notes = operationNotes.filter((item) => item.operationId === operation.id);
      const isOpen = openOperationId === operation.id;
      return <article key={operation.id} className={operation.priority === 'urgent' ? 'is-urgent' : ''}>
        <div>{operation.memberId ? <Link href={`/uyeler/${operation.memberId}`} style={{ color: 'inherit', textDecoration: 'none' }}><strong>{operation.customer}</strong></Link> : <strong>{operation.customer}</strong>}<span>{operation.contact} · {operation.service}</span><small>{operation.operationType === 'code_sale' ? `Şifreli kod satışı · ${operation.codeCount} kod · ${payoutMethodLabel(operation.payoutMethod)}` : operation.memberId ? 'Üye talebi · profile git' : 'Yönetici kaydı'}</small></div>
        <span className={`admin-status ${operation.status === 'completed' ? 'status-approved' : operation.status === 'cancelled' ? 'status-rejected' : 'status-pending'}`}>{statusLabels[operation.status]}</span>
        <b>{operation.operationType === 'code_sale' ? formatCodeValue(operation.currency, operation.amount) : `${operation.amount.toLocaleString('tr-TR')} TL`} → {operation.payout.toLocaleString('tr-TR')} TL</b>
        <small>{operation.updatedAt?.toLocaleDateString('tr-TR') || operation.createdAt?.toLocaleDateString('tr-TR') || 'Tarih yok'}</small>
        <div className="admin-operation-controls"><select aria-label={`${operation.customer} işlem önceliği`} value={operation.priority} disabled={savingId === operation.id} onChange={(event) => void changePriority(operation, event.target.value as OperationPriority)}>{priorities.map((priority) => <option value={priority} key={priority}>{priorityLabels[priority]}</option>)}</select><select aria-label={`${operation.customer} işlem durumu`} value={operation.status} disabled={savingId === operation.id || paymentSavingId === operation.id || (operation.operationType === 'code_sale' && operation.status === 'completed')} onChange={(event) => void changeStatus(operation, event.target.value as OperationStatus)}>{statuses.filter((status) => operation.operationType !== 'code_sale' || !['awaiting_payment', 'completed'].includes(status) || operation.status === status).map((status) => <option value={status} key={status} disabled={operation.operationType === 'code_sale' && ['awaiting_payment', 'completed'].includes(status)}>{statusLabels[status]}</option>)}</select><button type="button" className="admin-secondary compact" onClick={() => void toggleOperation(operation)}>{isOpen ? 'Detayı kapat' : operation.operationType === 'code_sale' ? 'Kodu ve ödemeyi incele' : `İç notlar (${notes.length})`}</button></div>
        {operation.note && <p className="admin-operation-note">İlk not: {operation.note}</p>}
        {isOpen && operation.operationType === 'code_sale' && <section className="admin-code-sale-review" aria-label={`${operation.customer} kod ve ödeme incelemesi`}>
          <header><div><span>GÜVENLİ KOD İNCELEMESİ</span><h3>{operation.codeCount} × {formatCodeValue(operation.currency, operation.codeValue)}</h3></div><b>{payoutMethodLabel(operation.payoutMethod)}</b></header>
          <div className="admin-code-sale-facts"><span><small>Toplam değer</small><strong>{formatCodeValue(operation.currency, operation.amount)}</strong></span><span><small>İşlem numarası</small><strong>{operation.id.toUpperCase()}</strong></span><span><small>Ödeme durumu</small><strong>{operation.payoutState === 'paid' ? 'Ödendi' : operation.payout > 0 ? 'Tutar onaylandı' : 'Kontrol bekliyor'}</strong></span></div>
          <div className="admin-code-vault"><div><strong>Kod kasası</strong><span>Kodlar varsayılan olarak kapalıdır; her kodu doğrulayıp sonucu ayrı kaydedin.</span></div>{revealedCodes[operation.id] ? <div className="admin-revealed-codes">{revealedCodes[operation.id].map((code, index) => { const review = operation.codeReviews.find((item) => item.codeHash === operation.codeHashes[index]); const reasonKey = `${operation.id}:${index}`; return <div key={`${operation.id}-${index}`} className={review ? `is-${review.status}` : ''}><span className="admin-code-index">#{index + 1}</span><code>{code}</code><button type="button" onClick={() => void navigator.clipboard.writeText(code)}>Kopyala</button><div className="admin-code-review-actions"><button type="button" className="is-approve" disabled={paymentSavingId === operation.id || operation.status === 'completed'} onClick={() => void reviewCode(operation, index, 'approved')}>{review?.status === 'approved' ? '✓ Geçerli' : 'Geçerli'}</button><select aria-label={`Kod ${index + 1} red nedeni`} value={rejectionReasonDrafts[reasonKey] || review?.reason || 'Geçersiz veya kullanılmış kod'} onChange={(event) => setRejectionReasonDrafts((current) => ({ ...current, [reasonKey]: event.target.value }))} disabled={operation.status === 'completed'}><option>Geçersiz veya kullanılmış kod</option><option>Değer veya para birimi uyuşmuyor</option><option>Bölge uyumsuz</option><option>Eksik ya da hatalı PIN</option><option>Diğer</option></select><button type="button" className="is-reject" disabled={paymentSavingId === operation.id || operation.status === 'completed'} onClick={() => void reviewCode(operation, index, 'rejected')}>{review?.status === 'rejected' ? '× Geçersiz' : 'Geçersiz'}</button></div></div>; })}</div> : <button className="admin-primary compact" type="button" disabled={paymentSavingId === operation.id} onClick={() => void revealOperationCodes(operation)}>{paymentSavingId === operation.id ? 'Güvenli kasa açılıyor…' : 'Kodları güvenli aç'}</button>}</div>
          <div className="admin-code-review-summary"><span><b>{operation.approvedCodeCount}</b> geçerli</span><span><b>{operation.rejectedCodeCount}</b> geçersiz</span><span><b>{Math.max(0, operation.codeCount - operation.codeReviews.length)}</b> incelenmedi</span></div>
          <div className="admin-payout-panel"><label>Onaylanan net ödeme (TL)<input inputMode="decimal" value={payoutDrafts[operation.id] ?? (operation.payout || '')} onChange={(event) => setPayoutDrafts((current) => ({ ...current, [operation.id]: event.target.value }))} placeholder="Örn. 425,00" disabled={operation.status === 'completed'} /></label><button type="button" className="admin-secondary compact" disabled={paymentSavingId === operation.id || operation.status === 'completed'} onClick={() => void approvePayout(operation)}>Tutarı onayla</button></div>
          {operation.payoutMethod === 'balance' ? <div className="admin-payout-destination"><div><span>SKY BOZUM CÜZDANI</span><strong>Bakiyeye otomatik ve tek kayıtla aktar</strong><small>Üye bakiyesi, işlem kaydı ve hesap defteri aynı anda güncellenir.</small></div><button type="button" className="admin-primary" disabled={paymentSavingId === operation.id || operation.status === 'completed'} onClick={() => void completeBalancePayout(operation)}>{operation.status === 'completed' ? 'Bakiye ödemesi tamamlandı' : paymentSavingId === operation.id ? 'Aktarılıyor…' : 'Bakiyeye aktar ve tamamla'}</button></div> : <div className="admin-payout-destination is-iban"><div><span>KAYITLI IBAN</span>{bankDetails[operation.id] ? <><strong>{bankDetails[operation.id]?.accountHolder}</strong><small>{bankDetails[operation.id]?.bankName} · {bankDetails[operation.id]?.iban}</small></> : <><strong>IBAN bilgisi bulunamadı</strong><small>Müşteriden banka bilgilerini hesap alanına kaydetmesini isteyin.</small></>}</div><label>Transfer / dekont referansı<input value={referenceDrafts[operation.id] || ''} onChange={(event) => setReferenceDrafts((current) => ({ ...current, [operation.id]: event.target.value }))} placeholder="Banka işlem referansı" disabled={operation.status === 'completed'} /></label><button type="button" className="admin-primary" disabled={paymentSavingId === operation.id || operation.status === 'completed' || !bankDetails[operation.id]?.iban} onClick={() => void completeIbanPayout(operation)}>{operation.status === 'completed' ? 'IBAN ödemesi tamamlandı' : 'Transferi tamamlandı işaretle'}</button></div>}
          {operation.payoutReference ? <p className="admin-payment-reference">Ödeme referansı: <strong>{operation.payoutReference}</strong></p> : null}
        </section>}
        {isOpen && <section className="admin-operation-history" aria-label={`${operation.customer} işlem geçmişi`}><header><div><span>EKİP İÇİ</span><h3>İşlem geçmişi</h3></div><small>Bu notlar müşteriye gösterilmez.</small></header><div className="admin-operation-timeline">{notes.length ? notes.map((item) => <div key={item.id}><b>{noteTypeLabels[item.type]}</b><p>{item.body}</p><small>{item.createdAt ? item.createdAt.toLocaleString('tr-TR') : 'Kaydediliyor…'}</small></div>) : <p>Bu işlem için henüz iç not yok.</p>}</div><form onSubmit={(event) => void addInternalNote(event, operation)}><label htmlFor={`operation-note-${operation.id}`}>Ekip notu</label><textarea id={`operation-note-${operation.id}`} value={noteDrafts[operation.id] || ''} onChange={(event) => setNoteDrafts((current) => ({ ...current, [operation.id]: event.target.value }))} maxLength={600} placeholder="Müşteriye görünmez; sadece ekip için takip notu yazın." rows={3} /><button className="admin-primary compact" type="submit" disabled={noteSavingId === operation.id}>{noteSavingId === operation.id ? 'Kaydediliyor…' : 'Notu ekle'}</button></form></section>}
      </article>;
    }) : <p className="admin-empty">Henüz işlem kaydı bulunmuyor.</p>}</div>
    {showForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="operation-modal-title"><button className="admin-close" onClick={() => setShowForm(false)} aria-label="Pencereyi kapat">×</button><span>YENİ İŞLEM</span><h2 id="operation-modal-title">Bozum talebi oluştur</h2><form onSubmit={(event) => void createOperation(event)}><label>Müşteri adı<input value={form.customer} onChange={(event) => setForm({ ...form, customer: event.target.value })} required /></label><label>İletişim bilgisi<input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} placeholder="Telefon veya e-posta" required /></label><label>Hizmet<select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })}>{rateItems.map((item) => <option value={item.serviceSlug} key={item.id}>{item.name}</option>)}</select></label><label>Öncelik<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as OperationPriority })}>{priorities.map((priority) => <option value={priority} key={priority}>{priorityLabels[priority]}</option>)}</select></label><label>Alınan bakiye<input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} inputMode="decimal" required /></label><label>Tahmini net ödeme<input value={form.payout} onChange={(event) => setForm({ ...form, payout: event.target.value })} inputMode="decimal" required /></label><label>İlk işlem notu<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows={3} /></label><button className="admin-primary" type="submit">İşlemi kaydet →</button></form></section></div>}
  </section>;
}
