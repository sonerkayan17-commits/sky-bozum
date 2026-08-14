"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseClient } from '../../lib/firebase';

type SiteEditorContextValue = {
  isAdmin: boolean;
  isEditMode: boolean;
  uid: string | null;
  toggleEditMode: () => void;
};

const bootstrapAdminEmail = 'sonerkayan17@gmail.com';
const SiteEditorContext = createContext<SiteEditorContextValue>({
  isAdmin: false,
  isEditMode: false,
  uid: null,
  toggleEditMode: () => undefined,
});

export function SiteEditorProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const { auth } = getFirebaseClient();
    if (!auth) return;

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setUid(null);
        setIsEditMode(false);
        return;
      }

      try {
        const token = await user.getIdTokenResult();
        const allowed = token.claims.admin === true || user.email === bootstrapAdminEmail;
        setIsAdmin(allowed);
        setUid(allowed ? user.uid : null);
        if (!allowed) setIsEditMode(false);
      } catch {
        setIsAdmin(false);
        setUid(null);
        setIsEditMode(false);
      }
    });
  }, []);

  const value = useMemo<SiteEditorContextValue>(() => ({
    isAdmin,
    isEditMode,
    uid,
    toggleEditMode: () => setIsEditMode((current) => (isAdmin ? !current : false)),
  }), [isAdmin, isEditMode, uid]);

  return <SiteEditorContext.Provider value={value}>{children}</SiteEditorContext.Provider>;
}

export function useSiteEditor() {
  return useContext(SiteEditorContext);
}
