'use client';

import { useEffect, useId, useRef, useState } from 'react';

type ProductCoverVideoProps = {
  src: string;
  poster: string;
  objectPosition?: string;
  priority?: boolean;
};

const PRODUCT_VIDEO_ACTIVE_EVENT = 'sky-product-video-active';
type MobileVideoCandidate = { ratio: number; centerDistance: number; activate: () => void };
const mobileVideoCandidates = new Map<string, MobileVideoCandidate>();
let mobileSelectionFrame = 0;
let lastMobileInteractionAt = 0;

function scheduleMobileSelection() {
  if (Date.now() - lastMobileInteractionAt < 10_000 || mobileSelectionFrame) return;
  mobileSelectionFrame = window.requestAnimationFrame(() => {
    mobileSelectionFrame = 0;
    const selected = [...mobileVideoCandidates.values()]
      .filter((candidate) => candidate.ratio >= .24)
      .sort((left, right) => left.centerDistance - right.centerDistance || right.ratio - left.ratio)[0];
    selected?.activate();
  });
}

export default function ProductCoverVideo({ src, poster, objectPosition = '50% 50%', priority = false }: ProductCoverVideoProps) {
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
    let holdTimer: number | null = null;
    let pointerStart = { x: 0, y: 0 };
    let suppressNextClick = false;

    const start = () => {
      setSourceEnabled(true);
      window.dispatchEvent(new CustomEvent(PRODUCT_VIDEO_ACTIVE_EVENT, { detail: playbackId }));
      setActive(true);
    };
    const stop = () => {
      setActive(false);
    };
    const stopAfterFocus = (event: FocusEvent) => {
      if (!trigger.contains(event.relatedTarget as Node | null)) stop();
    };

    const handlePointerEnter = () => {
      if (usesInViewPlayback) return;
      clearHoldTimer();
      holdTimer = window.setTimeout(start, 500);
    };
    const handlePointerLeave = () => {
      if (usesInViewPlayback) return;
      clearHoldTimer();
      stop();
    };
    const clearHoldTimer = () => {
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      holdTimer = null;
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!usesInViewPlayback || event.pointerType === 'mouse') return;
      lastMobileInteractionAt = Date.now();
      pointerStart = { x: event.clientX, y: event.clientY };
      clearHoldTimer();
      holdTimer = window.setTimeout(() => {
        suppressNextClick = true;
        start();
      }, 500);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!usesInViewPlayback || event.pointerType === 'mouse') return;
      if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 10) {
        clearHoldTimer();
      }
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (!usesInViewPlayback || event.pointerType === 'mouse') return;
      clearHoldTimer();
      // Kısa dokunuş ürün bağlantısını açar. Yalnızca yarım saniyelik bilinçli
      // basılı tutma videoyu seçer ve ardından gelen tıklamayı tüketir.
    };
    const handlePointerCancel = () => clearHoldTimer();
    const handleClickCapture = (event: MouseEvent) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    };
    const handleContextMenu = (event: Event) => {
      if (!usesInViewPlayback) return;
      event.preventDefault();
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
    trigger.addEventListener('pointerdown', handlePointerDown);
    trigger.addEventListener('pointermove', handlePointerMove);
    trigger.addEventListener('pointerup', handlePointerUp);
    trigger.addEventListener('pointercancel', handlePointerCancel);
    trigger.addEventListener('click', handleClickCapture, true);
    trigger.addEventListener('contextmenu', handleContextMenu);
    trigger.addEventListener('focusin', start);
    trigger.addEventListener('focusout', stopAfterFocus);
    window.addEventListener(PRODUCT_VIDEO_ACTIVE_EVENT, handleAnotherVideo);

    const observer = mayAutoPlayInView
      ? new IntersectionObserver(([entry]) => {
          const bounds = entry.boundingClientRect;
          mobileVideoCandidates.set(playbackId, {
            ratio: entry.isIntersecting ? entry.intersectionRatio : 0,
          centerDistance: Math.hypot(
            bounds.left + bounds.width / 2 - window.innerWidth / 2,
            bounds.top + bounds.height / 2 - window.innerHeight / 2,
          ),
            activate: start,
          });
          if (!entry.isIntersecting || entry.intersectionRatio < 0.24) stop();
          scheduleMobileSelection();
        }, { threshold: [0, 0.24, 0.62, 0.82], rootMargin: '-8% 0px -10%' })
      : null;
    observer?.observe(trigger);

    return () => {
      observer?.disconnect();
      mobileVideoCandidates.delete(playbackId);
      clearHoldTimer();
      trigger.removeEventListener('pointerenter', handlePointerEnter);
      trigger.removeEventListener('pointerleave', handlePointerLeave);
      trigger.removeEventListener('pointerdown', handlePointerDown);
      trigger.removeEventListener('pointermove', handlePointerMove);
      trigger.removeEventListener('pointerup', handlePointerUp);
      trigger.removeEventListener('pointercancel', handlePointerCancel);
      trigger.removeEventListener('click', handleClickCapture, true);
      trigger.removeEventListener('contextmenu', handleContextMenu);
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
      poster={poster}
      muted
      loop
      playsInline
      preload={priority ? 'metadata' : 'none'}
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
