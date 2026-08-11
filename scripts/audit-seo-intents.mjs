import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];
function walk(dir){ for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const full=path.join(dir,entry.name); if(entry.isDirectory()) walk(full); else if(/\.(ts|tsx)$/.test(entry.name)) files.push(full); } }
walk(path.join(root,'app'));
const text = files.map(file=>fs.readFileSync(file,'utf8')).join('\n');
const checks = [
  ['Arama niyeti veri modeli', text.includes('export const searchIntents')],
  ['Kapsama raporu', text.includes('getIntentCoverage')],
  ['Eksik içerik kuyruğu', text.includes('getMissingIntents')],
  ['Arama niyeti merkezi', text.includes('Arama Niyeti ve Rehber Haritası')],
  ['Canonical metadata', text.includes("canonical: '/bilgi-merkezi/arama-niyeti'")],
];
console.log('Sky Bozum V31 SEO niyet denetimi');
for(const [label,ok] of checks) console.log(`${ok?'✓':'✗'} ${label}`);
if(checks.some(([,ok])=>!ok)) process.exit(1);
console.log(`✓ ${files.length} TypeScript/TSX dosyası tarandı.`);
