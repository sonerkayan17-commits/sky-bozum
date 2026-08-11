import fs from 'node:fs';

const source = fs.readFileSync('app/components/Navbar.tsx', 'utf8');
const checks = [
  ['dialog semantics', source.includes('role="dialog"') && source.includes('aria-modal="true"')],
  ['focus trap', source.includes("event.key !== 'Tab'") && source.includes('last.focus()') && source.includes('first.focus()')],
  ['escape close', source.includes("event.key === 'Escape'")],
  ['focus restoration', source.includes('menuButtonRef.current?.focus()')],
  ['route close', source.includes('}, [pathname]);')],
  ['backdrop close', source.includes('aria-label="Mobil menüyü kapat"')],
  ['body scroll lock', source.includes("document.body.style.overflow = 'hidden'")],
];

const failures = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${label}`);
if (failures.length) process.exit(1);
console.log(`Mobile navigation UX: ${checks.length}/${checks.length} başarılı`);
