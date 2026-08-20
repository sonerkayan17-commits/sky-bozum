import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const pass = (label, condition) => checks.push({ label, condition });

const seo = read('app/lib/seo.ts');
const layout = read('app/layout.tsx');
const services = read('app/hizmetler/[slug]/page.tsx');
const tools = read('app/lib/tools.ts');
const sitemap = read('app/sitemap.ts');
const robots = read('app/robots.ts');

pass('Merkezi SITE_URL tanımlı', seo.includes("export const PRODUCTION_SITE_URL = 'https://bozumcu.net'") && seo.includes('export const SITE_URL = normalizeSiteUrl('));
pass('Merkezi metadata builder tanımlı', seo.includes('export function createMetadata'));
pass('Breadcrumb schema builder tanımlı', seo.includes('export function breadcrumbSchema'));
pass('Service schema builder tanımlı', seo.includes('export function serviceSchema'));
pass('JSON-LD güvenli serialize ediliyor', seo.includes("replace(/</g, '\\\\u003c')"));
pass('Root layout yalnız site-geneli Organization/WebSite schema taşıyor', layout.includes("'@type': 'Organization'") && layout.includes("'@type': 'WebSite'") && !layout.includes("'@type': 'FAQPage'"));
pass('Root layout merkezi SEO sabitlerini kullanıyor', layout.includes('SITE_NAME') && layout.includes('SITE_LOCALE') && layout.includes('jsonLd(structuredData)'));
pass('Hizmet metadata merkezi builder kullanıyor', services.includes('return createMetadata({'));
pass('Hizmet JSON-LD merkezi builder kullanıyor', services.includes('serviceSchema(service)') && services.includes('breadcrumbSchema([') && services.includes('jsonLd(schema)'));
pass('Araç metadata merkezi builder kullanıyor', tools.includes('return createMetadata({'));
pass('Sitemap içerik kayıtlarından dinamik üretiliyor', sitemap.includes('...services.map') && sitemap.includes('...articles.map') && sitemap.includes('...toolPages.map'));
pass('Robots admin kök ve alt yollarını kapsıyor', robots.includes('"/admin"') && robots.includes('"/admin/"') && robots.includes('"/api/"'));

const failed = checks.filter((check) => !check.condition);
for (const check of checks) console.log(`${check.condition ? 'PASS' : 'FAIL'} ${check.label}`);

if (failed.length) {
  console.error(`\n${failed.length} merkezi SEO kontrolü başarısız.`);
  process.exit(1);
}

console.log(`\nPASS ${checks.length}/${checks.length} merkezi SEO kontrolü başarıyla tamamlandı.`);
