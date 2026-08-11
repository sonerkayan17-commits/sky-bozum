import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const app = path.join(root, 'app');
const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(app);

const staticRoutes = new Set(['/']);
for (const file of sourceFiles.filter((file) => file.endsWith(`${path.sep}page.tsx`))) {
  let route = path.relative(app, path.dirname(file)).split(path.sep).filter(Boolean);
  if (route.some((part) => part.startsWith('['))) continue;
  staticRoutes.add('/' + route.join('/'));
}

const site = fs.readFileSync(path.join(app, 'lib', 'site.ts'), 'utf8');
const slugs = [...site.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const knownDynamicPrefixes = ['/bilgi-merkezi/', '/hizmetler/', '/bilgi-merkezi/kategori/', '/bilgi-merkezi/konu/'];
const hrefs = [];
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/(?:href|url):?\s*=??\s*[`"'](\/[^`"'#?]*)/g)) hrefs.push({ file, href: match[1] });
}

const suspicious = hrefs.filter(({ href }) => {
  if (href.includes('${') || href === '/' || /\.(?:webp|png|jpe?g|svg|ico|xml|json)$/.test(href)) return false;
  if (staticRoutes.has(href)) return false;
  if (knownDynamicPrefixes.some((prefix) => href.startsWith(prefix))) return false;
  return !slugs.some((slug) => href.endsWith('/' + slug));
});

const report = [
  '# V26 İç Bağlantı Denetimi',
  '',
  `- Taranan kaynak dosyası: ${sourceFiles.length}`,
  `- Bulunan dahili bağlantı ifadesi: ${hrefs.length}`,
  `- Statik rota: ${staticRoutes.size}`,
  `- Şüpheli bağlantı: ${suspicious.length}`,
  '',
  ...(suspicious.length ? suspicious.map((item) => `- \`${path.relative(root, item.file)}\` → \`${item.href}\``) : ['Şüpheli sabit dahili bağlantı bulunmadı.']),
  '',
  '> Dinamik template literal bağlantıları çalışma zamanı rotalarıyla üretildiği için bu denetim sabit bağlantıları ve rota kalıplarını kontrol eder.',
].join('\n');
if (process.env.AUDIT_WRITE_REPORTS === '1') {
  fs.writeFileSync(path.join(root, 'V26-IC-BAGLANTI-DENETIMI.md'), report);
}
console.log(report);
if (suspicious.length) process.exitCode = 1;
