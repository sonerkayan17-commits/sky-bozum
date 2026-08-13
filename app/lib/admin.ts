import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  addDoc,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

export type MemberRole = 'member' | 'editor' | 'publisher' | 'moderator' | 'operator' | 'admin';
export type MemberStatus = 'pending' | 'active' | 'banned';

export type AdminMember = {
  id: string;
  displayName: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  balance: number;
  points: number;
  permissions: string[];
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

type MemberDocument = Omit<AdminMember, 'id' | 'createdAt'> & { createdAt?: Timestamp };
type CommentDocument = Omit<AdminComment, 'id' | 'createdAt'> & { createdAt?: Timestamp };
type ContentAuditDocument = Omit<ContentAuditEvent, 'id' | 'createdAt'> & { createdAt?: Timestamp };
type MemberLedgerDocument = Omit<MemberLedgerEvent, 'id' | 'createdAt'> & { createdAt?: Timestamp };

function asMember(id: string, value: MemberDocument): AdminMember {
  return {
    id,
    displayName: value.displayName || 'İsimsiz üye',
    email: value.email || 'E-posta yok',
    role: value.role || 'member',
    status: value.status || 'pending',
    balance: Number(value.balance) || 0,
    points: Number(value.points) || 0,
    permissions: Array.isArray(value.permissions) ? value.permissions : [],
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
    articleSlug: value.articleSlug || 'unknown',
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

async function writeAdminAudit(firestore: Firestore, action: string, entityId: string, actorId: string) {
  await addDoc(collection(firestore, 'contentAudit'), {
    action,
    articleSlug: `${entityId}`,
    actorId,
    createdAt: serverTimestamp(),
  });
}

export async function setMemberStatus(firestore: Firestore, memberId: string, status: MemberStatus, actorId: string) {
  await updateDoc(doc(firestore, 'members', memberId), { status, updatedAt: serverTimestamp() });
  await writeAdminAudit(firestore, `member-status:${status}`, memberId, actorId);
}

export async function setMemberAccess(
  firestore: Firestore,
  memberId: string,
  role: MemberRole,
  permissions: string[],
  actorId: string,
) {
  await updateDoc(doc(firestore, 'members', memberId), {
    role,
    permissions,
    updatedAt: serverTimestamp(),
  });
  await writeAdminAudit(firestore, `member-access:${role}`, memberId, actorId);
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
  const memberRef = doc(firestore, 'members', member.id);
  const ledgerRef = doc(collection(firestore, 'memberLedger'));

  await runTransaction(firestore, async (transaction) => {
    const current = await transaction.get(memberRef);
    if (!current.exists()) throw new Error('Üye kaydı bulunamadı.');
    const existing = Number(current.data()[kind]) || 0;
    const next = Math.max(0, existing + amount);
    const applied = next - existing;
    if (applied === 0) throw new Error('Bu işlem üyeyi eksi bakiyeye düşüremez.');

    transaction.update(memberRef, { [kind]: next, updatedAt: serverTimestamp() });
    transaction.set(ledgerRef, {
      memberId: member.id,
      kind,
      amount: applied,
      balanceAfter: next,
      note: note.trim().slice(0, 240) || 'Yönetici işlemi',
      performedBy: adminId,
      createdAt: serverTimestamp(),
    });
  });
  await writeAdminAudit(firestore, `member-${kind}:${amount >= 0 ? 'credit' : 'debit'}`, member.id, adminId);
}

export async function moderateComment(
  firestore: Firestore,
  commentId: string,
  status: 'approved' | 'rejected',
  adminId: string,
) {
  await updateDoc(doc(firestore, 'comments', commentId), {
    status,
    moderatedBy: adminId,
    moderatedAt: serverTimestamp(),
  });
  await writeAdminAudit(firestore, `comment:${status}`, commentId, adminId);
}

export async function removeComment(firestore: Firestore, commentId: string, adminId: string) {
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(firestore, 'comments', commentId));
  await writeAdminAudit(firestore, 'comment:deleted', commentId, adminId);
}
