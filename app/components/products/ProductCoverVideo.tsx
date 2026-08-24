'use client';

import { useEffect, useId, useRef, useState } from 'react';

type ProductCoverVideoProps = {
  src: string;
  objectPosition?: string;
  priority?: boolean;
};

const PRODUCT_VIDEO_ACTIVE_EVENT = 'sky-product-video-active';

export default function ProductCoverVideo({ src, objectPosition = '50% 50%' }: ProductCoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackId = useId();
  const [sourceEnabled, setSourceEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const trigger = video.closest<HTMLElement>('.product-directory-card, .product-detail-hero__cover') ?? video.parentElement;
    if (!trigger) return;

    const isCoarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isCompactViewport = window.matchMedia('(max-width: 820px)').matches;
    const usesInViewPlayback = isCoarsePointer || isCompactViewport;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const mayAutoPlayInView = usesInViewPlayback && !prefersReducedMotion && !connection?.saveData;

    const start = () => {
      setSourceEnabled(true);
      window.dispatchEvent(new CustomEvent(PRODUCT_VIDEO_ACTIVE_EVENT, { detail: playbackId }));
      setActive(true);
    };
    const stop = () => setActive(false);
    const stopAfterFocus = (event: FocusEvent) => {
      if (!trigger.contains(event.relatedTarget as Node | null)) stop();
    };

    const handlePointerEnter = () => {
      if (!usesInViewPlayback) start();
    };
    const handlePointerLeave = () => {
      if (!usesInViewPlayback) stop();
    };
    const handleAnotherVideo = (event: Event) => {
      if ((event as CustomEvent<string>).detail === playbackId) return;
      stop();
      if (usesInViewPlayback) {
        setSourceEnabled(false);
        setReady(false);
      }
    };

    trigger.addEventListener('pointerenter', handlePointerEnter);
    trigger.addEventListener('pointerleave', handlePointerLeave);
    trigger.addEventListener('focusin', start);
    trigger.addEventListener('focusout', stopAfterFocus);
    window.addEventListener(PRODUCT_VIDEO_ACTIVE_EVENT, handleAnotherVideo);

    const observer = mayAutoPlayInView
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.62) start();
          else if (!entry.isIntersecting || entry.intersectionRatio < 0.24) stop();
        }, { threshold: [0, 0.24, 0.62, 0.82], rootMargin: '-8% 0px -10%' })
      : null;
    observer?.observe(trigger);

    return () => {
      observer?.disconnect();
      trigger.removeEventListener('pointerenter', handlePointerEnter);
      trigger.removeEventListener('pointerleave', handlePointerLeave);
      trigger.removeEventListener('focusin', start);
      trigger.removeEventListener('focusout', stopAfterFocus);
      window.removeEventListener(PRODUCT_VIDEO_ACTIVE_EVENT, handleAnotherVideo);
    };
  }, [playbackId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (sourceEnabled && active) {
      if (!video.currentSrc) video.load();
      void video.play().catch(() => undefined);
      return;
    }
    video.pause();
    if (video.currentTime > 0) video.currentTime = 0;
    if (!sourceEnabled && video.currentSrc) video.load();
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
      disablePictureInPicture
      controlsList="nodownload noplaybackrate nofullscreen"
      draggable={false}
      tabIndex={-1}
      aria-hidden="true"
      onContextMenu={(event) => event.preventDefault()}
      onLoadedData={() => setReady(true)}
    >
      {sourceEnabled ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
