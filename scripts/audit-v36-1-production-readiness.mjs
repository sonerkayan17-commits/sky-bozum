import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const failures = [];
const warnings = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const sha256 = (relative) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');

const requiredFiles = [
  'app/error.tsx', 'app/loading.tsx', 'app/not-found.tsx', 'app/robots.ts',
  'app/sitemap.ts', 'app/manifest.ts', 'app/favicon.ico', '.env.example',
];
for (const file of requiredFiles) exists(file) ? pass(`${file} mevcut`) : fail(`${file} eksik`);

const baselinePath = 'scripts/locked-area-baseline.json';
if (!exists(baselinePath)) {
  fail('Kilitli alan baseline dosyası eksik');
} else {
  const baseline = JSON.parse(read(baselinePath));
  for (const [file, expected] of Object.entries(baseline)) {
    if (!exists(file)) fail(`Kilitli alan silinmiş: ${file}`);
    else if (sha256(file) !== expected) fail(`Kilitli alan değişmiş: ${file}`);
    else pass(`Kilitli alan korundu: ${file}`);
  }
}

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, 'app'));

for (const full of sourceFiles) {
  const relative = path.relative(root, full).replaceAll('\\\\', '/');
  const content = fs.readFileSync(full, 'utf8');
  if (/href=["']#["']/.test(content)) fail(`${relative}: boş bağlantı bulundu`);
  if (/javascript:/i.test(content)) fail(`${relative}: javascript: bağlantısı bulundu`);
  if (/\b(TODO|FIXME)\b/.test(content)) warn(`${relative}: TODO/FIXME notu bulundu`);
  if (/target=["']_blank["']/.test(content) && !/rel=["'][^"']*(noopener|noreferrer)/.test(content)) {
    fail(`${relative}: target=_blank için rel=noopener eksik`);
  }
}
pass(`${sourceFiles.length} kaynak dosyası güvenlik ve placeholder kontrolünden geçti`);

const pages = sourceFiles.filter((file) => file.endsWith(`${path.sep}page.tsx`));
for (const page of pages) {
  const relative = path.relative(root, page).replaceAll('\\\\', '/');
  const content = fs.readFileSync(page, 'utf8');
  if (relative !== 'app/page.tsx' && !/export\s+(const\s+metadata|async\s+function\s+generateMetadata|function\s+generateMetadata)/.test(content)) {
    fail(`${relative}: metadata tanımı eksik`);
  }
  const h1Count = (content.match(/<h1\b/g) || []).length;
  if (h1Count === 0 && !relative.includes('/[slug]/') && !content.includes('<ToolPage') && relative !== 'app/page.tsx' && relative !== 'app/oran-hesapla/page.tsx') warn(`${relative}: statik kaynakta H1 görülmedi`);
  if (h1Count > 1) warn(`${relative}: birden fazla H1 bulundu (${h1Count})`);
}
pass(`${pages.length} sayfa metadata/H1 açısından tarandı`);

const env = read('.env.example');
for (const key of ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_WHATSAPP_URL']) {
  env.includes(key) ? pass(`.env.example içinde ${key} tanımlı`) : fail(`.env.example içinde ${key} eksik`);
}

console.log('\nV36.1 üretim hazırlığı özeti');
for (const message of warnings) console.log(`WARN ${message}`);
for (const message of failures) console.error(`FAIL ${message}`);
if (failures.length) process.exit(1);
console.log(`Denetim geçti: ${requiredFiles.length} temel dosya, ${pages.length} sayfa, ${sourceFiles.length} kaynak; ${warnings.length} uyarı.`);
