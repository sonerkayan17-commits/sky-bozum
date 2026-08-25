import { readdir, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const publicRoot = join(root, 'public');
const rasterExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const maxFileBytes = 250 * 1024;
// The whole public library includes route-specific covers that are lazy-loaded
// only when their own page is visited. Keep a separate deploy-library ceiling
// rather than treating all of them as the first-page network payload.
const maxPublicBytes = 18 * 1024 * 1024;
const findings = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const rasterFiles = [];
for (const file of await walk(publicRoot)) {
  if (!rasterExtensions.has(extname(file).toLowerCase())) continue;
  const info = await stat(file);
  rasterFiles.push({ file, size: info.size });
  if (info.size > maxFileBytes) {
    findings.push({
      file: relative(root, file),
      message: `${formatBytes(info.size)} exceeds the per-raster budget of ${formatBytes(maxFileBytes)}.`,
    });
  }
}

const totalBytes = rasterFiles.reduce((sum, item) => sum + item.size, 0);
if (totalBytes > maxPublicBytes) {
  findings.push({
    file: 'public',
    message: `${formatBytes(totalBytes)} exceeds the public raster budget of ${formatBytes(maxPublicBytes)}.`,
  });
}

console.log(`Image budget audit: ${rasterFiles.length} public raster files, ${formatBytes(totalBytes)} total.`);
console.log(`Budgets: ${formatBytes(maxFileBytes)} per delivered raster, ${formatBytes(maxPublicBytes)} total route-specific public library.`);

if (findings.length) {
  for (const finding of findings) console.error(`ERROR ${finding.file}: ${finding.message}`);
  process.exitCode = 1;
} else {
  console.log('Image budgets passed.');
}
