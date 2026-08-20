"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { deferClientTask } from '../../lib/defer-client-task';

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
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;
    const accountRoute = /^\/(yonetim|admin|hesabim|giris|kayit|uyeler)(\/|$)/.test(pathname);
    const knownAdmin = typeof window !== 'undefined' && window.localStorage.getItem('sky-bozum-admin-session') === '1';
    const shouldVerifyImmediately = accountRoute || knownAdmin;
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseClient }, { onAuthStateChanged }] = await Promise.all([
        import('../../lib/firebase'),
        import('firebase/auth'),
      ]);
      if (!active) return;
      const { auth } = getFirebaseClient();
      if (!auth) return;
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          window.localStorage.removeItem('sky-bozum-admin-session');
          setIsAdmin(false); setUid(null); setIsEditMode(false);
          return;
        }
        try {
          const token = await user.getIdTokenResult();
          const allowed = token.claims.admin === true || user.email === bootstrapAdminEmail;
          if (allowed) window.localStorage.setItem('sky-bozum-admin-session', '1');
          else window.localStorage.removeItem('sky-bozum-admin-session');
          setIsAdmin(allowed); setUid(allowed ? user.uid : null);
          if (!allowed) setIsEditMode(false);
        } catch {
          setIsAdmin(false); setUid(null); setIsEditMode(false);
        }
      });
    }, {
      delay: shouldVerifyImmediately ? 0 : 60_000,
      eager: shouldVerifyImmediately,
      intentEvents: shouldVerifyImmediately,
    });
    return () => { active = false; cancel(); unsubscribe(); };
  }, [pathname]);

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
