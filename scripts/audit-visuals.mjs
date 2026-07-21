import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dir = path.join(root, 'public', 'article-covers-v32-5');
const files = fs.readdirSync(dir).filter((file) => file.endsWith('.svg'));
const invalid = files.filter((file) => !fs.readFileSync(path.join(dir, file), 'utf8').includes('viewBox="0 0 1200 675"'));
console.log(`V32.5 premium covers: ${files.length}`);
console.log(`Invalid dimensions: ${invalid.length}`);
if (files.length !== 12 || invalid.length) process.exit(1);
