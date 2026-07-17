import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

export type PublicComment = {
  id: string;
  parentId: string | null;
  author: string;
  service: string;
  message: string;
  rating: number | null;
  createdAt: Date | null;
};

type CommentDocument = {
  parentId?: string | null;
  author?: string;
  service?: string;
  message?: string;
  rating?: number | null;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Timestamp;
};

type CreateCommentInput = {
  parentId?: string | null;
  author: string;
  service: string;
  message: string;
  rating?: number | null;
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

export async function createPendingComment(
  firestore: Firestore,
  input: CreateCommentInput,
) {
  await addDoc(collection(firestore, 'comments'), {
    parentId: input.parentId ?? null,
    author: input.author,
    service: input.service,
    message: input.message,
    rating: input.parentId ? null : (input.rating ?? 5),
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
