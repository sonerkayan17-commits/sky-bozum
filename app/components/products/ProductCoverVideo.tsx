'use client';

import { useEffect, useRef, useState } from 'react';

type ProductCoverVideoProps = {
  src: string;
  objectPosition?: string;
  priority?: boolean;
};

export default function ProductCoverVideo({ src, objectPosition = '50% 50%', priority = false }: ProductCoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sourceEnabled, setSourceEnabled] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry?.isIntersecting === true;
      setInView(visible);
      if (visible) setSourceEnabled(true);
    }, { rootMargin: priority ? '220px 0px' : '100px 0px', threshold: 0.05 });

    observer.observe(video);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourceEnabled) return;
    if (inView) void video.play().catch(() => undefined);
    else video.pause();
  }, [inView, sourceEnabled]);

  return (
    <video
      ref={videoRef}
      className={`product-cover__video ${ready ? 'is-ready' : ''}`}
      style={{ objectPosition }}
      muted
      loop
      playsInline
      preload={priority ? 'metadata' : 'none'}
      tabIndex={-1}
      aria-hidden="true"
      onLoadedData={() => setReady(true)}
    >
      {sourceEnabled ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
