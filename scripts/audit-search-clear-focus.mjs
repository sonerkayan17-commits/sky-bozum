import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'app/components/articles/ArticleExplorer.tsx');
const source = fs.readFileSync(file, 'utf8');
const failures = [];

if (!source.includes('function clearSearch()')) {
  failures.push('clearSearch yardımcı fonksiyonu bulunamadı.');
}
if (!source.includes("setQuery('');\n    window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }));")) {
  failures.push('Arama temizlendikten sonra odak arama alanına aktarılmıyor.');
}
if (!source.includes('onClick={clearSearch}')) {
  failures.push('Aramayı temizle düğmesi güvenli odak fonksiyonunu kullanmıyor.');
}
if (source.includes("onClick={() => setQuery('')}")) {
  failures.push('Odak kaybına yol açan doğrudan setQuery temizleme davranışı hâlâ mevcut.');
}

if (failures.length) {
  console.error('Arama temizleme odak denetimi başarısız:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Arama temizleme odağı doğrulandı.');
