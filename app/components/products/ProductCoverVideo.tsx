'use client';

import { useEffect, useRef, useState } from 'react';

type ProductCoverVideoProps = {
  src: string;
  objectPosition?: string;
  priority?: boolean;
};

export default function ProductCoverVideo({ src, objectPosition = '50% 50%' }: ProductCoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sourceEnabled, setSourceEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const trigger = video.closest<HTMLElement>('.product-directory-card, .product-detail-hero__cover') ?? video.parentElement;
    if (!trigger) return;

    const start = () => {
      setSourceEnabled(true);
      setActive(true);
    };
    const stop = () => setActive(false);
    const stopAfterFocus = (event: FocusEvent) => {
      if (!trigger.contains(event.relatedTarget as Node | null)) stop();
    };

    trigger.addEventListener('pointerenter', start);
    trigger.addEventListener('pointerleave', stop);
    trigger.addEventListener('focusin', start);
    trigger.addEventListener('focusout', stopAfterFocus);
    return () => {
      trigger.removeEventListener('pointerenter', start);
      trigger.removeEventListener('pointerleave', stop);
      trigger.removeEventListener('focusin', start);
      trigger.removeEventListener('focusout', stopAfterFocus);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (sourceEnabled && active) {
      void video.play().catch(() => undefined);
      return;
    }
    video.pause();
    if (video.currentTime > 0) video.currentTime = 0;
  }, [active, sourceEnabled]);

  return (
    <video
      ref={videoRef}
      className={`product-cover__video ${ready ? 'is-ready' : ''} ${active ? 'is-active' : ''}`}
      style={{ objectPosition }}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      aria-hidden="true"
      onLoadedData={() => setReady(true)}
    >
      {sourceEnabled ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
