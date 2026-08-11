import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = 'app/bilgi-merkezi/sorun-cozme/[slug]/page.tsx';
const source = fs.readFileSync(path.join(root, file), 'utf8');

const required = [
  'aria-labelledby="troubleshooting-checks-title"',
  'id="troubleshooting-checks-title"',
  '<h3 className="text-lg font-black">{check.title}</h3>',
  'aria-labelledby="related-troubleshooting-guides-title"',
  'id="related-troubleshooting-guides-title"',
  '<h3 className="text-lg font-black leading-7">{article.title}</h3>',
];

for (const marker of required) {
  if (!source.includes(marker)) {
    console.error(`Başlık hiyerarşisi işareti eksik: ${marker}`);
    process.exit(1);
  }
}

if (source.includes('<p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Adım adım kontrol</p>')) {
  console.error('Adım adım kontrol bölümü hâlâ paragrafla adlandırılıyor.');
  process.exit(1);
}
if (source.includes('<h2 className="text-lg font-black">{check.title}</h2>')) {
  console.error('Kontrol adımları bölüm başlığıyla aynı h2 seviyesinde kalmış.');
  process.exit(1);
}

console.log('OK: Sorun çözme detayındaki bölüm ve kart başlıkları semantik hiyerarşiyi koruyor.');
