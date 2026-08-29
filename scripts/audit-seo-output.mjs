import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appDir = path.join(root, '.next', 'server', 'app');
const fallbackOrigin = 'https://sky-bozum.vercel.app';
const customDomainCanonicalEnabled = process.env.PRIMARY_DOMAIN_CANONICAL_ENABLED === 'true';
const vercelProductionOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : fallbackOrigin;
const expectedOrigin = (customDomainCanonicalEnabled
  ? process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin
  : vercelProductionOrigin).replace(/\/$/, '');
const expectedHostname = new URL(expectedOrigin).hostname.replace(/^www\./, '');
const inactiveHostnames = ['bozumcu.net', 'bozumcu.net.tr', 'sky-bozum.vercel.app']
  .filter((hostname) => hostname !== expectedHostname);
const inactiveHostPattern = inactiveHostnames.length
  ? new RegExp(`https?:\\/\\/(?:www\\.)?(?:${inactiveHostnames.map((hostname) => hostname.replaceAll('.', '\\.')).join('|')})(?:\\/|[\"'<])`, 'i')
  : null;
const privateRoots = ['/admin', '/yonetim', '/hesabim', '/giris', '/kayit'];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function routeFor(file) {
  const relative = path.relative(appDir, file).replaceAll('\\', '/').replace(/\.html$/, '');
  return relative === 'index' ? '/' : `/${relative.replace(/\/index$/, '')}`;
}

function decode(value = '') {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function textOnly(value = '') {
  return decode(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

const htmlFiles = walk(appDir).filter((file) => file.endsWith('.html'));
const sitemapBodyPath = path.join(appDir, 'sitemap.xml.body');
const sitemap = fs.existsSync(sitemapBodyPath) ? fs.readFileSync(sitemapBodyPath, 'utf8') : '';
const indexedRoutes = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  try { return new URL(match[1]).pathname.replace(/\/$/, '') || '/'; } catch { return ''; }
}));
const publicPages = htmlFiles
  .map((file) => ({ file, route: routeFor(file), html: fs.readFileSync(file, 'utf8') }))
  .filter(({ route }) => route !== '/_not-found' && route !== '/_global-error' && !privateRoots.some((rootPath) => route === rootPath || route.startsWith(`${rootPath}/`)));

const failures = [];
const warnings = [];
const titleOwners = new Map();
const descriptionOwners = new Map();

for (const page of publicPages) {
  const title = decode(page.html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim());
  const description = decode(page.html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim());
  const canonical = decode(page.html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]?.trim());
  const h1Count = (page.html.match(/<h1(?:\s|>)/gi) || []).length;

  if (!title) failures.push(`${page.route}: title yok`);
  else if (title.length < 20 || title.length > 68) warnings.push(`${page.route}: title uzunluğu ${title.length}`);
  if (!description) failures.push(`${page.route}: description yok`);
  else if (description.length < 80 || description.length > 180) warnings.push(`${page.route}: description uzunluğu ${description.length}`);
  if (!canonical?.startsWith(`${expectedOrigin}/`) && canonical !== expectedOrigin) failures.push(`${page.route}: canonical ana alan adıyla eşleşmiyor (${canonical || 'yok'})`);
  if (inactiveHostPattern?.test(page.html)) failures.push(`${page.route}: etkin olmayan alan adı görünür çıktıya sızıyor`);
  if (indexedRoutes.has(page.route) && h1Count !== 1) failures.push(`${page.route}: indekslenen sayfada tam bir H1 bekleniyor, bulunan ${h1Count}`);

  if (title) {
    const owner = titleOwners.get(title);
    if (owner) failures.push(`${page.route}: yinelenen title (${owner})`);
    else titleOwners.set(title, page.route);
  }
  if (description) {
    const owner = descriptionOwners.get(description);
    if (owner) warnings.push(`${page.route}: yinelenen description (${owner})`);
    else descriptionOwners.set(description, page.route);
  }

  if (/^\/bilgi-merkezi\/[^/]+$/.test(page.route) && !['/bilgi-merkezi/arama-niyeti', '/bilgi-merkezi/sorun-cozme'].includes(page.route)) {
    const words = textOnly(page.html.match(/<article[\s\S]*?<\/article>/i)?.[0] || '').split(/\s+/).filter(Boolean).length;
    if (words < 500) failures.push(`${page.route}: makale görünür metni 500 kelimenin altında (${words})`);
    if (!page.html.includes('BlogPosting')) failures.push(`${page.route}: BlogPosting şeması yok`);
    if (!page.html.includes('BreadcrumbList')) failures.push(`${page.route}: BreadcrumbList şeması yok`);
    if (!page.html.includes('RESMÎ KAYNAKLAR')) failures.push(`${page.route}: görünür resmî kaynak bölümü yok`);
    const sourceCount = (page.html.match(/article-resource-links[\s\S]*?<\/section>/i)?.[0]?.match(/target="_blank"/g) || []).length;
    if (sourceCount < 2) failures.push(`${page.route}: en az iki resmî kaynak bekleniyor, bulunan ${sourceCount}`);
  }

  if (/^\/topluluk\/forum\/[^/]+\/[^/]+\/[^/]+$/.test(page.route)) {
    const words = textOnly(page.html.match(/<article[\s\S]*?<\/article>/i)?.[0] || '').split(/\s+/).filter(Boolean).length;
    if (words < 500) failures.push(`${page.route}: forum rehberi görünür metni 500 kelimenin altında (${words})`);
    if (!page.html.includes('DiscussionForumPosting')) failures.push(`${page.route}: DiscussionForumPosting şeması yok`);
    if (!page.html.includes('BreadcrumbList')) failures.push(`${page.route}: forum BreadcrumbList şeması yok`);
  }
}

const robotsBodyPath = path.join(appDir, 'robots.txt.body');
if (!fs.existsSync(robotsBodyPath) || !fs.readFileSync(robotsBodyPath, 'utf8').includes(`Sitemap: ${expectedOrigin}/sitemap.xml`)) failures.push('robots.txt ana sitemap adresiyle eşleşmiyor');
if (!fs.existsSync(sitemapBodyPath)) failures.push('sitemap.xml çıktısı yok');
else {
  for (const privateRoot of privateRoots) if (sitemap.includes(`<loc>${expectedOrigin}${privateRoot}`)) failures.push(`sitemap özel alan içeriyor: ${privateRoot}`);
}

console.log(`SEO output audit: ${publicPages.length} public HTML page`);
for (const warning of warnings.slice(0, 20)) console.warn(`WARN ${warning}`);
if (warnings.length > 20) console.warn(`WARN +${warnings.length - 20} additional warnings`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`PASS canonical, metadata, H1, article depth, schema and index hygiene checks (${warnings.length} warning)`);
