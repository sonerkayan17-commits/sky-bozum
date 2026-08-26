import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'app', 'lib', 'legacyRedirects.ts'), 'utf8');
const entries = [...source.matchAll(/source:\s*'([^']+)'\s*,\s*destination:\s*'([^']+)'/g)].map((match) => ({ source: match[1], destination: match[2] }));
const failures = [];
const sources = new Set(entries.map((entry) => entry.source));

if (entries.length < 10) failures.push(`yönlendirme haritası beklenenden küçük (${entries.length})`);
for (const entry of entries) {
  if (!entry.source.startsWith('/') || !entry.destination.startsWith('/')) failures.push(`yalnız site içi mutlak yollar kullanılmalı: ${entry.source}`);
  if (entry.source === entry.destination) failures.push(`kendine yönlendirme: ${entry.source}`);
  if (sources.has(entry.destination)) failures.push(`yönlendirme zinciri: ${entry.source} -> ${entry.destination}`);
  const output = entry.destination === '/' ? path.join(root, '.next', 'server', 'app', 'index.html') : path.join(root, '.next', 'server', 'app', `${entry.destination.slice(1)}.html`);
  if (!fs.existsSync(output)) failures.push(`hedef build çıktısında yok: ${entry.destination}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`PASS ${entries.length} kalıcı yönlendirme; hedefler mevcut, zincir veya döngü yok.`);
