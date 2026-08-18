import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const findings = [];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const search = read('app/components/SiteSearch.tsx');
if (!search.includes('searchIsLoading') || !search.includes('role="status"')) {
  findings.push('SiteSearch must show an accessible loading fallback while lazy search data loads.');
}
if (!search.includes('aria-describedby={statusId}')) {
  findings.push('SiteSearch input must announce result/loading status.');
}

const calculator = read('app/components/Calculator.tsx');
const quickCalculator = read('app/components/QuickCalculator.tsx');
if (!calculator.includes('aria-describedby="amount-help"')) {
  findings.push('Calculator amount input must reference helper/error text.');
}
if (!quickCalculator.includes('aria-describedby={amountHelpId}') || !quickCalculator.includes('id={amountHelpId}')) {
  findings.push('QuickCalculator amount input must reference helper/error text.');
}

for (const file of walk(join(root, 'app'))) {
  if (!['.tsx', '.ts'].includes(extname(file))) continue;
  const rel = relative(root, file).replaceAll('\\', '/');
  const source = read(rel);
  const imageTags = source.match(/<Image[\s\S]*?\/>/g) ?? [];

  for (const tag of imageTags) {
    if (!/\salt=/.test(tag)) findings.push(`${rel} has a next/image without alt text.`);
    if (/width=\{0\}|height=\{0\}/.test(tag)) findings.push(`${rel} has a zero-dimension next/image.`);
  }

  if (/<img\b/i.test(source) && !source.includes('performance-audit: allow-dynamic-img')) {
    findings.push(`${rel} uses raw img without an explicit audit allowance.`);
  }
}

if (findings.length) {
  for (const finding of findings) console.error(`FAIL ${finding}`);
  process.exitCode = 1;
} else {
  console.log('UI resilience audit passed.');
}
