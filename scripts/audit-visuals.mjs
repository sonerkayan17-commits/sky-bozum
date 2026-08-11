import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);e.isDirectory()?walk(p):files.push(p)}}
walk(path.join(root,'public'));
const visuals=files.filter(f=>/\.(svg|webp|png|jpe?g)$/i.test(f));
const hashes=new Map();
for(const f of visuals){const h=crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');const a=hashes.get(h)||[];a.push(path.relative(root,f));hashes.set(h,a)}
const dup=[...hashes.values()].filter(a=>a.length>1);
if(dup.length){console.error('Birebir kopya görseller:',dup);process.exit(1)}
console.log(`OK: ${visuals.length} görsel tarandı; birebir kopya bulunmadı.`);
