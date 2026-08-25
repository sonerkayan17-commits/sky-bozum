import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const quickDockPath = path.join(root, 'app/components/QuickActionDock.tsx');
const trustDockPath = path.join(root, 'app/components/TrustQuickDock.tsx');
const trustPagePath = path.join(root, 'app/guven-merkezi/page.tsx');
const contactPagePath = path.join(root, 'app/iletisim/page.tsx');

const read = (file) => fs.readFileSync(file, 'utf8');
const quickDock = read(quickDockPath);

const checks = [
  ['Genel dock pathname bilgisini kullanıyor', quickDock.includes('usePathname')],
  ['Hesapla, rehber, S.S.S. ve forum hızlı erişimleri mevcut', ['Hesapla', 'Rehber', 'S.S.S.', 'Forum'].every((label) => quickDock.includes(label))],
  ['WhatsApp hızlı erişimi mevcut', quickDock.includes('quick-dock-primary') && quickDock.includes('WhatsApp')],
  ['Birleştirilen Güven Merkezi eski özel dock kullanmıyor ve İletişim güvenlik alanına yönleniyor', !fs.existsSync(trustDockPath) && read(trustPagePath).includes("permanentRedirect('/iletisim#guvenlik')")],
  ['İletişim sayfası birleşik güvenlik/iletişim hedefi olarak mevcut', fs.existsSync(contactPagePath)],
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
