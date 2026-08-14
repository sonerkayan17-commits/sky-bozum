"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getFirebaseClient } from '../lib/firebase';
import { defaultSiteSettings, subscribeToSiteSettings, type SiteSettings } from '../lib/siteSettings';

const SiteSettingsContext = createContext<SiteSettings>(defaultSiteSettings);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSiteSettings);

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) return;
    return subscribeToSiteSettings(db, setSettings);
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
