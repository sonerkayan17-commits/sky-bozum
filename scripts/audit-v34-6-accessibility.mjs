import fs from 'node:fs';

const checks = [
  ['app/components/Calculator.tsx', ['id="calculator-service"', 'id="calculator-amount"', 'role="status"', 'aria-live="polite"', 'role="group"']],
  ['app/components/tools/UtilityCalculators.tsx', ['role="radiogroup"', 'role="radio"', 'aria-checked=', 'id="code-total"', 'id="code-values"', 'id="device-price"', 'aria-atomic="true"']],
];
let failed = false;
for (const [file, needles] of checks) {
  const text = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!text.includes(needle)) {
      console.error(`Eksik: ${needle} -> ${file}`);
      failed = true;
    }
  }
}
if (failed) process.exit(1);
console.log('V34.6 araç erişilebilirlik denetimi başarılı.');
