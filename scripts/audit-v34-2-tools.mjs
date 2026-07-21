import fs from 'node:fs';

const page = fs.readFileSync(new URL('../app/araclar/page.tsx', import.meta.url), 'utf8');
const tools = fs.readFileSync(new URL('../app/lib/tools.ts', import.meta.url), 'utf8');
const checks = [
  ['ana sayfa dosyasına referans yok', !page.includes('app/page.tsx')],
  ['araç merkezi H1 mevcut', page.includes('<h1')],
  ['hızlı yollar mevcut', page.includes('quickPaths')],
  ['işlem sihirbazı bağlantısı mevcut', page.includes('/araclar/islem-sihirbazi')],
  ['oran hesapla bağlantısı mevcut', page.includes('/oran-hesapla')],
  ['tüm araçlar veri kaynağından geliyor', page.includes('toolPages.map')],
  ['şeffaf sonuç açıklaması mevcut', page.includes('kesin teklif')],
  ['canonical mevcut', page.includes("canonical: '/araclar'")],
  ['open graph mevcut', page.includes('openGraph')],
  ['sekiz araç tanımlı', (tools.match(/href: '\/araclar\//g) || []).length === 8],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? '✓' : '✗'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`\nV34.2 audit: ${checks.length}/${checks.length} başarılı.`);
