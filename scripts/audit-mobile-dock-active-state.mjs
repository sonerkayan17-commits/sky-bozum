import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const component = fs.readFileSync(path.join(root, 'app/components/QuickActionDock.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'app/styles/tools-production.css'), 'utf8');

const checks = [
  ['Aktif rota eşleştirme yardımcısı mevcut', component.includes('function routeIsActive')],
  ['Araçlar alt rotaları aktif kabul ediliyor', component.includes("activeRoutes: ['/araclar']")],
  ['Bilgi Merkezi alt rotaları aktif kabul ediliyor', component.includes("activeRoutes: ['/bilgi-merkezi']")],
  ['SSS rotası aktif kabul ediliyor', component.includes("activeRoutes: ['/sss']")],
  ['Aktif bağlantı aria-current kullanıyor', component.includes("aria-current={isActive ? 'page' : undefined}")],
  ['Aktif bağlantı görünür sınıf alıyor', component.includes("className={isActive ? 'is-active' : undefined}")],
  ['Aktif dock stili tanımlı', styles.includes('.quick-dock a.is-active')],
  ['Dekoratif ikonlar ekran okuyucudan gizli', component.includes('aria-hidden="true"')],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\nMobil dock aktif durum denetimi başarısız: ${failed}/${checks.length}`);
  process.exit(1);
}

console.log(`\nMobil dock aktif durum denetimi başarılı: ${checks.length}/${checks.length}`);
