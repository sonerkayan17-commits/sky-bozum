export type ScheduledTask = (callback: () => void) => () => void;

export type SupersedingTaskController = {
  schedule(callback: () => void): void;
  cancel(): void;
  dispose(): void;
  isPending(): boolean;
  isDisposed(): boolean;
};

export function createSupersedingTaskController(scheduleTask: ScheduledTask): SupersedingTaskController {
  let cancelPending: (() => void) | undefined;
  let disposed = false;
  let generation = 0;

  const cancel = () => {
    generation += 1;
    const cancelCurrent = cancelPending;
    cancelPending = undefined;
    try {
      cancelCurrent?.();
    } catch {
      // Cancelling deferred UI work must never break the interface.
    }
  };

  return {
    schedule(callback) {
      if (disposed) return;
      cancel();
      const taskGeneration = generation;
      try {
        const cancelTask = scheduleTask(() => {
          if (disposed || taskGeneration !== generation) return;
          cancelPending = undefined;
          callback();
        });
        if (!disposed && taskGeneration === generation) cancelPending = cancelTask;
        else {
          try {
            cancelTask();
          } catch {
            // A scheduler cleanup failure is isolated from the UI lifecycle.
          }
        }
      } catch {
        cancelPending = undefined;
      }
    },
    cancel,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancel();
    },
    isPending: () => cancelPending !== undefined,
    isDisposed: () => disposed,
  };
}
