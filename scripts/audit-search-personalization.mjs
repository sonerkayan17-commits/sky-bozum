import fs from 'node:fs';

const source = fs.readFileSync('app/components/SiteSearch.tsx', 'utf8');
const provider = fs.readFileSync('app/lib/personalization.ts', 'utf8');
const checks = [
  ['kişiselleştirme açık rızaya bağlı', source.includes("consent !== 'accepted'")],
  ['yakın geçmiş cihazda sınırlı tutuluyor', provider.includes('recentPaths') && provider.includes('.slice(0, 6)')],
  ['arama yalnız ilgili sonuçlara küçük tercih puanı veriyor', source.includes('relevance > 0 && preferredHrefs.has(item.href) ? 1.5 : 0')],
  ['arama geçmişini temizleme kontrolü var', source.includes('clearRecentHistory') && source.includes('Geçmişi temizle')],
  ['sunucuya kişisel arama profili gönderilmiyor', !/setDoc\(|addDoc\(|localStorage\.setItem\([^)]*query/.test(source)],
  ['kullanıcıya sıralama davranışı açıklanıyor', source.includes('Son ziyaretler yalnız eşit sonuçlarda öne alınır')],
];
let failed = 0;
for (const [label, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`); if (!ok) failed += 1; }
if (failed) process.exit(1);
console.log(`\n${checks.length}/${checks.length} arama kişiselleştirme denetimi geçti.`);
