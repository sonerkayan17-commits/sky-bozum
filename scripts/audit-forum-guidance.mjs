import { readFileSync } from 'node:fs';

const taxonomy = readFileSync('app/lib/forumTaxonomy.ts', 'utf8');
const guidance = readFileSync('app/lib/forumGuidance.ts', 'utf8');
const topicPage = readFileSync('app/topluluk/forum/[slug]/[category]/[topic]/page.tsx', 'utf8');

const starterSlugs = [...taxonomy.matchAll(/starter\([^,]+,[^,]+,'([^']+)'/g)].map((match) => match[1]);
const secondTopicBlock = taxonomy.split('const forumSecondTopicSeeds:SecondTopicSeed[]=[')[1]?.split('];')[0] ?? '';
const secondTopicCount = (secondTopicBlock.match(/sectionSlug:/g) ?? []).length;
const guidedSlugs = new Set([...guidance.matchAll(/^\s*'([^']+)':/gm)].map((match) => match[1]));
const missing = starterSlugs.filter((slug) => !guidedSlugs.has(slug));

if (!taxonomy.includes('forumSecondTopicSeeds') || !taxonomy.includes('getForumTopics')) throw new Error('İkinci yönetim konuları veya kategori sorgusu bulunamadı.');
if (secondTopicCount !== 30) throw new Error(`Beklenen 30 ikinci yönetim konusu yerine ${secondTopicCount} bulundu.`);
if (!topicPage.includes('sectionSlug')) throw new Error('İkinci konular için bölüm bazlı rehber yönlendirmesi bulunamadı.');
if (starterSlugs.length !== 30) throw new Error(`Beklenen 30 ilk başlangıç konusu yerine ${starterSlugs.length} bulundu.`);
if (missing.length) throw new Error(`Rehber yönlendirmesi eksik konular: ${missing.join(', ')}`);
if (!topicPage.includes('getForumGuidance') || !topicPage.includes('forum-topic-guidance')) {
  throw new Error('Konu detayında rehber yönlendirme alanı bulunamadı.');
}

console.log(`OK: ${starterSlugs.length} ilk konu ve ${secondTopicCount} ikinci yönetim konusu; toplam 60 public forum içeriği doğrulandı.`);
