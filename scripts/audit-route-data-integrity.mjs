import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const siteSource = read('app/lib/site.ts');
const servicesSource = siteSource.slice(
  siteSource.indexOf('export const services'),
  siteSource.indexOf('export function getService'),
);
const articleSourceInSite = siteSource.slice(siteSource.indexOf('const baseArticles'));
const articleFiles = [
  'app/lib/featuredArticles.ts',
  'app/lib/hepsipayArticles.ts',
  'app/lib/v21ExtendedArticles.part1.ts',
  'app/lib/v21ExtendedArticles.part2.ts',
  'app/lib/v21ExtendedArticles.part3.ts',
  'app/lib/v21ExtendedArticles.part4.ts',
  'app/lib/v21ExtendedArticles.part5.ts',
];

const extract = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);
const serviceSlugs = new Set(extract(servicesSource, /(?:\bslug|['"]slug['"]):\s*['"]([^'"]+)['"]/g));
const articleSlugs = new Set(extract(articleSourceInSite, /(?:\bslug|['"]slug['"]):\s*['"]([^'"]+)['"]/g));
for (const file of articleFiles) {
  for (const slug of extract(read(file), /(?:\bslug|['"]slug['"]):\s*['"]([^'"]+)['"]/g)) articleSlugs.add(slug);
}

const duplicateArticleSlugs = [];
const allArticleSlugs = [
  ...extract(articleSourceInSite, /(?:\bslug|['"]slug['"]):\s*['"]([^'"]+)['"]/g),
  ...articleFiles.flatMap((file) => extract(read(file), /(?:\bslug|['"]slug['"]):\s*['"]([^'"]+)['"]/g)),
];
for (const slug of new Set(allArticleSlugs)) {
  if (allArticleSlugs.filter((item) => item === slug).length > 1) duplicateArticleSlugs.push(slug);
}

const badServiceRefs = [];
for (const [file, source] of [
  ['app/lib/site.ts', articleSourceInSite],
  ...articleFiles.map((file) => [file, read(file)]),
  ['app/lib/troubleshooting.ts', read('app/lib/troubleshooting.ts')],
]) {
  for (const serviceSlug of extract(source, /serviceSlug:\s*['"]([^'"]+)['"]/g)) {
    if (!serviceSlugs.has(serviceSlug)) badServiceRefs.push(`${file}: ${serviceSlug}`);
  }
}

const articleRefs = [];
const collectArrayRefs = (file, key) => {
  const source = read(file);
  const pattern = new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`, 'gs');
  for (const match of source.matchAll(pattern)) {
    for (const slug of extract(match[1], /['"]([^'"]+)['"]/g)) articleRefs.push(`${file}: ${slug}`);
  }
};
collectArrayRefs('app/lib/learningPaths.ts', 'articleSlugs');
collectArrayRefs('app/lib/troubleshooting.ts', 'relatedArticleSlugs');

for (const file of ['app/lib/featuredArticles.ts', 'app/lib/hepsipayArticles.ts']) {
  // Only treat quoted, root-relative article URLs as links. Image paths such as
  // /images/bilgi-merkezi/... must not be interpreted as article references.
  for (const slug of extract(read(file), /['"]\/bilgi-merkezi\/([a-z0-9-]+)/g)) {
    if (!['kategori', 'konu', 'sorun-cozme', 'arama-niyeti'].includes(slug)) articleRefs.push(`${file}: ${slug}`);
  }
}

const missingArticleRefs = articleRefs.filter((entry) => !articleSlugs.has(entry.split(': ').at(-1)));

if (duplicateArticleSlugs.length || badServiceRefs.length || missingArticleRefs.length) {
  if (duplicateArticleSlugs.length) console.error('Tekrarlanan makale slugları:', duplicateArticleSlugs);
  if (badServiceRefs.length) console.error('Geçersiz serviceSlug referansları:', badServiceRefs);
  if (missingArticleRefs.length) console.error('Var olmayan makaleye yönlenen referanslar:', missingArticleRefs);
  process.exit(1);
}

console.log(`OK: ${articleSlugs.size} makale slugı ve ${serviceSlugs.size} hizmet slugı tutarlı; öğrenme yolu ve sorun çözme referansları geçerli.`);
