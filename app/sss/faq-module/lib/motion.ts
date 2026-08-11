export interface MotionMediaQueryPort {
  matchMedia?: (query: string) => { matches: boolean };
}

export function prefersReducedMotion(port: MotionMediaQueryPort | undefined = typeof window === "undefined" ? undefined : window): boolean {
  try {
    return Boolean(port?.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  } catch {
    return false;
  }
}

export function accessibleScrollBehavior(port?: MotionMediaQueryPort): ScrollBehavior {
  return prefersReducedMotion(port) ? "auto" : "smooth";
}

export function scrollIntoViewAccessible(
  element: Element | null | undefined,
  options: Omit<ScrollIntoViewOptions, "behavior"> = {},
  port?: MotionMediaQueryPort,
): void {
  element?.scrollIntoView({ ...options, behavior: accessibleScrollBehavior(port) });
}
