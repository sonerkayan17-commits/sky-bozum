import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const appRoot = join(root, 'app');
const read = (path) => readFileSync(path, 'utf8');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const findings = [];
const robots = read('app/robots.ts');
const sitemap = read('app/sitemap.ts');
const seo = read('app/lib/seo.ts');
const layout = read('app/layout.tsx');

if (!robots.includes('ALLOW_INDEXING') || !robots.includes('disallow: "/"') || !robots.includes('/api/')) findings.push('robots.ts must block previews and disallow API crawling in production.');
if (!sitemap.includes('ALLOW_INDEXING') || !sitemap.includes('STATIC_ROUTES') || sitemap.includes('/admin') || sitemap.includes('/hesabim')) findings.push('sitemap must use public routes, exclude account/admin routes, and return empty on preview.');
if (!seo.includes('NEXT_PUBLIC_SITE_URL') || !seo.includes('PRODUCTION_SITE_URL') || !seo.includes('ALLOW_INDEXING')) findings.push('SEO URL/indexing must be env-based and production-domain gated.');
if (!seo.includes('max-image-preview') || !seo.includes('alternates: { canonical: path }')) findings.push('createMetadata must provide canonical and rich robot defaults.');
if (!layout.includes('@type') || !layout.includes('WebSite') || !layout.includes('SearchAction')) findings.push('Root structured data must include WebSite SearchAction.');

for (const file of walk(appRoot)) {
  if (!['.ts', '.tsx'].includes(extname(file))) continue;
  const rel = relative(root, file).replaceAll('\\', '/');
  const source = read(rel);
  const isPage = /\/page\.tsx$/.test(rel);
  if (!isPage) continue;
  const privateRoute = rel.includes('/admin/') || rel.includes('/yonetim/') || rel.includes('/hesabim/') || rel.includes('/giris/') || rel.includes('/kayit/') || rel.includes('/uyeler/');
  if (privateRoute && !/robots:\s*\{[^}]*index:\s*false/.test(source)) findings.push(`${rel} must be noindex.`);
  const publicStatic = !privateRoute && !rel.includes('/[') && !rel.includes('/oran-hesapla/');
  if (publicStatic && source.includes('metadata') && !source.includes('canonical') && !source.includes('createMetadata') && !source.includes('createToolMetadata')) findings.push(`${rel} metadata should include a canonical path.`);
}

if (findings.length) {
  for (const finding of findings) console.error(`FAIL ${finding}`);
  process.exitCode = 1;
} else {
  console.log('SEO release readiness audit passed.');
}
