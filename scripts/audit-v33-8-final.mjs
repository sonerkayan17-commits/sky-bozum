import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

const servicePage = read('app/hizmetler/[slug]/page.tsx');
const detail = read('app/components/services/ServiceDetail.tsx');
const site = read('app/lib/site.ts');

const protectedFiles = [
  'app/page.tsx',
  'app/sss/page.tsx',
  'app/referanslar/page.tsx',
  'app/components/Navbar.tsx',
  'app/components/Footer.tsx',
];

const serviceBindings = [
  'vodafone-mobil-odeme',
  'turkcell-mobil-odeme',
  'paycell',
  'turk-telekom-mobil-odeme',
  'pokus',
  'razer-gold-tl',
  'razer-gold-usd',
  'itunes-apple',
  'steam',
  'sms-mobil-odeme',
  'kredi-karti-sanal-kart',
];

const checks = [
  ['Dynamic service metadata', servicePage.includes('generateMetadata') && servicePage.includes('alternates: { canonical:')],
  ['Service JSON-LD', servicePage.includes("'@type': 'Service'")],
  ['Breadcrumb JSON-LD', servicePage.includes("'@type': 'BreadcrumbList'")],
  ['Static service params', servicePage.includes('generateStaticParams')],
  ['Single H1 in service template', (detail.match(/<h1\b/g) || []).length === 1],
  ['Semantic breadcrumb', detail.includes('aria-label="Sayfa yolu"') && detail.includes('aria-current="page"')],
  ['Semantic quick navigation', detail.includes('aria-label="Hizmet içi hızlı erişim"')],
  ['Responsive hero image sizes', detail.includes('sizes="(max-width: 1023px) 72vw, 38vw"')],
  ['External links protected', (detail.match(/target="_blank"/g) || []).length === (detail.match(/rel="noopener noreferrer"/g) || []).length],
  ['Internal journey preserved', ['/oran-hesapla', '/bilgi-merkezi/sorun-cozme', '/bilgi-merkezi', '/iletisim'].every((route) => detail.includes(route))],
  ['FAQ omitted from service template', !/FAQ|S\.S\.S\./i.test(detail)],
  ['All premium service bindings', serviceBindings.every((slug) => detail.includes(`service.slug === '${slug}'`))],
  ['Service data source present', site.includes('export const services')],
  ['Protected files present', protectedFiles.every(exists)],
];

let failed = 0;
console.log('# V33.8 Hizmetler Final Audit');
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  if (!ok) failed += 1;
}

console.log('\n## Korunan alan dosya özetleri');
for (const file of protectedFiles) console.log(`- ${file}: ${sha256(file).slice(0, 16)}`);

console.log(`\nSonuç: ${checks.length - failed}/${checks.length} kontrol başarılı.`);
if (failed) process.exit(1);
