import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const file=fs.readFileSync(path.join(root,'app/lib/premiumArticleCovers.ts'),'utf8');
const entries=[...file.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)].map(([,slug,src])=>({slug,src}));
const missing=entries.filter(({src})=>!fs.existsSync(path.join(root,'public',src.replace(/^\//,''))));
const duplicateSlugs=entries.map(x=>x.slug).filter((x,i,a)=>a.indexOf(x)!==i);
const duplicateSources=entries.map(x=>x.src).filter((x,i,a)=>a.indexOf(x)!==i);
if(missing.length||duplicateSlugs.length||duplicateSources.length){
 console.error({missing,duplicateSlugs:[...new Set(duplicateSlugs)],duplicateSources:[...new Set(duplicateSources)]});
 process.exit(1);
}
console.log(`OK: ${entries.length} premium kapak yolu mevcut ve benzersiz.`);
