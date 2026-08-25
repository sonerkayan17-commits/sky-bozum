import fs from 'node:fs';

const panel = fs.readFileSync('app/yonetim/AdminConversionPanel.tsx', 'utf8');
const consoleSource = fs.readFileSync('app/yonetim/AdminConsole.tsx', 'utf8');
const rules = fs.readFileSync('firestore.rules', 'utf8');
const checks = [
  ['panel yönetim navigasyonunda', consoleSource.includes('["analytics", "Dönüşüm analitiği"]') && consoleSource.includes('<AdminConversionPanel db={db} />')],
  ['yalnız gerçek koleksiyonları kullanıyor', ['productOrders', 'stockAlerts', 'operations', 'commerceCases'].every((name) => panel.includes(`'${name}'`))],
  ['kişisel alanları ekrana basmıyor', !/userEmail|contact|iban|codeEncrypted|codesEncrypted/.test(panel)],
  ['30 günlük dönem karşılaştırması var', panel.includes('30 * DAY') && panel.includes('60 * DAY')],
  ['ürün ve işlem hunileri var', panel.includes('Talep → dijital teslimat') && panel.includes('Talep → tamamlanan ödeme')],
  ['sahte başlangıç verisi yok', !/Math\.random|fixture|seedData|fake/i.test(panel)],
  ['kaynak koleksiyonlar admin okumaya açık', rules.includes('match /productOrders/{orderId}') && rules.includes('allow get, list: if isAdmin()') && rules.includes('match /stockAlerts/{alertId}')],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log(`\n${checks.length}/${checks.length} dönüşüm analitiği denetimi geçti.`);
