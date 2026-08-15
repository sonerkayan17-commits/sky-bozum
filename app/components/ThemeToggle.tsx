'use client';

import { useEffect, useState } from 'react';

type SiteTheme = 'dark' | 'light';

const storageKey = 'sky-color-theme';

function applyTheme(theme: SiteTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  try { window.localStorage.setItem(storageKey, theme); } catch { /* The choice remains active for this visit. */ }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f6fa' : '#090b10');
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = nextTheme === 'light' ? 'Açık temaya geç' : 'Koyu temaya geç';

  return (
    <button
      type="button"
      className="theme-toggle focus-ring"
      aria-label={label}
      title={label}
      aria-pressed={theme === 'light'}
      onClick={() => { setTheme(nextTheme); applyTheme(nextTheme); }}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3.6"/><path strokeLinecap="round" d="M12 2.7v2M12 19.3v2M2.7 12h2M19.3 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4"/></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20.3 15.2A8.7 8.7 0 0 1 8.8 3.7a8.7 8.7 0 1 0 11.5 11.5Z"/></svg>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
