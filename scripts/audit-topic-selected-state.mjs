import fs from 'node:fs';

const source = fs.readFileSync('app/components/articles/ArticleExplorer.tsx', 'utf8');
const quickStart = /onClick=\{\(\) => openTopic\(item\)\}[^>]*aria-pressed=\{topic === item\}[^>]*className=\"focus-ring group (?:relative overflow-hidden )?rounded-2xl/.test(source);
const emptyState = /onClick=\{\(\) => openTopic\(item\)\}[^>]*aria-pressed=\{topic === item\}[^>]*className=\"focus-ring rounded-full border border-white\/10/.test(source);
if (!quickStart || !emptyState) {
  console.error('Konu seçim düğmelerinin aria-pressed durumu eksik.');
  process.exit(1);
}
console.log('Konu seçim düğmelerinin seçili durumları doğrulandı.');
