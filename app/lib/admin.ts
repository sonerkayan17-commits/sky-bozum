import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  writeBatch,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

export type MemberRole = 'member' | 'editor' | 'publisher' | 'moderator' | 'operator' | 'admin';
export type MemberStatus = 'pending' | 'active' | 'banned';
export type MemberRestrictionKey = 'community' | 'comments' | 'content_sharing' | 'messaging' | 'code_sale' | 'store_purchase' | 'wallet';

export type AdminMember = {
  id: string;
  displayName: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  balance: number;
  points: number;
  permissions: string[];
  restrictions: MemberRestrictionKey[];
  banReason: string;
  bannedBy: string;
  bannedAt: Date | null;
  bannedUntil: Date | null;
  approvedBy: string;
  approvedAt: Date | null;
  createdAt: Date | null;
};

export type AdminComment = {
  id: string;
  author: string;
  service: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | null;
};

export type ContentAuditEvent = {
  id: string;
  action: string;
  articleSlug: string;
  contentKey?: string;
  contentType?: 'text' | 'image';
  targetLabel?: string;
  pagePath?: string;
  actorId: string;
  createdAt: Date | null;
};

export type MemberLedgerEvent = {
  id: string;
  memberId: string;
  kind: 'balance' | 'points';
  amount: number;
  balanceAfter: number;
  note: string;
  performedBy: string;
  createdAt: Date | null;
};

type MemberDocument = Omit<AdminMember, 'id' | 'createdAt' | 'bannedAt' | 'bannedUntil' | 'approvedAt'> & {
  createdAt?: Timestamp;
  bannedAt?: Timestamp;
  bannedUntil?: Timestamp;
  approvedAt?: Timestamp;
};
type CommentDocument = Omit<AdminComment, 'id' | 'createdAt'> & { createdAt?: Timestamp };
type ContentAuditDocument = Omit<ContentAuditEvent, 'id' | 'createdAt'> & { createdAt?: Timestamp };
type MemberLedgerDocument = Omit<MemberLedgerEvent, 'id' | 'createdAt'> & { createdAt?: Timestamp };

function asMember(id: string, value: MemberDocument): AdminMember {
  const bannedUntil = value.bannedUntil?.toDate() ?? null;
  const storedStatus = value.status || 'pending';
  const status = storedStatus === 'banned' && bannedUntil && bannedUntil.getTime() <= Date.now()
    ? 'active'
    : storedStatus;
  return {
    id,
    displayName: value.displayName || 'İsimsiz üye',
    email: value.email || 'E-posta yok',
    role: value.role || 'member',
    status,
    balance: Number(value.balance) || 0,
    points: Number(value.points) || 0,
    permissions: Array.isArray(value.permissions) ? value.permissions : [],
    restrictions: Array.isArray(value.restrictions) ? value.restrictions : [],
    banReason: value.banReason || '',
    bannedBy: value.bannedBy || '',
    bannedAt: value.bannedAt?.toDate() ?? null,
    bannedUntil,
    approvedBy: value.approvedBy || '',
    approvedAt: value.approvedAt?.toDate() ?? null,
    createdAt: value.createdAt?.toDate() ?? null,
  };
}

function asComment(id: string, value: CommentDocument): AdminComment {
  return {
    id,
    author: value.author || 'Ziyaretçi',
    service: value.service || 'Diğer',
    message: value.message || '',
    status: value.status || 'pending',
    createdAt: value.createdAt?.toDate() ?? null,
  };
}

function asContentAuditEvent(id: string, value: ContentAuditDocument): ContentAuditEvent {
  return {
    id,
    action: value.action || 'updated',
    articleSlug: value.articleSlug || value.contentKey || 'unknown',
    contentKey: value.contentKey,
    contentType: value.contentType === 'image' ? 'image' : value.contentType === 'text' ? 'text' : undefined,
    targetLabel: value.targetLabel,
    pagePath: value.pagePath,
    actorId: value.actorId || 'unknown',
    createdAt: value.createdAt?.toDate() ?? null,
  };
}

function asMemberLedgerEvent(id: string, value: MemberLedgerDocument): MemberLedgerEvent {
  return {
    id,
    memberId: value.memberId || 'unknown',
    kind: value.kind === 'points' ? 'points' : 'balance',
    amount: Number(value.amount) || 0,
    balanceAfter: Number(value.balanceAfter) || 0,
    note: value.note || 'Yönetici işlemi',
    performedBy: value.performedBy || 'unknown',
    createdAt: value.createdAt?.toDate() ?? null,
  };
}

export function subscribeToMembers(
  firestore: Firestore,
  onChange: (members: AdminMember[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(query(collection(firestore, 'members'), orderBy('createdAt', 'desc')), (snapshot) => {
    onChange(snapshot.docs.map((entry) => asMember(entry.id, entry.data() as MemberDocument)));
  }, onError);
}

export function subscribeToModerationQueue(
  firestore: Firestore,
  onChange: (comments: AdminComment[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(query(collection(firestore, 'comments'), orderBy('createdAt', 'desc')), (snapshot) => {
    onChange(snapshot.docs.map((entry) => asComment(entry.id, entry.data() as CommentDocument)));
  }, onError);
}

export function subscribeToContentAudit(
  firestore: Firestore,
  onChange: (events: ContentAuditEvent[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(query(collection(firestore, 'contentAudit'), orderBy('createdAt', 'desc')), (snapshot) => {
    onChange(snapshot.docs.slice(0, 18).map((entry) => asContentAuditEvent(entry.id, entry.data() as ContentAuditDocument)));
  }, onError);
}

export function subscribeToMemberLedger(
  firestore: Firestore,
  onChange: (events: MemberLedgerEvent[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(query(collection(firestore, 'memberLedger'), orderBy('createdAt', 'desc')), (snapshot) => {
    onChange(snapshot.docs.slice(0, 30).map((entry) => asMemberLedgerEvent(entry.id, entry.data() as MemberLedgerDocument)));
  }, onError);
}

function adminAuditEntry(action: string, entityId: string, actorId: string) {
  return {
    action,
    articleSlug: `${entityId}`,
    actorId,
    createdAt: serverTimestamp(),
  };
}

export async function setMemberStatus(firestore: Firestore, memberId: string, status: MemberStatus, actorId: string) {
  const batch = writeBatch(firestore);
  batch.update(doc(firestore, 'members', memberId), {
    status,
    banReason: status === 'banned' ? 'Yönetici kararıyla erişim engellendi.' : '',
    bannedBy: status === 'banned' ? actorId : '',
    bannedAt: status === 'banned' ? serverTimestamp() : null,
    bannedUntil: null,
    approvedBy: status === 'active' ? actorId : '',
    approvedAt: status === 'active' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(collection(firestore, 'contentAudit')), adminAuditEntry(`member-status:${status}`, memberId, actorId));
  await batch.commit();
}

export async function banMember(
  firestore: Firestore,
  memberId: string,
  reason: string,
  actorId: string,
  durationHours: number | null = null,
) {
  if (durationHours !== null && (!Number.isInteger(durationHours) || durationHours < 1 || durationHours > 24 * 365)) {
    throw new Error('Uzaklaştırma süresi geçersiz.');
  }
  const batch = writeBatch(firestore);
  batch.update(doc(firestore, 'members', memberId), {
    status: 'banned',
    banReason: reason.trim().slice(0, 240) || 'Yönetici kararıyla erişim engellendi.',
    bannedBy: actorId,
    bannedAt: serverTimestamp(),
    bannedUntil: durationHours === null ? null : new Date(Date.now() + durationHours * 60 * 60 * 1000),
    updatedAt: serverTimestamp(),
  });
  const action = durationHours === null ? 'member-status:banned' : `member-status:suspended-${durationHours}h`;
  batch.set(doc(collection(firestore, 'contentAudit')), adminAuditEntry(action, memberId, actorId));
  await batch.commit();
}

export async function setMemberRestrictions(
  firestore: Firestore,
  memberId: string,
  restrictions: MemberRestrictionKey[],
  actorId: string,
) {
  const allowed: MemberRestrictionKey[] = ['community', 'comments', 'content_sharing', 'messaging', 'code_sale', 'store_purchase', 'wallet'];
  const normalized = [...new Set(restrictions)].filter((item): item is MemberRestrictionKey => allowed.includes(item));
  const batch = writeBatch(firestore);
  batch.update(doc(firestore, 'members', memberId), {
    restrictions: normalized,
    restrictionsUpdatedBy: actorId,
    restrictionsUpdatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(
    doc(collection(firestore, 'contentAudit')),
    adminAuditEntry(`member-restrictions:${normalized.join(',') || 'none'}`, memberId, actorId),
  );
  await batch.commit();
}

export async function setMemberAccess(
  firestore: Firestore,
  memberId: string,
  role: MemberRole,
  permissions: string[],
  actorId: string,
) {
  const batch = writeBatch(firestore);
  batch.update(doc(firestore, 'members', memberId), {
    role,
    permissions,
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(collection(firestore, 'contentAudit')), adminAuditEntry(`member-access:${role}`, memberId, actorId));
  await batch.commit();
}

export async function changeMemberValue(
  firestore: Firestore,
  adminId: string,
  member: AdminMember,
  kind: 'balance' | 'points',
  amount: number,
  note: string,
) {
  if (!Number.isFinite(amount) || amount === 0) throw new Error('Geçerli bir tutar girin.');
  if (kind === 'points' && !Number.isInteger(amount)) throw new Error('Puan işlemleri yalnızca tam sayı olabilir.');
  const memberRef = doc(firestore, 'members', member.id);
  const ledgerRef = doc(collection(firestore, 'memberLedger'));
  const auditRef = doc(collection(firestore, 'contentAudit'));

  await runTransaction(firestore, async (transaction) => {
    const current = await transaction.get(memberRef);
    if (!current.exists()) throw new Error('Üye kaydı bulunamadı.');
    const rawExisting = Number(current.data()[kind]) || 0;
    const existing = kind === 'balance' ? Math.round(rawExisting * 100) : Math.max(0, Math.trunc(rawExisting));
    const normalizedAmount = kind === 'balance' ? Math.round(amount * 100) : amount;
    if (normalizedAmount === 0) throw new Error('Tutar en az 0,01 TL olmalıdır.');
    const next = Math.max(0, existing + normalizedAmount);
    const applied = next - existing;
    if (applied === 0) throw new Error('Bu işlem üyeyi eksi bakiyeye düşüremez.');

    const persistedNext = kind === 'balance' ? next / 100 : next;
    const persistedApplied = kind === 'balance' ? applied / 100 : applied;

    transaction.update(memberRef, { [kind]: persistedNext, updatedAt: serverTimestamp() });
    transaction.set(ledgerRef, {
      memberId: member.id,
      kind,
      amount: persistedApplied,
      balanceAfter: persistedNext,
      note: note.trim().slice(0, 240) || 'Yönetici işlemi',
      performedBy: adminId,
      createdAt: serverTimestamp(),
    });
    transaction.set(
      auditRef,
      adminAuditEntry(`member-${kind}:${persistedApplied >= 0 ? 'credit' : 'debit'}`, member.id, adminId),
    );
  });
}

export async function moderateComment(
  firestore: Firestore,
  commentId: string,
  status: 'approved' | 'rejected',
  adminId: string,
) {
  const batch = writeBatch(firestore);
  batch.update(doc(firestore, 'comments', commentId), {
    status,
    moderatedBy: adminId,
    moderatedAt: serverTimestamp(),
  });
  batch.set(doc(collection(firestore, 'contentAudit')), adminAuditEntry(`comment:${status}`, commentId, adminId));
  await batch.commit();
}

export async function removeComment(firestore: Firestore, commentId: string, adminId: string) {
  const batch = writeBatch(firestore);
  batch.delete(doc(firestore, 'comments', commentId));
  batch.set(doc(collection(firestore, 'contentAudit')), adminAuditEntry('comment:deleted', commentId, adminId));
  await batch.commit();
}
