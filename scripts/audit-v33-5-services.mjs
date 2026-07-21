import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const serviceDetail = fs.readFileSync(path.join(root, 'app/components/services/ServiceDetail.tsx'), 'utf8');
const requiredFiles = [
  'app/components/services/TelekomPokusPremiumSections.tsx',
  'app/components/services/DigitalCodePremiumSections.tsx',
];
const requiredSlugs = [
  'turk-telekom-mobil-odeme', 'pokus', 'razer-gold-tl', 'razer-gold-usd', 'itunes-apple', 'steam',
];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
const missingBindings = requiredSlugs.filter((slug) => !serviceDetail.includes(`service.slug === '${slug}'`));

console.log('# V33.5 Hizmet Sayfaları Denetimi');
console.log(`- Özel bileşen dosyaları: ${requiredFiles.length - missingFiles.length}/${requiredFiles.length}`);
console.log(`- Hizmet bağlamaları: ${requiredSlugs.length - missingBindings.length}/${requiredSlugs.length}`);
console.log(`- Eksik dosya: ${missingFiles.length}`);
console.log(`- Eksik bağlama: ${missingBindings.length}`);

if (missingFiles.length || missingBindings.length) {
  if (missingFiles.length) console.error('Eksik dosyalar:', missingFiles.join(', '));
  if (missingBindings.length) console.error('Eksik bağlamalar:', missingBindings.join(', '));
  process.exit(1);
}
