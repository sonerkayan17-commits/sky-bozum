'use client';

import { useEffect } from 'react';
import { isLocalMotionPreview } from '../lib/motion';

export default function MotionPreviewBridge() {
  useEffect(() => {
    if (!isLocalMotionPreview(window.location.hostname)) return;
    document.documentElement.dataset.motionPreview = 'true';
    return () => { delete document.documentElement.dataset.motionPreview; };
  }, []);

  return null;
}
