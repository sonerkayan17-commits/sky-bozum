import fs from 'node:fs';

const pages = [
  'faturaya-ek-cihaz-hesaplama','gift-card-hesaplama','hedef-odeme-hesaplama','islem-sihirbazi',
  'kod-adedi-hesaplama','mobil-odeme-hesaplama','oran-karsilastirma','sms-hesaplama'
];
const seo = fs.readFileSync('app/components/tools/ToolSeo.tsx','utf8');
const checks = [
  ['Breadcrumb schema', seo.includes("'@type': 'BreadcrumbList'")],
  ['WebApplication schema', seo.includes("'@type': 'WebApplication'")],
  ['Ücretsiz teklif bilgisi', seo.includes("price: '0'")],
  ['Görünür breadcrumb', seo.includes('aria-label="Sayfa yolu"')],
  ['İlgili araçlar', seo.includes('İlgili araçlar')],
  ['Mevcut aracın dışlanması', seo.includes('getRelatedTools(toolId)')],
  ['Tüm araçlara dönüş', seo.includes('/araclar')],
  ['Tüm sayfalarda entegrasyon', pages.every(slug => { const page = fs.readFileSync(`app/araclar/${slug}/page.tsx`,'utf8'); return page.includes('<ToolSeo ') || page.includes('<ToolPage '); }) && (seo.includes('ToolSeo') || fs.readFileSync('app/components/tools/ToolPage.tsx','utf8').includes('<ToolSeo '))],
  ['Karşılaştırma metni düzeltildi', !fs.readFileSync('app/araclar/oran-karsilastirma/page.tsx','utf8').includes('iki farklı hizmette')],
];
const failed=checks.filter(([,ok])=>!ok);
checks.forEach(([name,ok])=>console.log(`${ok?'✓':'✗'} ${name}`));
if(failed.length) process.exit(1);
console.log(`\nV34.5 denetimi geçti: ${checks.length}/${checks.length}`);
