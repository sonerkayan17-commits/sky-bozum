import fs from 'node:fs';

const source = fs.readFileSync('app/bilgi-merkezi/page.tsx', 'utf8');
const checks = [
  ['search params accept repeated values', source.includes('type SearchParamValue = string | string[] | undefined')],
  ['array values use first item', source.includes('Array.isArray(value) ? value[0] : value')],
  ['query length is bounded', source.includes("firstParam(params.q, '', 100)")],
  ['category length is bounded', source.includes("firstParam(params.kategori, 'Tümü', 50)")],
  ['sort values are allowlisted', source.includes('allowedSorts.includes')],
  ['topic values are allowlisted', source.includes('allowedTopics.includes')],
  ['metadata uses normalized values', source.includes('const params = normalizeKnowledgeParams(await searchParams);')],
  ['page uses normalized values', source.includes('const { q, kategori, sirala, konu } = normalizeKnowledgeParams(await searchParams);')],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [label] of failed) console.error(`✖ ${label}`);
  process.exit(1);
}
console.log(`✓ Search parameter normalization: ${checks.length} checks passed.`);
