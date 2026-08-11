import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const quickDockPath = path.join(root, 'app/components/QuickActionDock.tsx');
const trustDockPath = path.join(root, 'app/components/TrustQuickDock.tsx');
const trustPagePath = path.join(root, 'app/guven-merkezi/page.tsx');

const read = (file) => fs.readFileSync(file, 'utf8');
const quickDock = read(quickDockPath);
const trustDock = read(trustDockPath);
const trustPage = read(trustPagePath);

const checks = [
  ['Genel dock pathname bilgisini kullanıyor', quickDock.includes('usePathname')],
  ['Güven Merkezi özel dock rotası tanımlı', quickDock.includes("'/guven-merkezi'")],
  ['Özel dock rotasında genel dock render edilmiyor', quickDock.includes('if (hasDedicatedDock) return null')],
  ['Güven Merkezi özel dock bileşeni mevcut', trustDock.includes('Güven Merkezi hızlı işlemler')],
  ['Güven Merkezi sayfası özel dock bileşenini kullanıyor', trustPage.includes('<TrustQuickDock />')],
  ['Genel dock diğer rotalarda korunuyor', quickDock.includes('aria-label="Hızlı işlemler"')],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\nMobil dock UX denetimi başarısız: ${failed}/${checks.length}`);
  process.exit(1);
}

console.log(`\nMobil dock UX denetimi başarılı: ${checks.length}/${checks.length}`);
