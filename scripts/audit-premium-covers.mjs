import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mapFile = path.join(root, 'app/lib/premiumArticleCovers.ts');
const source = fs.readFileSync(mapFile, 'utf8');
const entries = [...source.matchAll(/'([^']+)': '\/(article-covers-v32-[^']+\.svg)'/g)];
const missing = [];
const invalid = [];
for (const [, slug, relative] of entries) {
  const file = path.join(root, 'public', relative);
  if (!fs.existsSync(file)) { missing.push({ slug, file: relative }); continue; }
  const svg = fs.readFileSync(file, 'utf8');
  if (/^article-covers-v32-(5|6|7)\//.test(relative) && (!svg.includes('width="1200"') || !svg.includes('height="675"') || !svg.includes('viewBox="0 0 1200 675"'))) invalid.push({ slug, file: relative });
}
const phases = Object.fromEntries([5,6,7].map(n => [n, entries.filter(([, , relative]) => relative.startsWith(`article-covers-v32-${n}/`)).length]));
console.log(JSON.stringify({ mapped: entries.length, phases, missing, invalid }, null, 2));
if (missing.length || invalid.length || phases[5] !== 12 || phases[6] !== 12 || phases[7] !== 12) process.exit(1);
