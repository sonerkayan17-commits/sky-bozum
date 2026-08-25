'use client';

import { doc, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { useState } from 'react';
import {
  commerceCaseId,
  commerceCaseKindLabels,
  commerceCaseStatusLabels,
  type CommerceCase,
  type CommerceCaseKind,
  type CommerceCaseTarget,
} from '../../lib/commerceCases';

export default function MemberCommerceCase({
  db,
  memberId,
  targetType,
  targetId,
  allowedKinds,
  existing,
}: {
  db: Firestore;
  memberId: string;
  targetType: CommerceCaseTarget;
  targetId: string;
  allowedKinds: CommerceCaseKind[];
  existing: CommerceCase[];
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<CommerceCaseKind>(allowedKinds[0]);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const activeCase = existing.find((item) => item.targetType === targetType && item.targetId === targetId && !['resolved', 'rejected'].includes(item.status));
  const targetCases = existing.filter((item) => item.targetType === targetType && item.targetId === targetId);
  const availableKinds = allowedKinds.filter((item) => !targetCases.some((entry) => entry.kind === item));
  const closedCase = targetCases.find((item) => ['resolved', 'rejected'].includes(item.status));

  async function submit() {
    const cleanReason = reason.trim();
    if (busy || cleanReason.length < 10) { setNotice('Sorunu en az 10 karakterle açıklayın.'); return; }
    setBusy(true);
    setNotice('');
    try {
      await setDoc(doc(db, 'commerceCases', commerceCaseId(memberId, targetType, targetId, kind)), {
        memberId,
        targetType,
        targetId,
        kind,
        reason: cleanReason.slice(0, 500),
        status: 'open',
        resolution: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setOpen(false);
      setReason('');
      setNotice('İnceleme kaydı oluşturuldu. Durum değişikliklerini bu ekrandan izleyebilirsiniz.');
    } catch {
      setNotice('İnceleme kaydı açılamadı. Aynı konu için daha önce kayıt açılmış olabilir.');
    } finally { setBusy(false); }
  }

  if (activeCase) return <div className="member-commerce-case is-active">
    <div><span>{commerceCaseKindLabels[activeCase.kind]}</span><strong>{commerceCaseStatusLabels[activeCase.status]}</strong></div>
    <p>{activeCase.resolution || 'Ekibimiz işlem ve hareket kayıtlarını inceliyor. Bu kayıt para veya kod akışını otomatik değiştirmez.'}</p>
  </div>;

  if (!availableKinds.length && closedCase) return <div className="member-commerce-case is-closed">
    <div><span>{commerceCaseKindLabels[closedCase.kind]}</span><strong>{commerceCaseStatusLabels[closedCase.status]}</strong></div>
    <p>{closedCase.resolution || 'İnceleme tamamlandı. Yeni bir durum oluştuysa sipariş numarasıyla destek merkezine başvurabilirsiniz.'}</p>
  </div>;

  return <div className="member-commerce-case">
    <button type="button" onClick={() => { setKind(availableKinds[0]); setOpen((value) => !value); }}>{open ? 'Formu kapat' : 'Sorun / iptal incelemesi aç'}</button>
    {open ? <div className="member-commerce-case__form">
      {availableKinds.length > 1 ? <label>Konu<select value={kind} onChange={(event) => setKind(event.target.value as CommerceCaseKind)}>{availableKinds.map((item) => <option key={item} value={item}>{commerceCaseKindLabels[item]}</option>)}</select></label> : null}
      <label>Açıklama<textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={3} placeholder="Ne olduğunu, varsa görünen hata mesajını ve beklentinizi yazın." /></label>
      <small>Talep açmak otomatik iade, iptal veya ikinci ödeme oluşturmaz; yetkili incelemesi gerekir.</small>
      <button type="button" disabled={busy} onClick={() => void submit()}>{busy ? 'Kaydediliyor…' : 'İncelemeye gönder →'}</button>
    </div> : null}
    {notice ? <p role="status">{notice}</p> : null}
  </div>;
}
