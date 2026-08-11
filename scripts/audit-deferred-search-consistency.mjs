import fs from 'node:fs';

const source = fs.readFileSync('app/components/articles/ArticleExplorer.tsx', 'utf8');
const checks = [
  ['ertelenmiş sorgu kanonikleştiriliyor', /const canonicalDeferredQuery = canonicalizeQuery\(deferredQuery\)/],
  ['bekleyen arama durumu hesaplanıyor', /const searchIsPending = canonicalizeQuery\(query\) !== canonicalDeferredQuery/],
  ['arama eşleştirmesi ertelenmiş kanonik sorguyu kullanıyor', /const needle = normalize\(canonicalDeferredQuery\)/],
  ['keşif modu ertelenmiş sorguyla hizalı', /const hasDeferredQuery = Boolean\(canonicalDeferredQuery\)/],
  ['bekleyen arama canlı bölgede ikinci kez duyurulmuyor', /const resultStatus = !hasResultInteraction \|\| searchIsPending[\s\S]*?\? ''/],
  ['sonuç arşivi bekleme durumunu bildiriyor', /aria-busy=\{searchIsPending\}/],
  ['beklerken eski sonuç kartları gösterilmiyor', /searchIsPending \? <div className=\"premium-card mt-5 p-10 text-center\"/],
  ['bekleme sırasında görünür durum mesajı var', /Sonuçlar güncelleniyor/],
  ['beklerken eski öneriler gizleniyor', /!searchIsPending && recommendations.length > 0/],
  ['filtre özeti bekleme durumuyla hizalı', /searchIsPending \? 'Eşleşmeler güncelleniyor…' : <>/],
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
console.log(`Ertelenmiş arama tutarlılığı denetimi geçti (${checks.length} kontrol).`);
