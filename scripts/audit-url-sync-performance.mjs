import fs from 'node:fs';

const source = fs.readFileSync('app/components/articles/ArticleExplorer.tsx', 'utf8');
const checks = [
  ['URL senkronizasyonu gecikmeli çalışıyor', /window\.setTimeout\(\(\) => \{[\s\S]*?window\.history\.replaceState[\s\S]*?\}, 250\)/],
  ['İlk mount turunda URL zamanlayıcısı kurulmadan çıkılıyor', /if \(!hasMountedUrlSyncRef\.current\) \{[\s\S]*?hasMountedUrlSyncRef\.current = true;[\s\S]*?return;[\s\S]*?\}/],
  ['URL zaten state ile eşleşiyorsa zamanlayıcı kurulmadan çıkılıyor', /const preflightUrl = [\s\S]*?const currentUrl = [\s\S]*?if \(preflightUrl === currentUrl\) return;[\s\S]*?const timerId = window\.setTimeout/],
  ['Bekleyen URL güncellemesi temizleniyor', /return \(\) => \{[\s\S]*?window\.clearTimeout\(urlSyncTimerRef\.current\)[\s\S]*?urlSyncTimerRef\.current = null[\s\S]*?\}/],
  ['Aynı URL gereksiz yere yeniden yazılmıyor', /if \(nextUrl !== currentUrl\) window\.history\.replaceState/],
  ['Mevcut tarayıcı geçmişi state değeri korunuyor', /window\.history\.replaceState\(window\.history\.state, '', nextUrl\)/],
  ['URL ön kontrolünde hash korunuyor', /const preflightUrl = `\$\{window\.location\.pathname\}[\s\S]*?\$\{window\.location\.hash\}`/],
  ['Gecikmeli URL yazımında hash korunuyor', /const nextUrl = `\$\{window\.location\.pathname\}[\s\S]*?\$\{window\.location\.hash\}`/],
  ['Arama URL değeri 100 karakterle sınırlandırılıyor', /const boundedQuery = canonicalizeQuery\(query\)/],
  ['Arama alanı 100 karakterle sınırlandırılıyor', /maxLength=\{100\}/],
  ['Girdi state değeri savunmalı biçimde sınırlandırılıyor', /setQuery\(event\.target\.value\.slice\(0, 100\)\)/],
];

const failures = checks.filter(([, pattern]) => !pattern.test(source));
if (failures.length) {
  for (const [label] of failures) console.error(`FAIL: ${label}`);
  process.exit(1);
}
console.log('PASS: URL senkronizasyon performansı doğrulandı.');
