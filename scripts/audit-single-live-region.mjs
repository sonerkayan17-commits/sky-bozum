import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'app/components/articles/ArticleExplorer.tsx');
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['Gizli sonuç durumu canlı bölge olarak korunuyor', source.includes('id="article-result-status"') && source.includes('role="status"') && source.includes('aria-live="polite"')],
  ['Görünür bekleme kartında ikinci role=status bulunmuyor', !source.includes('className="premium-card mt-5 p-10 text-center" role="status"')],
  ['Görünür bekleme kartında ikinci aria-live bulunmuyor', !source.includes('className="premium-card mt-5 p-10 text-center" aria-live=')],
  ['Bekleme kartı canlı durumu ikinci kez açıklama olarak kullanmıyor', !source.includes('className="premium-card mt-5 p-10 text-center" aria-describedby="article-result-status"')],
  ['Canlı bölge bekleme metnini ikinci kez duyurmuyor', !source.includes('Arama sonuçları güncelleniyor.')],
  ['Canlı sonuç yalnız tamamlanan aramada üretiliyor', /const resultStatus = !hasResultInteraction \|\| searchIsPending[\s\S]*?\? ''/.test(source)],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log(`Tek canlı bölge denetimi: ${checks.length}/${checks.length} başarılı.`);
