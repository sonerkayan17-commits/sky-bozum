import fs from 'node:fs';

const file = 'app/components/articles/ArticleExplorer.tsx';
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['Sıralama etiketi açık id/htmlFor ilişkisi kullanıyor', source.includes('htmlFor="article-sort"') && source.includes('id="article-sort"')],
  ['Kategori etiketi açık id/htmlFor ilişkisi kullanıyor', source.includes('htmlFor="article-category"') && source.includes('id="article-category"')],
  ['Sıralama kontrolünde görünür etiketi gölgeleyen aria-label yok', !source.includes('aria-label="Rehber sıralaması"')],
  ['Kategori kontrolünde görünür etiketi gölgeleyen aria-label yok', !source.includes('aria-label="Rehber kategorisi"')],
];
const failures = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${label}`);
if (failures.length) process.exit(1);
console.log('Filtre etiket ilişkileri doğrulandı.');
