import fs from 'node:fs';

const source = fs.readFileSync('app/components/articles/ArticleExplorer.tsx', 'utf8');
const failures = [];

if (!source.includes("matchMedia('(prefers-reduced-motion: reduce)')")) {
  failures.push('Hareket azaltma tercihi kontrol edilmiyor.');
}
if (!source.includes('element.scrollIntoView({ behavior: preferredScrollBehavior(), block })')) {
  failures.push('Programatik kaydırmalar hareket tercihine duyarlı değil.');
}
if (source.includes("behavior: 'smooth'")) {
  failures.push('Zorunlu smooth kaydırma kullanımı kaldı.');
}

if (failures.length) {
  console.error('Reduced-motion auditi başarısız:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Reduced-motion auditi geçti.');
