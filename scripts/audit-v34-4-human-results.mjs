import fs from 'node:fs';
const files = ['app/components/Calculator.tsx','app/components/tools/UtilityCalculators.tsx'];
const checks = [
  ['service-specific guidance', 'serviceChecks'],
  ['contextual tool notes', 'serviceNotes'],
  ['empty amount validation', 'Tutar alanını boş bırakmayın'],
  ['non-transaction CTA clarification', 'işlem başlatmaz'],
  ['fixed-rate handling', 'isFixed'],
  ['security language', 'Kart bilgisi'],
];
const content = files.map(file => fs.readFileSync(file,'utf8')).join('\n');
let failed = 0;
for (const [label, needle] of checks) {
  const ok = content.includes(needle);
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
console.log('V34.4 human-result audit passed.');
