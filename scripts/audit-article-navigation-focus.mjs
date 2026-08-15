import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const detail = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/[slug]/page.tsx'), 'utf8');
const learning = fs.readFileSync(path.join(root, 'app/components/articles/ArticleLearningPath.tsx'), 'utf8');
const supportLink = fs.readFileSync(path.join(root, 'app/components/articles/ArticleSupportLink.tsx'), 'utf8');

const detailMarkers = [
  'href="/bilgi-merkezi" className="focus-ring rounded-md"',
  'href={`/bilgi-merkezi/kategori/${slugifyCategory(article.category)}`} className="focus-ring rounded-md"',
  'href={`/bilgi-merkezi/${item.slug}`} className="focus-ring rounded-md"',
];
for (const marker of detailMarkers) {
  if (!detail.includes(marker)) {
    console.error(`Makale kapanış navigasyonunda görünür klavye odağı eksik: ${marker}`);
    process.exit(1);
  }
}

if (!supportLink.includes('aria-label="WhatsApp üzerinden destek alın; yeni sekmede açılır"') || !supportLink.includes('className="focus-ring rounded-md"')) {
  console.error('Makale destek bağlantısında görünür klavye odağı veya yeni sekme açıklaması eksik.');
  process.exit(1);
}

if (!learning.includes('href={`/bilgi-merkezi/${previous.slug}`} className="focus-ring rounded-md"') ||
    !learning.includes('href={`/bilgi-merkezi/${next.slug}`} className="focus-ring rounded-md"')) {
  console.error('Öğrenme yolu önceki/sonraki bağlantılarında görünür klavye odağı eksik.');
  process.exit(1);
}

console.log('OK: Makale kapanışı, dış destek ve öğrenme yolu bağlantıları görünür klavye odağı taşıyor.');
