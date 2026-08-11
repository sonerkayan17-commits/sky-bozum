import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = [
  path.join(root, 'app/bilgi-merkezi'),
  path.join(root, 'app/components/articles'),
  path.join(root, 'app/components/ShareButtons.tsx'),
  path.join(root, 'app/lib/seo.ts'),
  path.join(root, 'app/lib/categoryVisuals.ts'),
];
const extensions = new Set(['.tsx', '.ts', '.jsx', '.js']);
const assetPattern = /["'`](\/[A-Za-z0-9_./-]+\.(?:svg|webp|png|jpe?g|avif))["'`]/g;
const missing = [];
let checked = 0;

function visit(entry) {
  const stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(entry)) visit(path.join(entry, child));
    return;
  }
  if (!extensions.has(path.extname(entry))) return;
  const source = fs.readFileSync(entry, 'utf8');
  for (const match of source.matchAll(assetPattern)) {
    checked += 1;
    const publicPath = path.join(root, 'public', match[1].slice(1));
    if (!fs.existsSync(publicPath)) {
      missing.push(`${path.relative(root, entry)} -> ${match[1]}`);
    }
  }
}

for (const target of targets) {
  if (fs.existsSync(target)) visit(target);
}

if (missing.length) {
  console.error('Eksik statik Bilgi Merkezi varlık referansları:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}
console.log(`OK: ${checked} statik Bilgi Merkezi varlık referansı fiziksel dosyalarla eşleşiyor.`);
