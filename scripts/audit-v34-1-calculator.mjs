import fs from 'node:fs';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');
const calculator = read('app/components/Calculator.tsx');
const page = read('app/oran-hesapla/page.tsx');
const home = fs.readFileSync(new URL('app/page.tsx', root));
const expectedHomeHash = process.env.EXPECTED_HOME_HASH;
const checks = [
  ['quick amount controls', calculator.includes('quickAmounts') && calculator.includes('Hızlı tutar seçenekleri')],
  ['difference summary', calculator.includes('Tahmini fark')],
  ['aria live validation', calculator.includes('aria-live="polite"')],
  ['whatsapp confirmation wording', calculator.includes('güncel oranı teyit et')],
  ['advanced internal tools', calculator.includes('/araclar/hedef-odeme-hesaplama') && calculator.includes('/araclar/oran-karsilastirma')],
  ['canonical metadata', page.includes("canonical: '/oran-hesapla'")],
  ['open graph metadata', page.includes('openGraph:')],
  ['no FAQ content', !calculator.toLocaleLowerCase('tr').includes('sıkça sorulan')],
];
if (expectedHomeHash) {
  const actual = crypto.createHash('sha256').update(home).digest('hex');
  checks.push(['homepage locked', actual === expectedHomeHash]);
}
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed += 1;
}
console.log(`\n${checks.length - failed}/${checks.length} checks passed.`);
process.exitCode = failed ? 1 : 0;
