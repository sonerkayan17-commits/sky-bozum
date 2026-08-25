import { readFileSync } from 'node:fs';

const taxonomy = readFileSync('app/lib/forumTaxonomy.ts', 'utf8');
const guidance = readFileSync('app/lib/forumGuidance.ts', 'utf8');
const topicPage = readFileSync('app/topluluk/forum/[slug]/[category]/[topic]/page.tsx', 'utf8');

const starterSlugs = [...taxonomy.matchAll(/starter\([^,]+,[^,]+,'([^']+)'/g)].map((match) => match[1]);
const guidedSlugs = new Set([...guidance.matchAll(/^\s*'([^']+)':/gm)].map((match) => match[1]));
const missing = starterSlugs.filter((slug) => !guidedSlugs.has(slug));

if (starterSlugs.length !== 30) throw new Error(`Beklenen 30 başlangıç konusu yerine ${starterSlugs.length} bulundu.`);
if (missing.length) throw new Error(`Rehber yönlendirmesi eksik konular: ${missing.join(', ')}`);
if (!topicPage.includes('getForumGuidance') || !topicPage.includes('forum-topic-guidance')) {
  throw new Error('Konu detayında rehber yönlendirme alanı bulunamadı.');
}

console.log(`OK: ${starterSlugs.length} forum başlangıç konusunun tamamında konuya özel kontrol listesi ve ilgili rehber bağlantıları var.`);
