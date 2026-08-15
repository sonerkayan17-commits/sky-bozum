import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const forbiddenNames = new Set(['.DS_Store', 'Thumbs.db']);
const forbiddenExtensions = ['.tsbuildinfo', '.log'];
const violations = [];
const allowedRootDocs = new Set(['PACKAGE-CONTENTS.md', 'FILE-MANIFEST.txt']);
const legacyRootReportPatterns = [
  /^V\d+(?:[.-]\d+)*(?:-[A-Z0-9ÇĞİÖŞÜ_-]+)?\.(?:md|json)$/i,
  /^(?:BILGI-MERKEZI|FINAL|EDITORIAL)[A-Z0-9ÇĞİÖŞÜ._-]*\.(?:md|json)$/i,
];

const trackedFiles = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);

for (const relative of trackedFiles) {
  const name = path.basename(relative);
  const isLegacyRootReport =
    path.dirname(relative) === '.' &&
    !allowedRootDocs.has(name) &&
    legacyRootReportPatterns.some((pattern) => pattern.test(name));

  if (
    isLegacyRootReport ||
    forbiddenNames.has(name) ||
    forbiddenExtensions.some((extension) => name.endsWith(extension))
  ) {
    violations.push(relative);
  }
}

if (violations.length > 0) {
  console.error('HATA: Production paketinde bulunmaması gereken dosyalar tespit edildi:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('OK: Paket önbellek, bağımlılık klasörü, log, işletim sistemi artığı ve eski kök raporları içermiyor.');
