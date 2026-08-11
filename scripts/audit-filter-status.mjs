import fs from 'node:fs';

const source = fs.readFileSync('app/components/articles/ArticleExplorer.tsx', 'utf8');
const checks = [
  ['kalıcı sonuç durum metni', 'const resultStatus ='],
  ['aktif sıralama etiketi', "const activeSortLabel = sortOptions.find((item) => item.value === sort)?.label ?? 'En Çok Sorulanlar';"],
  ['sonuç duyurusunda sıralama bağlamı', 'Sıralama: ${activeSortLabel}.'],
  ['durum rolü', 'role="status"'],
  ['nazik canlı bildirim', 'aria-live="polite"'],
  ['atomik canlı bildirim', 'aria-atomic="true"'],
  ['görsel sayaç tekrarını gizleme', `aria-hidden="true">{searchIsPending ? 'Eşleşmeler güncelleniyor…' : <><strong className="text-white">{results.length}</strong> eşleşen rehber</>}`],
];

const missing = checks.filter(([, token]) => !source.includes(token));
if (missing.length) {
  console.error('Filtre durum bildirimi eksik:');
  for (const [label] of missing) console.error(`- ${label}`);
  process.exit(1);
}
console.log('Filtre ve arama sonuçları için kalıcı canlı durum bildirimi doğrulandı.');
