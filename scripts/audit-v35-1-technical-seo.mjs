import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const checks = [
  ['Sitemap merkezi SITE_URL kullanıyor', read('app/sitemap.ts').includes('SITE_URL') && !read('app/sitemap.ts').includes("const base = 'https://bozumcu.net'")],
  ['Robots merkezi SITE_URL kullanıyor', read('app/robots.ts').includes('SITE_URL')],
  ['Schema kimlikleri merkezi alan adına bağlı', read('app/layout.tsx').includes('`${SITE_URL}/#organization`') && read('app/layout.tsx').includes('`${SITE_URL}/#website`')],
  ['404 sayfası noindex', fs.existsSync('app/not-found.tsx') && read('app/not-found.tsx').includes('index: false')],
  ['Sitemap makale güncelleme tarihlerini kullanıyor', read('app/sitemap.ts').includes('updatedAt(article)')],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
console.log(`V35.1 teknik SEO denetimi geçti (${checks.length}/${checks.length}).`);
