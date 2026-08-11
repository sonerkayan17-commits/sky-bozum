export type DialogNavigationKey = "Tab" | "Shift+Tab";

export function nextDialogFocusIndex(currentIndex: number, itemCount: number, key: DialogNavigationKey): number {
  if (itemCount <= 0) return -1;
  if (currentIndex < 0 || currentIndex >= itemCount) return key === "Shift+Tab" ? itemCount - 1 : 0;
  if (key === "Shift+Tab") return currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
  return currentIndex === itemCount - 1 ? 0 : currentIndex + 1;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((element) => {
    if (element.getAttribute("aria-hidden") === "true") return false;
    const style = window.getComputedStyle(element);
    return style.visibility !== "hidden" && style.display !== "none";
  });
}

export function trapDialogTab(event: KeyboardEvent, container: HTMLElement): boolean {
  if (event.key !== "Tab") return false;
  const focusable = getFocusableElements(container);
  if (!focusable.length) {
    event.preventDefault();
    container.focus();
    return true;
  }

  const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
  const nextIndex = nextDialogFocusIndex(currentIndex, focusable.length, event.shiftKey ? "Shift+Tab" : "Tab");
  const shouldWrap = currentIndex === -1 || (event.shiftKey && currentIndex === 0) || (!event.shiftKey && currentIndex === focusable.length - 1);
  if (!shouldWrap) return false;

  event.preventDefault();
  focusable[nextIndex]?.focus();
  return true;
}
