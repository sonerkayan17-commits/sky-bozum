import fs from 'node:fs';

const component = fs.readFileSync(new URL('../app/components/services/ServiceDetail.tsx', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../app/hizmetler/[slug]/page.tsx', import.meta.url), 'utf8');
const checks = [
  ['mini calculator', component.includes('ServiceMiniCalculator')],
  ['internal guide links', component.includes('/bilgi-merkezi')],
  ['troubleshooting links', component.includes('/bilgi-merkezi/sorun-cozme')],
  ['rate calculator link', component.includes('/oran-hesapla')],
  ['internal alternatives', component.includes('alternatives.map')],
  ['service schema', page.includes("'@type': 'Service'")],
  ['breadcrumb schema', page.includes("'@type': 'BreadcrumbList'")],
  ['FAQ presentation omitted', !component.includes('service.faq.map')],
];
const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`);
if (failed.length) process.exit(1);
console.log(`\n${checks.length}/${checks.length} service template checks passed.`);
