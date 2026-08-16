type DeferredTask = () => void | Promise<void>;

/** Defers non-critical integrations until user intent or a safe fallback delay. */
export function deferClientTask(task: DeferredTask, delay = 30_000, eager = false) {
  let started = false;
  let timer = 0;
  const cleanup = () => {
    window.clearTimeout(timer);
    window.removeEventListener('click', run);
    window.removeEventListener('keydown', runFromKeyboard);
  };
  const run = () => {
    if (started) return;
    started = true;
    cleanup();
    void task();
  };
  const runFromKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') run();
  };

  timer = window.setTimeout(run, eager ? 0 : delay);
  if (!eager) {
    window.addEventListener('click', run, { passive: true, once: true });
    window.addEventListener('keydown', runFromKeyboard);
  }
  return cleanup;
}
