"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseClient } from '../../lib/firebase';

type EditorContextValue = { isAdmin: boolean; uid: string | null };
const EditorContext = createContext<EditorContextValue>({ isAdmin: false, uid: null });
const bootstrapAdminEmail = 'sonerkayan17@gmail.com';

export function SiteEditorProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<EditorContextValue>({ isAdmin: false, uid: null });

  useEffect(() => {
    const { auth } = getFirebaseClient();
    if (!auth) return;
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { setValue({ isAdmin: false, uid: null }); return; }
      const token = await user.getIdTokenResult();
      setValue({ isAdmin: token.claims.admin === true || user.email === bootstrapAdminEmail, uid: user.uid });
    });
  }, []);

  const contextValue = useMemo(() => value, [value]);
  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
}

export function useSiteEditor() {
  return useContext(EditorContext);
}
