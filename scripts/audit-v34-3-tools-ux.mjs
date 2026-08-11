import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const componentPath = path.join(root, 'app/components/tools/UtilityCalculators.tsx');
const source = fs.readFileSync(componentPath, 'utf8');
const checks = [
  ['Hızlı tutar seçenekleri', source.includes('QuickAmounts') && source.includes("['500', '1000', '2500', '5000']")],
  ['Hedef ödeme erişilebilir yardım bağlantısı', source.includes('aria-describedby="target-payout-help"')],
  ['Karşılaştırma erişilebilir yardım bağlantısı', source.includes('aria-describedby="rate-comparison-help"')],
  ['Mobil yatay tablo güvenliği', source.includes('overflow-x-auto') && source.includes('min-w-[620px]')],
  ['Karşılaştırma bölgesi klavye erişimi', source.includes('tabIndex={0}')],
  ['Sihirbaz seçim durumu', source.includes('aria-pressed={choice===key}')],
  ['Sihirbaz odak görünürlüğü', source.includes('focus-visible:ring-2')],
  ['SSS yönlendirmesi kaldırıldı', !source.includes("guide:'/sss'")],
  ['İletişim yönlendirmesi', source.includes("guide:'/iletisim'")],
  ['Tutar üst sınırı korunuyor', source.includes('value <= 1_000_000')],
];
let passed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${name}`);
  if (ok) passed++;
}
console.log(`\nV34.3 audit: ${passed}/${checks.length} başarılı`);
if (passed !== checks.length) process.exit(1);
