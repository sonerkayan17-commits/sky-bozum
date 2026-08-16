type DeferredTask = () => void | Promise<void>;
type DeferClientTaskOptions = {
  delay?: number;
  eager?: boolean;
  intentEvents?: boolean;
};

/** Defers non-critical integrations until user intent or a safe fallback delay. */
export function deferClientTask(
  task: DeferredTask,
  delayOrOptions: number | DeferClientTaskOptions = 30_000,
  eagerOverride = false,
) {
  const options = typeof delayOrOptions === 'number'
    ? { delay: delayOrOptions, eager: eagerOverride, intentEvents: true }
    : delayOrOptions;
  const delay = options.delay ?? 30_000;
  const eager = options.eager ?? false;
  const intentEvents = options.intentEvents ?? true;
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
  if (!eager && intentEvents) {
    window.addEventListener('click', run, { passive: true, once: true });
    window.addEventListener('keydown', runFromKeyboard);
  }
  return cleanup;
}
