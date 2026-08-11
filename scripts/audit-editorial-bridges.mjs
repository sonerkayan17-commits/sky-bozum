import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const libDir = path.join(root, 'app', 'lib');
const articleFiles = fs.readdirSync(libDir)
  .filter((name) => (/Articles|featuredArticles|hepsipayArticles/.test(name) || name === 'site.ts') && name.endsWith('.ts'))
  .map((name) => path.join(libDir, name));
const sources = articleFiles.map((file) => ({ file, text: fs.readFileSync(file, 'utf8') }));
const all = sources.map((item) => item.text).join('\n');
const slugs = [...all.matchAll(/["']?slug["']?\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const titles = [...all.matchAll(/["']?title["']?\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const serviceSlugs = [...all.matchAll(/["']?serviceSlug["']?\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const oldYears = [...all.matchAll(/\b(201[0-9]|202[0-4])\b/g)].map((match) => match[0]);
const sentences = [...all.matchAll(/["'`]([^"'`]{70,280})["'`]/g)]
  .map((match) => match[1].replace(/\s+/g, ' ').trim())
  .filter((value) => /[.!?]$/.test(value));
const repeated = [...new Map(sentences.map((sentence) => [sentence, sentences.filter((item) => item === sentence).length])).entries()]
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]);

const bridgeSource = fs.readFileSync(path.join(root, 'app', 'lib', 'contentBridges.ts'), 'utf8');
const bridgeTargets = [...bridgeSource.matchAll(/articleSlug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const missingBridgeTargets = bridgeTargets.filter((slug) => !slugs.includes(slug));
const bannedEditorialBoilerplate = [
  'Bir kartın veya limitin belirli bir markada geçmesi, o markadaki bütün ürünlerin ve bütün satış kanallarının kapsama dahil olduğu anlamına gelmeyebilir.',
  'Sky Bozum Bilgi Merkezi, bozumla doğrudan veya dolaylı ilişkisi bulunan ödeme araçlarını kullanıcıların doğru bilgiye ulaşması için kapsar.',
  'Bilgi Merkezi’nde yer alması Sky Bozum’un bu ürünü bozduğu anlamına gelir mi?',
  'Limit veya bakiye herkese aynı mı tanımlanır?',
];
const remainingBoilerplate = bannedEditorialBoilerplate.filter((text) => all.includes(text));
const duplicatedNedirQuestions = [...all.matchAll(/Nedir nedir\?/g)].length;
const reviewedDates = [...all.matchAll(/updatedAt["']?\s*:\s*["']2026-07-28/g)].length;
const report = {
  generatedAt: new Date().toISOString(),
  articleCount: new Set(slugs).size,
  titleCount: titles.length,
  articlesWithExplicitServiceBridge: serviceSlugs.length,
  oldYearMentions: [...new Set(oldYears)],
  repeatedLongSentences: repeated.slice(0, 30).map(([text, count]) => ({ count, text })),
  missingBridgeTargets,
  remainingBoilerplate,
  duplicatedNedirQuestions,
  reviewedDates,
};
if (process.env.AUDIT_WRITE_REPORTS === '1') {
  fs.writeFileSync(path.join(root, 'EDITORIAL-BRIDGE-AUDIT.json'), JSON.stringify(report, null, 2) + '\n');
}
if (missingBridgeTargets.length || remainingBoilerplate.length || duplicatedNedirQuestions) {
  if (missingBridgeTargets.length) console.error('Missing bridge article targets:', missingBridgeTargets.join(', '));
  if (remainingBoilerplate.length) console.error('Repeated editorial boilerplate remains:', remainingBoilerplate.join(' | '));
  if (duplicatedNedirQuestions) console.error('Duplicated Nedir FAQ labels remain:', duplicatedNedirQuestions);
  process.exit(1);
}
console.log(`Editorial bridge audit passed: ${report.articleCount} article slugs, ${serviceSlugs.length} explicit service links, ${reviewedDates} explicit review dates, ${repeated.length} repeated long sentences remain for later review.`);
