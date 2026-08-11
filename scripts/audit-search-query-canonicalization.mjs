import fs from 'node:fs';

const source = fs.readFileSync('app/components/articles/ArticleExplorer.tsx', 'utf8');
const checks = [
  ['ortak kanonik sorgu yardımcısı', /function canonicalizeQuery\(value: string\)/],
  ['uç boşluk temizliği', /value\.trim\(\)\.replace\(\/\\s\+\/g, ' '\)\.slice\(0, 100\)/],
  ['URL geri yüklemede kanonik sorgu', /const nextQuery = canonicalizeQuery\(params\.get\('q'\) \?\? ''\)/],
  ['URL yazımında kanonik sorgu', /const boundedQuery = canonicalizeQuery\(query\)/],
  ['arama eşleştirmesinde kanonik sorgu', /normalize\(canonicalDeferredQuery\)/],
  ['benzersiz arama tokenları', /const tokens = \[\.\.\.new Set\(needle\.split\(\/\\s\+\/\)\.filter\(Boolean\)\)\]/],
];

let failed = false;
for (const [label, pattern] of checks) {
  if (!pattern.test(source)) {
    console.error(`✗ ${label}`);
    failed = true;
  } else {
    console.log(`✓ ${label}`);
  }
}
if (failed) process.exit(1);
console.log(`Arama sorgusu kanonikleştirme denetimi geçti (${checks.length} kontrol).`);
