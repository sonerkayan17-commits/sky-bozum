export interface BodyScrollLock {
  release(): void;
}

interface LockState {
  count: number;
  previousOverflow: string;
}

const lockStates = new WeakMap<Document, LockState>();

export function acquireBodyScrollLock(documentRef: Document | undefined): BodyScrollLock {
  if (!documentRef?.body) return { release: () => undefined };

  const existing = lockStates.get(documentRef);
  if (existing) {
    existing.count += 1;
  } else {
    lockStates.set(documentRef, {
      count: 1,
      previousOverflow: documentRef.body.style.overflow,
    });
    documentRef.body.style.overflow = "hidden";
  }

  let released = false;
  return {
    release() {
      if (released) return;
      released = true;

      const state = lockStates.get(documentRef);
      if (!state) return;

      state.count -= 1;
      if (state.count > 0) return;

      if (documentRef.body.style.overflow === "hidden") {
        documentRef.body.style.overflow = state.previousOverflow;
      }
      lockStates.delete(documentRef);
    },
  };
}
