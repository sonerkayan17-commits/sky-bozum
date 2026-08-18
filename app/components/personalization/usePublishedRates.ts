'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { deferClientTask } from '../../lib/defer-client-task';
import { rateItems, type RateItem } from '../../lib/rates';

type PublishedOverride = { rate: number; maxRate: number };

function rangeLabel(rate: number, maxRate: number) {
  return rate === maxRate ? `%${rate}` : `%${rate} – %${maxRate}`;
}

export default function usePublishedRates() {
  const pathname = usePathname();
  const [overrides, setOverrides] = useState<Record<string, PublishedOverride>>({});

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseClient }, { collection, onSnapshot, query, where }] = await Promise.all([
        import('../../lib/firebase'),
        import('firebase/firestore'),
      ]);
      if (!active) return;
      const { db } = getFirebaseClient();
      if (!db) return;
      unsubscribe = onSnapshot(query(collection(db, 'rateOverrides'), where('status', '==', 'published')), (snapshot) => {
        const next: Record<string, PublishedOverride> = {};
        snapshot.docs.forEach((entry) => {
          const data = entry.data();
          const rate = Number(data.rate); const maxRate = Number(data.maxRate);
          if (Number.isFinite(rate) && Number.isFinite(maxRate) && rate >= 0 && maxRate >= rate && maxRate <= 100) next[entry.id] = { rate, maxRate };
        });
        setOverrides((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
      }, () => setOverrides({}));
    }, { delay: 60_000, eager: pathname !== '/', intentEvents: pathname !== '/' });
    return () => { active = false; cancel(); unsubscribe(); };
  }, [pathname]);

  return useMemo(() => rateItems.map((item): RateItem => {
    const override = overrides[item.id];
    if (!override) return item;
    return { ...item, ...override, range: rangeLabel(override.rate, override.maxRate) };
  }), [overrides]);
}
