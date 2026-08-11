import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const explorerPath = path.join(root, 'app/components/articles/ArticleExplorer.tsx');
const source = fs.readFileSync(explorerPath, 'utf8');

const checks = [
  ['ortak yönlendirme yardımcısı mevcut', 'function revealAndFocus('],
  ['yardımcı hedefi görünür alana taşıyor', 'element.scrollIntoView({ behavior: preferredScrollBehavior(), block })'],
  ['yardımcı odağı hedefe aktarıyor', 'element.focus({ preventScroll: true })'],
  ['clearFilters arama alanını hedefliyor', "revealAndFocus(() => searchInputRef.current, 'center')"],
  ['openTopic sonuç arşivini hedefliyor', "revealAndFocus(() => archiveRef.current, 'start')"],
  ['sonuç arşivi programatik odak hedefi', 'id="article-archive" tabIndex={-1}'],
];

const failures = checks.filter(([, needle]) => !source.includes(needle));
if (failures.length) {
  console.error('Filtre odak sürekliliği denetimi başarısız:');
  for (const [label] of failures) console.error(`- ${label}`);
  process.exit(1);
}

console.log('Filtre odak sürekliliği doğrulandı: ortak yardımcı temizlemeyi aramaya, konu seçimini sonuç arşivine yönlendiriyor.');
