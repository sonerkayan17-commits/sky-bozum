import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
  const rel = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(rel) : [rel];
});

const sourceFiles = walk('app').filter((file) => /\.(?:ts|tsx)$/.test(file));
const sources = sourceFiles.map((file) => [file, read(file)]);
const auditedVisibleRoutes = ['/hizmetler', '/iletisim', '/sss', '/araclar', '/operatorler'];
const unavailableVisibleRoutes = auditedVisibleRoutes.filter((route) => !fs.existsSync(path.join(root, 'app', route.slice(1), 'page.tsx')));
const visibleFiles = sources.filter(([file]) => file.endsWith('.tsx') || file.includes('featuredArticles') || file.includes('v21ExtendedArticles'));
const badRoutes = [];
for (const [file, source] of visibleFiles) {
  for (const route of unavailableVisibleRoutes) {
    if (source.includes(`'${route}`) || source.includes(`"${route}`)) badRoutes.push(`${file}: ${route}`);
  }
}
if (badRoutes.length) {
  console.error('Bağımsız pakette olmayan rotalara kalan görünür bağlantılar:', badRoutes);
  process.exit(1);
}

const coverComponent = read('app/components/articles/ArticleCover.tsx');
for (const marker of ['const cover = uploadedCover || (premiumCover', 'fallbackCovers[tone]', 'article-generated-cover', 'role="img"']) {
  if (!coverComponent.includes(marker)) {
    console.error(`Makale kapak yedeği eksik: ${marker}`);
    process.exit(1);
  }
}

const premiumMap = read('app/lib/premiumArticleCovers.ts');
const premiumPaths = [...premiumMap.matchAll(/:\s*['"](\/[^'"]+)['"]/g)].map((match) => match[1]);
const missingPremium = premiumPaths.filter((asset) => !fs.existsSync(path.join(root, 'public', asset.slice(1))));
if (missingPremium.length) {
  console.error('Fiziksel dosyası bulunmayan premium kapaklar:', missingPremium);
  process.exit(1);
}

const categoryVisuals = read('app/lib/categoryVisuals.ts');
const categoryAssets = [...categoryVisuals.matchAll(/(?:hero|card):\s*['"](\/[^'"]+)['"]/g)].map((match) => match[1]);
const missingCategory = categoryAssets.filter((asset) => !fs.existsSync(path.join(root, 'public', asset.slice(1))));
if (missingCategory.length) {
  console.error('Fiziksel dosyası bulunmayan kategori görselleri:', missingCategory);
  process.exit(1);
}

const detailPage = read('app/bilgi-merkezi/[slug]/page.tsx');
const indexPage = read('app/bilgi-merkezi/page.tsx');
for (const marker of ['<ArticleCover article={article} priority />', 'ArticleExplorer', 'LearningPathShowcase']) {
  if (!detailPage.includes(marker) && !indexPage.includes(marker)) {
    console.error(`Görünür görsel/kart bağlantısı eksik: ${marker}`);
    process.exit(1);
  }
}

console.log(`OK: ${premiumPaths.length} premium kapak ve ${categoryAssets.length} kategori görsel yolu fiziksel dosyalarla eşleşiyor.`);
console.log('OK: Her makale için fiziksel kapak veya markalı görsel yedeği mevcut; bağımsız pakette boşa çıkan görünür rota yok.');
