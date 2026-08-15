import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

export type PublicComment = {
  id: string;
  parentId: string | null;
  author: string;
  uid?: string | null;
  service: string;
  message: string;
  rating: number | null;
  createdAt: Date | null;
};

export type EngagementCounts = Record<string, number>;

type CommentDocument = {
  parentId?: string | null;
  author?: string;
  uid?: string | null;
  service?: string;
  message?: string;
  rating?: number | null;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Timestamp;
};

type CreateCommentInput = {
  parentId?: string | null;
  author: string;
  uid?: string | null;
  service: string;
  message: string;
  rating?: number | null;
  status?: 'pending' | 'approved';
};

type EngagementDocument = {
  type?: 'like' | 'view';
  targetId?: string;
};

export function subscribeToApprovedComments(
  firestore: Firestore,
  onChange: (comments: PublicComment[]) => void,
  onError: () => void,
) {
  const commentsQuery = query(
    collection(firestore, 'comments'),
    where('status', '==', 'approved'),
  );

  return onSnapshot(
    commentsQuery,
    (snapshot) => {
      const comments = snapshot.docs
        .map((document) => {
          const data = document.data() as CommentDocument;

          return {
            id: document.id,
            parentId: data.parentId ?? null,
            author: data.author ?? 'Ziyaretçi',
            uid: data.uid ?? null,
            service: data.service ?? 'Diğer',
            message: data.message ?? '',
            rating:
              typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5
                ? data.rating
                : null,
            createdAt: data.createdAt?.toDate() ?? null,
          } satisfies PublicComment;
        })
        .filter((comment) => comment.message)
        .sort((first, second) => {
          const firstTime = first.createdAt?.getTime() ?? 0;
          const secondTime = second.createdAt?.getTime() ?? 0;
          return secondTime - firstTime;
        });

      onChange(comments);
    },
    onError,
  );
}

export function subscribeToApprovedCommentsForService(
  firestore: Firestore,
  service: string,
  onChange: (comments: PublicComment[]) => void,
  onError: () => void,
) {
  return onSnapshot(
    query(collection(firestore, 'comments'), where('status', '==', 'approved'), where('service', '==', service)),
    (snapshot) => {
      const comments = snapshot.docs
        .map((document) => {
          const data = document.data() as CommentDocument;
          return {
            id: document.id,
            parentId: data.parentId ?? null,
            author: data.author ?? 'Ziyaretçi',
            uid: data.uid ?? null,
            service: data.service ?? service,
            message: data.message ?? '',
            rating: typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5 ? data.rating : null,
            createdAt: data.createdAt?.toDate() ?? null,
          } satisfies PublicComment;
        })
        .filter((comment) => comment.message)
        .sort((first, second) => (second.createdAt?.getTime() ?? 0) - (first.createdAt?.getTime() ?? 0));
      onChange(comments);
    },
    onError,
  );
}

export async function createPendingComment(
  firestore: Firestore,
  input: CreateCommentInput,
) {
  return addDoc(collection(firestore, 'comments'), {
    parentId: input.parentId ?? null,
    author: input.author,
    uid: input.uid ?? null,
    service: input.service,
    message: input.message,
    rating: input.parentId ? null : (input.rating ?? 5),
    status: input.status ?? 'pending',
    createdAt: serverTimestamp(),
  });
}

export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return '';
  const storageKey = 'sky-reference-visitor';
  const current = window.localStorage.getItem(storageKey);
  if (current) return current;
  const generated = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(storageKey, generated);
  return generated;
}

export async function registerEngagement(
  firestore: Firestore,
  visitorId: string,
  type: 'like' | 'view',
  targetId: string,
) {
  if (!visitorId || !targetId) return;
  const safeTarget = targetId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 100);
  const safeVisitor = visitorId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80);
  await setDoc(doc(firestore, 'referenceEngagements', `${type}_${safeTarget}_${safeVisitor}`), {
    type,
    targetId,
    visitorId,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToEngagementCounts(
  firestore: Firestore,
  onChange: (counts: { likes: EngagementCounts; views: EngagementCounts; likers: Record<string, string[]> }) => void,
  onError: () => void,
) {
  return onSnapshot(
    collection(firestore, 'referenceEngagements'),
    (snapshot) => {
      const likes: EngagementCounts = {};
      const views: EngagementCounts = {};
      snapshot.docs.forEach((document) => {
        const data = document.data() as EngagementDocument;
        if (!data.targetId) return;
        if (data.type !== 'like' && data.type !== 'view') return;
        const target = data.type === 'view' ? views : likes;
        target[data.targetId] = (target[data.targetId] ?? 0) + 1;
      });
      onChange({ likes, views, likers: {} });
    },
    onError,
  );
}

export function subscribeToEngagementCountsForTarget(
  firestore: Firestore,
  targetId: string,
  onChange: (counts: { likes: number; views: number }) => void,
  onError: () => void,
) {
  return onSnapshot(
    query(collection(firestore, 'referenceEngagements'), where('targetId', '==', targetId)),
    (snapshot) => {
      let likes = 0;
      let views = 0;
      snapshot.docs.forEach((document) => {
        const type = (document.data() as EngagementDocument).type;
        if (type === 'like') likes += 1;
        if (type === 'view') views += 1;
      });
      onChange({ likes, views });
    },
    onError,
  );
}
