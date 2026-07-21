import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'app/bilgi-merkezi/page.tsx');
const source = fs.readFileSync(pagePath, 'utf8');

const checks = [
  ['Dinamik metadata üretimi', /export async function generateMetadata/],
  ['Filtreli görünüm tespiti', /hasFilteredView/],
  ['Arama sorgusu indeks koruması', /params\.q\?\.trim\(\)/],
  ['Kategori filtresi indeks koruması', /params\.kategori && params\.kategori !== 'Tümü'/],
  ['Konu filtresi indeks koruması', /params\.konu && params\.konu !== 'Tümü'/],
  ['Sıralama filtresi indeks koruması', /params\.sirala && params\.sirala !== 'popular'/],
  ['Filtreli sayfalar noindex', /index: false, follow: true/],
  ['Canonical ana merkeze bağlı', /canonical: '\/bilgi-merkezi'/],
  ['Varsayılan görünüm indexlenebilir', /index: true,[\s\S]*follow: true/],
];

let failed = 0;
console.log('# V37.3 Parametreli Sayfa İndeks Hijyeni');
for (const [name, pattern] of checks) {
  const ok = pattern.test(source);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\n${failed} kontrol başarısız.`);
  process.exit(1);
}
console.log(`\nPASS ${checks.length}/${checks.length} indeks hijyeni kontrolü başarıyla tamamlandı.`);
