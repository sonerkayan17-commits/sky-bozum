import fs from 'node:fs';

const page = fs.readFileSync('app/bilgi-merkezi/[slug]/page.tsx', 'utf8');
const component = fs.readFileSync('app/components/articles/ArticleSupportLink.tsx', 'utf8');
const checks = [
  ['contextual support component imported', page.includes("ArticleSupportLink from '../../components/articles/ArticleSupportLink'")],
  ['close CTA uses contextual support', page.includes('<ArticleSupportLink articleTitle={article.title} articleSlug={article.slug} serviceName={relatedService?.shortName} />')],
  ['sidebar CTA uses contextual support', page.includes('variant="sidebar"')],
  ['article URL included in WhatsApp message', component.includes('https://bozumcu.net/bilgi-merkezi/${articleSlug}')],
  ['service context included when available', component.includes('serviceName') && component.includes('hizmetiyle ilgili')],
  ['conversion event tracked', component.includes("trackConversion('whatsapp_clicked'")],
  ['new tab safety retained', component.includes('rel="noopener noreferrer"')],
];
let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log(`Article support journey: ${checks.length}/${checks.length} başarılı`);
