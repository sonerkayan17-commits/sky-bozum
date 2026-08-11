import fs from 'node:fs';

const file = 'app/components/articles/ArticleExplorer.tsx';
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['filtre paneli arama bölgesi', 'role="search"'],
  ['filtre paneli erişilebilir başlığı', 'aria-labelledby="article-filter-title"'],
  ['filtre paneli gizli başlığı', 'id="article-filter-title" className="sr-only">Rehber arama ve filtreleme</h2>'],
  ['filtre temizleme sonuç hedefi', 'onClick={clearFilters} aria-controls="article-archive"'],
];

const missing = checks.filter(([, token]) => !source.includes(token)).map(([label]) => label);
if (missing.length) {
  console.error(`Filtre landmark denetimi başarısız: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Filtre landmark ve temizleme ilişkileri doğrulandı.');
