import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const componentsDir = path.join(root, 'app', 'components');
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const sourceFiles = walk(path.join(root, 'app')).filter((file) => sourceExtensions.has(path.extname(file)));
const componentFiles = walk(componentsDir).filter((file) => sourceExtensions.has(path.extname(file)));
const unused = [];

for (const file of componentFiles) {
  const name = path.basename(file, path.extname(file));
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const referencedElsewhere = sourceFiles
    .filter((sourceFile) => sourceFile !== file)
    .some((sourceFile) => new RegExp(`\\b${escaped}\\b`).test(fs.readFileSync(sourceFile, 'utf8')));
  if (!referencedElsewhere) unused.push(path.relative(root, file));
}

if (unused.length) {
  console.error('HATA: Kullanılmayan kaynak bileşenler bulundu:');
  for (const file of unused) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`OK: ${componentFiles.length} kaynak bileşenin tamamı uygulama içinde kullanılıyor.`);
