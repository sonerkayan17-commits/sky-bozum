import fs from 'node:fs';

const source = fs.readFileSync('app/components/articles/ArticleExplorer.tsx', 'utf8');
const checks = [
  ['interaction state exists', source.includes('const [hasResultInteraction, setHasResultInteraction] = useState(false);')],
  ['initial and pending status is empty', /const resultStatus = !hasResultInteraction \|\| searchIsPending[\s\S]*?\? ''/.test(source)],
  ['search input activates announcements', source.includes('setHasResultInteraction(true); setQuery(event.target.value.slice(0, 100));')],
  ['sort activates announcements', source.includes('setHasResultInteraction(true); setSort(event.target.value as SortMode);')],
  ['category activates announcements', source.includes('setHasResultInteraction(true); setCategory(event.target.value);')],
  ['topic activates announcements', source.includes('setHasResultInteraction(true); setTopic(item);')],
  ['history navigation activates announcements', /if \(!stateWillChange\) return;[\s\S]*?suppressNextUrlSyncRef\.current = true;[\s\S]*?setHasResultInteraction\(true\);/.test(source)],
];

let failed = false;
for (const [label, passed] of checks) {
  console.log(`${passed ? '✓' : '✗'} ${label}`);
  if (!passed) failed = true;
}
if (failed) process.exit(1);
console.log(`Initial live-region silence audit passed (${checks.length}/${checks.length}).`);
