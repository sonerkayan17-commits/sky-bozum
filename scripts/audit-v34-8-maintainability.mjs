import fs from 'node:fs';

const registry = fs.readFileSync('app/lib/tools.ts', 'utf8');
const toolPage = fs.readFileSync('app/components/tools/ToolPage.tsx', 'utf8');
const toolSeo = fs.readFileSync('app/components/tools/ToolSeo.tsx', 'utf8');
const pageFiles = [
  'faturaya-ek-cihaz-hesaplama','gift-card-hesaplama','hedef-odeme-hesaplama','islem-sihirbazi',
  'kod-adedi-hesaplama','mobil-odeme-hesaplama','oran-karsilastirma','sms-hesaplama'
].map((slug) => fs.readFileSync(`app/araclar/${slug}/page.tsx`, 'utf8'));

const checks = [
  ['Tip güvenli araç kimlikleri', registry.includes('export type ToolId =')],
  ['Merkezi araç tanımları', registry.includes('const definitions: Record<ToolId, ToolDefinition>')],
  ['Merkezi metadata üretimi', registry.includes('export function createToolMetadata')],
  ['Bağlama özel ilgili araçlar', registry.includes('related: readonly ToolId[]') && toolSeo.includes('getRelatedTools(toolId)')],
  ['Tek kaynaklı sayfa metinleri', toolPage.includes('getToolDefinition(toolId)')],
  ['Tek kaynaklı SEO şeması', toolSeo.includes('tool.seoDescription') && toolSeo.includes('tool.href')],
  ['Sabit alan adı kaldırıldı', !toolSeo.includes("const baseUrl = 'https://bozumcu.net'")],
  ['Sayfalar yalnız kimlik ve hesaplayıcı taşır', pageFiles.every((text) => text.includes('createToolMetadata') && text.includes('toolId=') && !text.includes('seoDescription='))],
  ['Tüm araçlarda üç ilişkili hedef', (registry.match(/related: \[[^\]]+\]/g) || []).every((entry) => (entry.match(/'/g) || []).length === 6)],
];

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([name, ok]) => console.log(`${ok ? '✓' : '✗'} ${name}`));
if (failed.length) process.exit(1);
console.log(`\nV34.8 denetimi geçti: ${checks.length}/${checks.length}`);
