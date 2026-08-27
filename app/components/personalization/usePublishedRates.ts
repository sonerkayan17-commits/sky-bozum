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
    const controller = new AbortController();

    async function refreshRates() {
      try {
        const response = await fetch('/api/public-rates', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok || !active) return;
        const payload = await response.json() as { rates?: Record<string, PublishedOverride> };
        const next = payload.rates ?? {};
        setOverrides((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
      } catch {
        // Ağ kesintisinde kod içindeki doğrulanmış oran yedeği korunur.
      }
    }

    // İlk görünüm statik ve doğrulanmış oran yedeğiyle anında çizilir. Küçük
    // JSON yanıtı hemen ardından alınır; ana sayfa Firebase istemci paketini
    // indirmeden yönetimde yayımlanan oranları gösterir.
    const cancel = deferClientTask(() => refreshRates(), {
      delay: 1_500,
      eager: false,
      intentEvents: false,
    });
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refreshRates();
    };
    window.addEventListener('focus', refreshWhenVisible);
    window.addEventListener('online', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      active = false;
      cancel();
      controller.abort();
      window.removeEventListener('focus', refreshWhenVisible);
      window.removeEventListener('online', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [pathname]);

  return useMemo(() => rateItems.map((item): RateItem => {
    const override = overrides[item.id];
    if (!override) return item;
    return { ...item, ...override, range: rangeLabel(override.rate, override.maxRate) };
  }), [overrides]);
}
