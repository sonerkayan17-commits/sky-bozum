import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const routesSource = read('app/lib/routes.ts');
const sitemapSource = read('app/sitemap.ts');
const seoSource = read('app/lib/seo.ts');

for (const token of ['STATIC_ROUTES', 'routePath', 'service:', 'article:', 'articleCategory:', 'topicHub:', 'troubleshooting:']) {
  if (!routesSource.includes(token)) failures.push(`Merkezi rota kaydında eksik sözleşme: ${token}`);
}
if (!sitemapSource.includes("from './lib/routes'")) failures.push('Sitemap merkezi rota kaydını kullanmıyor.');
if (/const staticRoutes\s*=/.test(sitemapSource)) failures.push('Sitemap içinde ikinci bir statik rota listesi kalmış.');
if (!seoSource.includes('absoluteUrl')) failures.push('Canonical URL üreticisi bulunamadı.');

const routeMatches = [...routesSource.matchAll(/path:\s*'([^']*)'/g)].map((match) => match[1]);
const duplicateRoutes = routeMatches.filter((route, index) => routeMatches.indexOf(route) !== index);
if (duplicateRoutes.length) failures.push(`Tekrarlanan statik rota: ${[...new Set(duplicateRoutes)].join(', ')}`);

for (const route of routeMatches) {
  if (route && !route.startsWith('/')) failures.push(`Rota / ile başlamıyor: ${route}`);
  if (route !== '/' && route.endsWith('/')) failures.push(`Rota son slash içeriyor: ${route}`);
  if (/[A-ZÇĞİÖŞÜ]/.test(route)) failures.push(`Rota büyük harf içeriyor: ${route}`);
  if (/[çğıöşü]/.test(route)) failures.push(`Rota Türkçe karakter içeriyor: ${route}`);
  if (/\/\//.test(route)) failures.push(`Rota çift slash içeriyor: ${route}`);
}

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|mjs)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, 'app'));

const hrefs = [];
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/(?:href|canonical):?\s*=*\s*[{'\"]+([^'\"}`?#]+)[^'\"}]*[}'\"]*/g)) {
    const href = match[1];
    if (!href.startsWith('/')) continue;
    hrefs.push({ href, file: path.relative(root, file) });
    if (href !== '/' && href.endsWith('/')) failures.push(`${path.relative(root, file)} son slash kullanan dahili URL içeriyor: ${href}`);
    if (/\s/.test(href)) failures.push(`${path.relative(root, file)} boşluk içeren dahili URL içeriyor: ${href}`);
    if (/\/{2,}/.test(href)) failures.push(`${path.relative(root, file)} çift slash içeren dahili URL içeriyor: ${href}`);
  }
}

const report = [
  '# V37.4 URL ve Bilgi Mimarisi Denetimi',
  '',
  `- Merkezi statik rota: ${routeMatches.length}`,
  `- Taranan kaynak dosyası: ${sourceFiles.length}`,
  `- İncelenen dahili URL ifadesi: ${hrefs.length}`,
  `- Kritik bulgu: ${failures.length}`,
  `- Uyarı: ${warnings.length}`,
  '',
  ...(failures.length ? failures.map((item) => `- FAIL ${item}`) : [
    '- PASS Sitemap statik URL’leri tek merkezi kaynaktan üretiliyor.',
    '- PASS Dinamik rota aileleri ortak path builder kullanıyor.',
    '- PASS Statik rotalarda tekrar, Türkçe karakter, büyük harf ve son slash yok.',
    '- PASS Canonical URL üretimi merkezi SEO yardımcısına bağlı.',
  ]),
].join('\n');

fs.writeFileSync(path.join(root, 'V37.4-URL-BILGI-MIMARISI.md'), report);
console.log(report);
if (failures.length) process.exitCode = 1;
