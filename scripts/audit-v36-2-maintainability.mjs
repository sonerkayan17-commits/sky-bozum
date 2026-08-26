import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scripts/v36-2-split-manifest.json'), 'utf8'));
const failures = [];
const pass = (m) => console.log(`✓ ${m}`);
const fail = (m) => failures.push(m);
const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');

function sourceText(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).map((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceText(absolute);
    return /\.(css|ts|tsx)$/.test(entry.name) ? fs.readFileSync(absolute, 'utf8') : '';
  }).join('\n');
}

const globalEntry = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
const appSource = sourceText(path.join(root, 'app'));
for (const chunk of manifest.css_chunks) {
  if (!appSource.includes(path.basename(chunk.file))) fail(`CSS importu eksik: ${chunk.file}`);
  const absolute = path.join(root, chunk.file);
  if (!fs.existsSync(absolute)) fail(`CSS parçası eksik: ${chunk.file}`);
  else {
    const size = fs.statSync(absolute).size;
    const content = fs.readFileSync(absolute, 'utf8');
    if (size > 50_000) fail(`CSS parçası 50 KB sınırını aşıyor: ${chunk.file}`);
    if (size < 100 || !content.includes('{') || !content.includes('}')) fail(`CSS parçası geçerli kural içermiyor: ${chunk.file}`);
  }
}
if (failures.some((message) => message.startsWith('CSS'))) {
  // Ayrıntılı hatalar yukarıda raporlanır.
} else {
  pass(`${manifest.css_chunks.length} CSS parçası bağlı, geçerli ve dosya bütçesi içinde`);
}

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
if (articleCount === manifest.article_count) pass(`${articleCount} genişletilmiş makale eksiksiz`);
else fail(`Makale sayısı değişmiş: ${articleCount}/${manifest.article_count}`);
if (sha(slugs.join('\n')) === manifest.article_slugs_sha256) pass('Makale slug sırası korundu');
else fail('Makale slug sırası veya içeriği değişmiş');

const globalSize = Buffer.byteLength(globalEntry);
if (globalSize > 40_000) fail(`app/globals.css üretim sınırını aşıyor (${globalSize} bayt)`);
else pass(`app/globals.css kontrollü global katmanda (${globalSize} bayt)`);
const articleIndexSize = fs.statSync(path.join(root, 'app/lib/v21ExtendedArticles.ts')).size;
if (articleIndexSize > 5_000) fail(`app/lib/v21ExtendedArticles.ts hâlâ gereğinden büyük (${articleIndexSize} bayt)`);
else pass(`app/lib/v21ExtendedArticles.ts hafif giriş dosyasına dönüştürüldü (${articleIndexSize} bayt)`);

console.log('\nV36.2 bakım mimarisi özeti');
for (const message of failures) console.error(`FAIL ${message}`);
if (failures.length) process.exit(1);
console.log('Denetim geçti: büyük dosyalar kayıpsız ve yönetilebilir parçalara ayrıldı.');
