'use client';

import { useEffect, useState } from 'react';

export const ANNOUNCEMENT =
  'Razer Gold ve mobil ödeme işlemleri için güncel oran alın.';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Set state asynchronously to satisfy react-hooks/set-state-in-effect and avoid hydration mismatches.
    const checkSession = async () => {
      try {
        const isClosed = sessionStorage.getItem('announcement-closed') === 'true';
        if (!isClosed && isMounted) {
          setVisible(true);
        }
      } catch {
        // Fallback to visible if sessionStorage is blocked or unavailable.
        if (isMounted) {
          setVisible(true);
        }
      }
    };

    const timer = setTimeout(() => {
      void checkSession();
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="border-b border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" />
          <p className="text-sm font-semibold leading-5">
            {ANNOUNCEMENT}
          </p>
        </div>

        <button
          type="button"
          aria-label="Duyuruyu kapat"
          onClick={() => {
            setVisible(false);
            try {
              sessionStorage.setItem(
                'announcement-closed',
                'true'
              );
            } catch {
              // Fail silently if sessionStorage writing fails in private modes.
            }
          }}
          className="rounded-lg p-1.5 transition hover:bg-emerald-100 dark:hover:bg-emerald-900"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
