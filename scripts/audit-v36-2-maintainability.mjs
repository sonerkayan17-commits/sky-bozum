import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scripts/v36-2-split-manifest.json'), 'utf8'));
const failures = [];
const pass = (m) => console.log(`✓ ${m}`);
const fail = (m) => failures.push(m);
const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');

const globalEntry = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
for (const chunk of manifest.css_chunks) {
  if (!globalEntry.includes(`@import "./styles/${path.basename(chunk.file)}";`)) fail(`CSS importu eksik: ${chunk.file}`);
  const absolute = path.join(root, chunk.file);
  if (!fs.existsSync(absolute)) fail(`CSS parçası eksik: ${chunk.file}`);
  else if (fs.statSync(absolute).size > 50_000) fail(`CSS parçası 50 KB sınırını aşıyor: ${chunk.file}`);
}
const cssBody = manifest.css_chunks.map((item) => fs.readFileSync(path.join(root, item.file), 'utf8')).join('');
sha(cssBody) === manifest.original_css_body_sha256 ? pass('CSS sırası ve içeriği kayıpsız korundu') : fail('CSS parçalama sırasında sıra veya içerik değişmiş');

const articleIndex = fs.readFileSync(path.join(root, 'app/lib/v21ExtendedArticles.ts'), 'utf8');
const slugs = [];
let articleCount = 0;
for (const part of manifest.article_parts) {
  const absolute = path.join(root, part.file);
  if (!fs.existsSync(absolute)) { fail(`Makale parçası eksik: ${part.file}`); continue; }
  if (fs.statSync(absolute).size > 100_000) fail(`Makale parçası 100 KB sınırını aşıyor: ${part.file}`);
  const source = fs.readFileSync(absolute, 'utf8');
  const arrayStart = source.indexOf('[');
  const arrayEnd = source.lastIndexOf(']');
  try {
    const items = JSON.parse(source.slice(arrayStart, arrayEnd + 1));
    articleCount += items.length;
    slugs.push(...items.map((item) => item.slug));
  } catch (error) {
    fail(`${part.file} veri yapısı okunamadı: ${error.message}`);
  }
  if (!articleIndex.includes(`./${path.basename(part.file, '.ts')}`)) fail(`Makale index importu eksik: ${part.file}`);
}
articleCount === manifest.article_count ? pass(`${articleCount} genişletilmiş makale eksiksiz`) : fail(`Makale sayısı değişmiş: ${articleCount}/${manifest.article_count}`);
sha(slugs.join('\n')) === manifest.article_slugs_sha256 ? pass('Makale slug sırası korundu') : fail('Makale slug sırası veya içeriği değişmiş');

for (const former of ['app/globals.css', 'app/lib/v21ExtendedArticles.ts']) {
  const size = fs.statSync(path.join(root, former)).size;
  if (size > 5_000) fail(`${former} hâlâ gereğinden büyük (${size} bayt)`);
  else pass(`${former} hafif giriş dosyasına dönüştürüldü (${size} bayt)`);
}

console.log('\nV36.2 bakım mimarisi özeti');
for (const message of failures) console.error(`FAIL ${message}`);
if (failures.length) process.exit(1);
console.log('Denetim geçti: büyük dosyalar kayıpsız ve yönetilebilir parçalara ayrıldı.');
