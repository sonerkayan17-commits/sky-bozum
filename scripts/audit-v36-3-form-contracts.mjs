import fs from 'node:fs';

const file = 'app/components/tools/UtilityCalculators.tsx';
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['Hedef ödeme hizmet etiketi', 'htmlFor="target-service"', 'id="target-service"'],
  ['Hedef ödeme tutar etiketi', 'htmlFor="target-payout"', 'id="target-payout"'],
  ['Oran karşılaştırma etiketi', 'htmlFor="rate-comparison-amount"', 'id="rate-comparison-amount"'],
  ['Kod değeri etiketi', 'htmlFor="code-values"', 'id="code-values"'],
  ['Kod alanı yardım bağlantısı', 'id="code-values"', 'aria-describedby="code-count-help"'],
  ['Cihaz fiyatı hata durumu', 'id="device-price"', 'aria-invalid={Boolean(error)}'],
  ['Cihaz peşinatı hata durumu', 'id="device-down-payment"', 'aria-invalid={Boolean(error)}'],
  ['Cihaz ek bedeli hata durumu', 'id="device-monthly-fee"', 'aria-invalid={Boolean(error)}'],
];
let failed = false;
for (const [label, ...needles] of checks) {
  const ok = needles.every((needle) => source.includes(needle));
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed = true;
}
const unlabeled = [...source.matchAll(/<label(?![^>]*htmlFor=)[^>]*>/g)].length;
if (unlabeled) {
  console.log(`✗ htmlFor bulunmayan label sayısı: ${unlabeled}`);
  failed = true;
} else {
  console.log('✓ Tüm araç label öğeleri açık htmlFor bağlantısına sahip');
}
if (failed) process.exit(1);
console.log('\nV36.3 form sözleşmeleri denetimi geçti.');
