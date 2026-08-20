'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type DeferredViewportSectionProps = {
  children: ReactNode;
  className?: string;
  desktopHeight: number;
  mobileHeight: number;
};

type DeferredStyle = CSSProperties & {
  '--deferred-desktop-height': string;
  '--deferred-mobile-height': string;
};

export default function DeferredViewportSection({ children, className = '', desktopHeight, mobileHeight }: DeferredViewportSectionProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !('IntersectionObserver' in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: '480px 0px', threshold: 0.01 });
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  const style: DeferredStyle = {
    '--deferred-desktop-height': `${desktopHeight}px`,
    '--deferred-mobile-height': `${mobileHeight}px`,
  };

  return <div ref={hostRef} className={`viewport-deferred-section ${ready ? 'is-ready' : ''} ${className}`.trim()} style={style} aria-busy={!ready}>
    {ready ? children : <span className="viewport-deferred-section__signal" aria-hidden="true" />}
  </div>;
}
