import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const appRoot = join(root, 'app');
const publicRoot = join(root, 'public');
const textExt = new Set(['.ts','.tsx','.js','.jsx','.css']);
const imageExt = new Set(['.png','.jpg','.jpeg','.webp','.avif','.svg']);
const findings = [];
let clientComponents = 0;
let filesScanned = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}

for (const file of await walk(appRoot)) {
  if (!textExt.has(extname(file))) continue;
  filesScanned++;
  const source = await readFile(file, 'utf8');
  const rel = relative(root, file);
  const isClientComponent = /^["']use client["'];?/m.test(source);
  if (isClientComponent) {
    clientComponents++;
    const importsHeavySiteModule = source.split(/\r?\n/).some((line) => /import\s+(?!type\b)[^;\n]+from\s+["'][^"']*lib\/site["']/.test(line));
    if (importsHeavySiteModule) findings.push({ level:'error', file:rel, message:'Client component ağır app/lib/site modülünü doğrudan içe aktarıyor; hafif site-config veya type-only import kullanılmalı.' });
  }
  if (/<img\b/i.test(source)) findings.push({ level:'error', file:rel, message:'Ham <img> etiketi bulundu; next/image tercih edilmeli.' });
  if (/setInterval\s*\(/.test(source)) findings.push({ level:'warn', file:rel, message:'setInterval kullanımı ana iş parçacığını sürekli meşgul edebilir.' });
  if (/window\.addEventListener\([^)]*(scroll|resize)/.test(source) && !/passive\s*:\s*true/.test(source)) findings.push({ level:'warn', file:rel, message:'Scroll/resize dinleyicisi passive olmayabilir.' });
  if (source.length > 140_000) findings.push({ level:'warn', file:rel, message:`Kaynak dosya büyük: ${(source.length/1024).toFixed(1)} KB.` });
}

let publicBytes = 0;
for (const file of await walk(publicRoot)) {
  if (!imageExt.has(extname(file).toLowerCase())) continue;
  const info = await stat(file);
  publicBytes += info.size;
  const rel = relative(root, file);
  if (info.size > 250_000) findings.push({ level:'warn', file:rel, message:`Görsel ${(info.size/1024).toFixed(1)} KB; sıkıştırma önerilir.` });
}

const errors = findings.filter((item) => item.level === 'error');
console.log(`Performance audit: ${filesScanned} kaynak dosyası, ${clientComponents} client component, ${(publicBytes/1024).toFixed(1)} KB public görsel.`);
if (!findings.length) console.log('Kritik veya şüpheli performans bulgusu yok.');
for (const item of findings) console.log(`${item.level.toUpperCase()} ${item.file}: ${item.message}`);
if (errors.length) process.exitCode = 1;
