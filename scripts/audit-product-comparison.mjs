import { readFileSync } from 'node:fs';

const source = readFileSync('app/components/products/ProductCatalog.tsx', 'utf8');
const css = readFileSync('app/globals.css', 'utf8');

const checks = [
  ['Karşılaştırma seçili paketi merkez alıyor', source.includes('selectedIndex - 1') && source.includes('comparisonPacks')],
  ['Canlı fiyat ve stok verisi karşılaştırılıyor', source.includes("entry.stockCount") && source.includes("formatStoreMoney(entry.priceMinor)")],
  ['Karşılaştırmadan paket seçilebiliyor', source.includes("setSelectedId(pack.id)") && source.includes("aria-pressed={isSelected}")],
  ['Mobil karşılaştırma tek sütunda okunuyor', css.includes('.product-pack-comparison__grid{grid-template-columns:1fr}')],
];

let failed = 0;
for (const [label, result] of checks) {
  if (!result) failed += 1;
  console.log(`${result ? 'OK' : 'FAIL'} ${label}`);
}
if (failed) process.exit(1);
console.log(`Ürün karşılaştırma denetimi geçti (${checks.length}/${checks.length}).`);
