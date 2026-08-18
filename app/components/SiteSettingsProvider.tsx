"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { deferClientTask } from '../lib/defer-client-task';
import { defaultSiteSettings, type SiteSettings } from '../lib/siteSettingsDefaults';

const SiteSettingsContext = createContext<SiteSettings>(defaultSiteSettings);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSiteSettings);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseClient }, { subscribeToSiteSettings }] = await Promise.all([
        import('../lib/firebase'),
        import('../lib/siteSettings'),
      ]);
      if (!active) return;
      const { db } = getFirebaseClient();
      if (!db) return;
      unsubscribe = subscribeToSiteSettings(db, (next) => {
        setSettings((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
      });
    }, { delay: 60_000, intentEvents: false });
    return () => { active = false; cancel(); unsubscribe(); };
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
