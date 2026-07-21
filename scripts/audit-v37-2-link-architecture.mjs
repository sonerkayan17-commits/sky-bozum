import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredTemplates = [
  'app/bilgi-merkezi/kategori/[slug]/page.tsx',
  'app/bilgi-merkezi/konu/[slug]/page.tsx',
  'app/bilgi-merkezi/sorun-cozme/[slug]/page.tsx',
];
const failures = [];
for (const file of requiredTemplates) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) failures.push(`Eksik dinamik rota şablonu: ${file}`);
  else {
    const source = fs.readFileSync(full, 'utf8');
    for (const token of ['generateStaticParams', 'generateMetadata', 'alternates', 'canonical', 'BreadcrumbList']) {
      if (!source.includes(token)) failures.push(`${file} içinde ${token} eksik`);
    }
  }
}

const sitemap = fs.readFileSync(path.join(root, 'app/sitemap.ts'), 'utf8');
const routeRegistry = fs.readFileSync(path.join(root, 'app/lib/routes.ts'), 'utf8');
const routeContracts = [
  ['articleCategory', '/bilgi-merkezi/kategori/'],
  ['topicHub', '/bilgi-merkezi/konu/'],
  ['troubleshooting', '/bilgi-merkezi/sorun-cozme/'],
];
for (const [builder, route] of routeContracts) {
  const sitemapUsesBuilder = sitemap.includes(`routePath.${builder}`);
  const registryDefinesRoute = routeRegistry.includes(route);
  if (!sitemapUsesBuilder || !registryDefinesRoute) failures.push(`Sitemap dinamik rota ailesini içermiyor: ${route}`);
}

const articlePage = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/[slug]/page.tsx'), 'utf8');
if (!articlePage.includes('/bilgi-merkezi/kategori/')) failures.push('Makale sayfasında kategori merkezi bağlantısı yok');
if (!articlePage.includes('/bilgi-merkezi/konu/')) failures.push('Makale sayfasında konu merkezi bağlantısı yok');

const report = [
  '# V37.2 İç Link ve Rota Bütünlüğü Denetimi',
  '',
  `- Dinamik rota şablonu: ${requiredTemplates.length}`,
  `- Kritik bulgu: ${failures.length}`,
  '',
  ...(failures.length ? failures.map((item) => `- ${item}`) : [
    '- Kategori merkezleri gerçek rota şablonuna bağlı.',
    '- Konu merkezleri gerçek rota şablonuna bağlı.',
    '- Sorun çözme detayları gerçek rota şablonuna bağlı.',
    '- Tüm dinamik merkezlerde metadata, canonical ve breadcrumb mevcut.',
    '- Sitemap ile gerçek route yapısı uyumlu.',
  ]),
].join('\n');
fs.writeFileSync(path.join(root, 'V37.2-IC-LINK-ROTA-BUTUNLUGU.md'), report);
console.log(report);
if (failures.length) process.exitCode = 1;
