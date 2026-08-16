'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const QuickCalculator = lazy(() => import('../QuickCalculator'));

export default function DeferredQuickCalculator() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '280px 0px' });

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="min-h-[410px]">
      {shouldLoad ? (
        <Suspense fallback={<CalculatorPlaceholder />}>
          <QuickCalculator compact />
        </Suspense>
      ) : <CalculatorPlaceholder />}
    </div>
  );
}

function CalculatorPlaceholder() {
  return (
    <div
      className="h-full min-h-[410px] rounded-[24px] border border-white/[.08] bg-white/[.02]"
      aria-hidden="true"
    />
  );
}
