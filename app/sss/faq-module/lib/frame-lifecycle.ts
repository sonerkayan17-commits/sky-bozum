export type AnimationFramePort = {
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(handle: number): void;
};

export type FrameLifecycle = {
  schedule(callback: () => void, frameCount?: number): () => void;
  cancelAll(): void;
  dispose(): void;
  isDisposed(): boolean;
};

function browserAnimationFramePort(): AnimationFramePort | undefined {
  if (typeof window === "undefined") return undefined;
  return {
    requestAnimationFrame: (callback) => window.requestAnimationFrame(callback),
    cancelAnimationFrame: (handle) => window.cancelAnimationFrame(handle),
  };
}

export function createFrameLifecycle(port: AnimationFramePort | undefined = browserAnimationFramePort()): FrameLifecycle {
  const handles = new Set<number>();
  let disposed = false;

  const cancelHandle = (handle: number) => {
    handles.delete(handle);
    try {
      port?.cancelAnimationFrame(handle);
    } catch {
      // Browser lifecycle changes must never break the UI.
    }
  };

  const schedule = (callback: () => void, frameCount = 1) => {
    if (disposed || !port) return () => undefined;
    let cancelled = false;
    let currentHandle: number | undefined;
    let remaining = Math.max(1, Math.trunc(frameCount) || 1);

    const run = () => {
      if (currentHandle !== undefined) handles.delete(currentHandle);
      currentHandle = undefined;
      if (disposed || cancelled) return;
      remaining -= 1;
      if (remaining > 0) {
        try {
          currentHandle = port.requestAnimationFrame(run);
          handles.add(currentHandle);
        } catch {
          cancelled = true;
        }
        return;
      }
      callback();
    };

    try {
      currentHandle = port.requestAnimationFrame(run);
      handles.add(currentHandle);
    } catch {
      cancelled = true;
    }

    return () => {
      cancelled = true;
      if (currentHandle !== undefined) cancelHandle(currentHandle);
      currentHandle = undefined;
    };
  };

  const cancelAll = () => {
    for (const handle of [...handles]) cancelHandle(handle);
  };

  return {
    schedule,
    cancelAll,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAll();
    },
    isDisposed: () => disposed,
  };
}
