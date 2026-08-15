'use client';

import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  addPathSignal,
  clearRecentPaths,
  CONSENT_STORAGE_KEY,
  createVisitorProfile,
  parseVisitorProfile,
  PROFILE_STORAGE_KEY,
  RATE_CHOICE_STORAGE_KEY,
  type VisitorProfile,
} from '../../lib/personalization';

type ConsentState = 'unknown' | 'accepted' | 'rejected';

type VisitorExperienceContextValue = {
  consent: ConsentState;
  profile: VisitorProfile | null;
  preferencesOpen: boolean;
  acceptPersonalization: () => void;
  rejectPersonalization: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
  resetProfile: () => void;
  clearRecentHistory: () => void;
};

const VisitorExperienceContext = createContext<VisitorExperienceContextValue | null>(null);

function readStorage(key: string) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function writeStorage(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* The experience remains session-only. */ }
}

function removeStorage(key: string) {
  try { window.localStorage.removeItem(key); } catch { /* Storage may be blocked by the browser. */ }
}

export function useVisitorExperience() {
  const value = useContext(VisitorExperienceContext);
  if (!value) throw new Error('useVisitorExperience must be used inside VisitorExperienceProvider');
  return value;
}

export default function VisitorExperienceProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<ConsentState>('unknown');
  const [profile, setProfile] = useState<VisitorProfile | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const savedConsent = readStorage(CONSENT_STORAGE_KEY);
    const savedProfile = parseVisitorProfile(readStorage(PROFILE_STORAGE_KEY));
    queueMicrotask(() => {
      if (!active) return;
      if (savedConsent === 'accepted') {
        if (savedProfile) setProfile(savedProfile);
        else removeStorage(PROFILE_STORAGE_KEY);
        setConsent('accepted');
      } else if (savedConsent === 'rejected') {
        setConsent('rejected');
        removeStorage(PROFILE_STORAGE_KEY);
      }
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready || consent !== 'accepted') return;
    queueMicrotask(() => setProfile((current) => {
        const next = addPathSignal(current ?? createVisitorProfile(), pathname);
        writeStorage(PROFILE_STORAGE_KEY, JSON.stringify(next));
        return next;
      }));
  }, [consent, pathname, ready]);

  const acceptPersonalization = useCallback(() => {
    writeStorage(CONSENT_STORAGE_KEY, 'accepted');
    setConsent('accepted');
    setPreferencesOpen(false);
  }, []);

  const rejectPersonalization = useCallback(() => {
    writeStorage(CONSENT_STORAGE_KEY, 'rejected');
    removeStorage(PROFILE_STORAGE_KEY);
    removeStorage(RATE_CHOICE_STORAGE_KEY);
    setProfile(null);
    setConsent('rejected');
    setPreferencesOpen(false);
  }, []);

  const resetProfile = useCallback(() => {
    if (consent !== 'accepted') return;
    const next = createVisitorProfile();
    writeStorage(PROFILE_STORAGE_KEY, JSON.stringify(next));
    removeStorage(RATE_CHOICE_STORAGE_KEY);
    setProfile(next);
  }, [consent]);

  const clearRecentHistory = useCallback(() => {
    if (consent !== 'accepted') return;
    setProfile((current) => {
      if (!current) return current;
      const next = clearRecentPaths(current);
      writeStorage(PROFILE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [consent]);

  const value = useMemo<VisitorExperienceContextValue>(() => ({
    consent,
    profile,
    preferencesOpen,
    acceptPersonalization,
    rejectPersonalization,
    openPreferences: () => setPreferencesOpen(true),
    closePreferences: () => setPreferencesOpen(false),
    resetProfile,
    clearRecentHistory,
  }), [acceptPersonalization, clearRecentHistory, consent, preferencesOpen, profile, rejectPersonalization, resetProfile]);

  return (
    <VisitorExperienceContext.Provider value={value}>
      {children}
    </VisitorExperienceContext.Provider>
  );
}
