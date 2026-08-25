import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.join(root, '.next', 'server', 'app', 'bilgi-merkezi');

if (!fs.existsSync(outputDir)) {
  console.error('Makale SEO denetimi için önce production build oluşturulmalı: npm run build');
  process.exit(1);
}

const excludedPages = new Set(['arama-niyeti', 'sorun-cozme']);
const articleFiles = fs.readdirSync(outputDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => entry.name)
  .filter((name) => !excludedPages.has(name.slice(0, -5)));

const failures = [];
let minimumH2 = Number.POSITIVE_INFINITY;
let minimumH3 = Number.POSITIVE_INFINITY;
let minimumInternalLinks = Number.POSITIVE_INFINITY;

for (const fileName of articleFiles) {
  const html = fs.readFileSync(path.join(outputDir, fileName), 'utf8');
  const renderedHtml = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  const slug = fileName.slice(0, -5);
  const h1 = (renderedHtml.match(/<h1\b/g) ?? []).length;
  const h2 = (renderedHtml.match(/<h2\b/g) ?? []).length;
  const h3 = (renderedHtml.match(/<h3\b/g) ?? []).length;
  const internalLinks = (renderedHtml.match(/href="\/(?:bilgi-merkezi|hizmetler)\//g) ?? []).length;
  const hasConclusion = />Sonuç(?:<|:)/.test(renderedHtml);
  const hasOverviewLinks = renderedHtml.includes('article-context-links--overview');

  minimumH2 = Math.min(minimumH2, h2);
  minimumH3 = Math.min(minimumH3, h3);
  minimumInternalLinks = Math.min(minimumInternalLinks, internalLinks);

  if (h1 !== 1 || h2 < 4 || h3 < 1 || internalLinks < 4 || !hasConclusion || !hasOverviewLinks) {
    failures.push(`${slug}: H1=${h1}, H2=${h2}, H3=${h3}, iç bağlantı=${internalLinks}, sonuç=${hasConclusion}, bağlantı özeti=${hasOverviewLinks}`);
  }
}

if (articleFiles.length < 70) {
  failures.push(`Beklenen makale kapsamı oluşmadı. Bulunan makale sayfası: ${articleFiles.length}`);
}

const architecture = fs.readFileSync(path.join(root, 'app', 'lib', 'articleSeoArchitecture.ts'), 'utf8');
const requiredSearchIntents = [
  'mobil ödeme bozdur',
  'mobil ödeme bozum',
  'razer gold bozdurma',
  'itunes bozdurma',
  'turkcell bozdurma',
  'türk telekom bozdurma',
  'vodafone bozdurma',
  'pokus bozdur',
  'paycell bozdur',
  'vodafone pay bozdur',
  'güvenilir mobil bozum siteleri',
];

for (const intent of requiredSearchIntents) {
  if (!architecture.toLocaleLowerCase('tr-TR').includes(intent)) {
    failures.push(`Merkezi içerik mimarisinde arama niyeti eksik: ${intent}`);
  }
}

if (failures.length) {
  console.error('Makale SEO mimarisi denetimi başarısız:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`OK: ${articleFiles.length} makalenin tamamında tek H1, en az ${minimumH2} H2, en az ${minimumH3} H3, sonuç bölümü ve en az ${minimumInternalLinks} site içi bağlantı var.`);
console.log(`OK: ${requiredSearchIntents.length} temel arama niyeti konuya göre merkezi içerik mimarisine bağlı.`);
