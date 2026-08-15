'use client';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { rateItems, type RateItem } from '../../lib/rates';

type PublishedOverride = { rate: number; maxRate: number };

function rangeLabel(rate: number, maxRate: number) {
  return rate === maxRate ? `%${rate}` : `%${rate} – %${maxRate}`;
}

export default function usePublishedRates() {
  const [overrides, setOverrides] = useState<Record<string, PublishedOverride>>({});

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) return;
    return onSnapshot(
      query(collection(db, 'rateOverrides'), where('status', '==', 'published')),
      (snapshot) => {
        const next: Record<string, PublishedOverride> = {};
        snapshot.docs.forEach((entry) => {
          const data = entry.data();
          const rate = Number(data.rate);
          const maxRate = Number(data.maxRate);
          if (Number.isFinite(rate) && Number.isFinite(maxRate) && rate >= 0 && maxRate >= rate && maxRate <= 100) {
            next[entry.id] = { rate, maxRate };
          }
        });
        setOverrides(next);
      },
      () => setOverrides({}),
    );
  }, []);

  return useMemo(() => rateItems.map((item): RateItem => {
    const override = overrides[item.id];
    if (!override) return item;
    return { ...item, ...override, range: rangeLabel(override.rate, override.maxRate) };
  }), [overrides]);
}
