import fs from 'node:fs';
const detail = fs.readFileSync('app/components/services/ServiceDetail.tsx', 'utf8');
const component = fs.readFileSync('app/components/services/CardSmsPremiumSections.tsx', 'utf8');
const home = fs.readFileSync('app/page.tsx', 'utf8');
const checks = [
  ['SMS premium binding', detail.includes("mode=\"sms\"")],
  ['Card premium binding', detail.includes("mode=\"card\"")],
  ['Four control blocks', component.includes('Dört kritik noktayı netleştirin')],
  ['Troubleshooting routes', component.includes('mobil-odeme-sms-gelmiyor') && component.includes('odeme-beklemede-kaldi')],
  ['Calculator routes', component.includes('sms-mobil-odeme') && component.includes('kredi-karti-sanal-kart')],
  ['Home page untouched marker', home.length > 0],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} - ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`V33.6 audit: ${checks.length}/${checks.length} passed.`);
