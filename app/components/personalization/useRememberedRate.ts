'use client';

import { useCallback, useEffect, useState } from 'react';
import { rateItems } from '../../lib/rates';
import { RATE_CHOICE_STORAGE_KEY } from '../../lib/personalization';
import { useVisitorExperience } from './VisitorExperienceProvider';

export default function useRememberedRate() {
  const { consent } = useVisitorExperience();
  const [serviceName, setServiceName] = useState(rateItems[0].name);

  useEffect(() => {
    if (consent !== 'accepted') return;
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(RATE_CHOICE_STORAGE_KEY); } catch { /* Browser storage may be unavailable. */ }
    if (!stored || !rateItems.some((item) => item.name === stored)) return;
    queueMicrotask(() => setServiceName(stored as string));
  }, [consent]);

  const rememberService = useCallback((name: string) => {
    setServiceName(name);
    if (consent !== 'accepted') return;
    try { window.localStorage.setItem(RATE_CHOICE_STORAGE_KEY, name); } catch { /* The selection remains available for this render. */ }
  }, [consent]);

  return [serviceName, rememberService] as const;
}
