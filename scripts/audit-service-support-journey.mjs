import fs from 'node:fs';

const detailPath = 'app/components/services/ServiceDetail.tsx';
const supportPath = 'app/components/services/ServiceSupportLink.tsx';

const detail = fs.readFileSync(detailPath, 'utf8');
const support = fs.readFileSync(supportPath, 'utf8');

const checks = [
  ['Merkezi hizmet destek bileşeni kullanılıyor', detail.includes("import ServiceSupportLink from './ServiceSupportLink'")],
  ['Üst CTA bağlam taşıyor', detail.includes('source="hero"')],
  ['Yan panel CTA bağlam taşıyor', detail.includes('source="sidebar"')],
  ['Kapanış CTA bağlam taşıyor', detail.includes('source="closing"')],
  ['Genel WhatsApp değişkeni kaldırıldı', !detail.includes('const whatsapp =')],
  ['Hizmet URL’si mesaja ekleniyor', support.includes('https://bozumcu.net/hizmetler/${serviceSlug}')],
  ['Net ödeme tutarı mesajda isteniyor', support.includes('net ödeme tutarı')],
  ['Dönüşüm kaynağı izleniyor', support.includes("trackConversion('whatsapp_clicked'") && support.includes('service_${source}')],
  ['Yeni sekme güvenliği korunuyor', support.includes('target="_blank"') && support.includes('rel="noopener noreferrer"')],
];

let failed = 0;
for (const [label, passed] of checks) {
  console.log(`${passed ? '✓' : '✗'} ${label}`);
  if (!passed) failed += 1;
}

if (failed) {
  console.error(`\nHizmet destek yolculuğu denetimi başarısız: ${failed}/${checks.length}`);
  process.exit(1);
}

console.log(`\nHizmet destek yolculuğu denetimi başarılı: ${checks.length}/${checks.length}`);
