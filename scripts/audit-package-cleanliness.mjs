import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const forbiddenNames = new Set(['.DS_Store', 'Thumbs.db']);
const forbiddenDirs = new Set(['node_modules', '.next', '.turbo', 'dist', 'coverage']);
const forbiddenExtensions = ['.tsbuildinfo', '.log'];
const violations = [];
const allowedRootDocs = new Set(['PACKAGE-CONTENTS.md', 'FILE-MANIFEST.txt']);
const legacyRootReportPatterns = [
  /^V\d+(?:[.-]\d+)*(?:-[A-Z0-9ÇĞİÖŞÜ_-]+)?\.(?:md|json)$/i,
  /^(?:BILGI-MERKEZI|FINAL|EDITORIAL)[A-Z0-9ÇĞİÖŞÜ._-]*\.(?:md|json)$/i,
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const absolute = path.join(dir, entry.name);
    const relative = path.relative(root, absolute).replaceAll(path.sep, '/');

    if (entry.isDirectory()) {
      if (forbiddenDirs.has(entry.name)) {
        violations.push(`${relative}/`);
        continue;
      }
      walk(absolute);
      continue;
    }

    const isLegacyRootReport =
      dir === root &&
      !allowedRootDocs.has(entry.name) &&
      legacyRootReportPatterns.some((pattern) => pattern.test(entry.name));

    if (
      isLegacyRootReport ||
      forbiddenNames.has(entry.name) ||
      forbiddenExtensions.some((extension) => entry.name.endsWith(extension))
    ) {
      violations.push(relative);
    }
  }
}

walk(root);

if (violations.length > 0) {
  console.error('HATA: Production paketinde bulunmaması gereken dosyalar tespit edildi:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('OK: Paket önbellek, bağımlılık klasörü, log, işletim sistemi artığı ve eski kök raporları içermiyor.');
