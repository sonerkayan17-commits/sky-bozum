import fs from 'node:fs';
const file = fs.readFileSync(new URL('../app/lib/troubleshooting.ts', import.meta.url), 'utf8');
const slugs = [...file.matchAll(/slug: '([^']+)'/g)].map(m => m[1]);
const titles = [...file.matchAll(/title: '([^']+)'/g)].map(m => m[1]);
const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
console.log(`Sorun çözme rehberi: ${slugs.length}`);
console.log(`Başlık alanı: ${titles.length}`);
if (duplicates.length) { console.error(`Tekrarlanan slug: ${[...new Set(duplicates)].join(', ')}`); process.exit(1); }
if (slugs.length < 10) { console.error('En az 10 sorun çözme rehberi bekleniyor.'); process.exit(1); }
console.log('Slug ve temel kapsam denetimi başarılı.');
