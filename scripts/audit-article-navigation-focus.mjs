import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const detailPath = path.join(root, 'app/bilgi-merkezi/[slug]/page.tsx');
const learningPath = path.join(root, 'app/components/articles/ArticleLearningPath.tsx');
const detail = fs.readFileSync(detailPath, 'utf8');
const learning = fs.readFileSync(learningPath, 'utf8');

const detailMarkers = [
  'href="/bilgi-merkezi" className="focus-ring rounded-md"',
  'href={`/bilgi-merkezi/kategori/${slugifyCategory(article.category)}`} className="focus-ring rounded-md"',
  'href={`/bilgi-merkezi/${item.slug}`} className="focus-ring rounded-md"',
  'aria-label="WhatsApp üzerinden destek alın; yeni sekmede açılır" className="focus-ring rounded-md"',
];
for (const marker of detailMarkers) {
  if (!detail.includes(marker)) {
    console.error(`Makale kapanış navigasyonunda görünür klavye odağı eksik: ${marker}`);
    process.exit(1);
  }
}
const whatsappFocusCount = (detail.match(/aria-label="WhatsApp üzerinden destek alın; yeni sekmede açılır" className="focus-ring rounded-md"/g) ?? []).length;
if (whatsappFocusCount !== 2) {
  console.error(`İki WhatsApp bağlantısının da focus-ring taşıması bekleniyor; bulunan: ${whatsappFocusCount}`);
  process.exit(1);
}
if (!learning.includes('href={`/bilgi-merkezi/${previous.slug}`} className="focus-ring rounded-md"') ||
    !learning.includes('href={`/bilgi-merkezi/${next.slug}`} className="focus-ring rounded-md"')) {
  console.error('Öğrenme yolu önceki/sonraki bağlantılarında görünür klavye odağı eksik.');
  process.exit(1);
}
console.log('OK: Makale kapanışı, dış destek ve öğrenme yolu bağlantıları görünür klavye odağı taşıyor.');
