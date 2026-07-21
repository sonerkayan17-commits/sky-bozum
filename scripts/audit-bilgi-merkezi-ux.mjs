import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const explorer = fs.readFileSync(path.join(root, 'app/components/articles/ArticleExplorer.tsx'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/page.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');

const checks = [
  ['search input has explicit label', explorer.includes('htmlFor="article-search"')],
  ['search supports keyboard shortcut', explorer.includes("event.key === '/' ")],
  ['escape clears focused search', explorer.includes("event.key === 'Escape'")],
  ['search autocomplete disabled', explorer.includes('autoComplete="off"')],
  ['search enter key optimized', explorer.includes('enterKeyHint="search"')],
  ['sort select has accessible name', explorer.includes('aria-label="Rehber sıralaması"')],
  ['category select has accessible name', explorer.includes('aria-label="Rehber kategorisi"')],
  ['topic group is semantic', explorer.includes('role="group"')],
  ['topic buttons expose pressed state', explorer.includes('aria-pressed={topic === item}')],
  ['result count is announced', explorer.includes('aria-live="polite"')],
  ['featured section is labelled', explorer.includes('aria-labelledby="featured-guides-title"')],
  ['lower sections use rendering budget', explorer.includes('render-later')],
  ['sticky toolbar is enabled', explorer.includes('editorial-toolbar sticky')],
  ['mobile topic strip hides scrollbar', css.includes('.editorial-topic-scroll::-webkit-scrollbar')],
  ['reduced motion is respected', css.includes('@media(prefers-reduced-motion:reduce)')],
  ['touch devices avoid hover lift', css.includes('@media(hover:none)')],
  ['hero typography has mobile scale', page.includes('text-[2.45rem]')],
  ['editorial cards use isolated paint layer', css.includes('isolation:isolate')],
  ['search state remains URL-backed', explorer.includes('window.history.replaceState')],
  ['FAQ area is not referenced', !explorer.toLowerCase().includes('sss') && !page.toLowerCase().includes('sss')],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
if (failed.length) {
  console.error(`\n${failed.length} UX audit check(s) failed.`);
  process.exit(1);
}
console.log(`\nBilgi Merkezi UX audit passed: ${checks.length}/${checks.length}`);
