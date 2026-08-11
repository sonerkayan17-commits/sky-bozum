import { spawnSync } from 'node:child_process';

const audits = [
  ['V36.3 Form sözleşmeleri', 'audit:v36-3'],
  ['V36.2 Bakım mimarisi', 'audit:v36-2'],
  ['V36.1 Üretim hazırlığı', 'audit:v36-1'],
  ['İç bağlantılar', 'audit:links'],
  ['Performans', 'audit:performance'],
  ['Teknik SEO', 'audit:v35-1'],
  ['Araçlar bakım mimarisi', 'audit:v34-8'],
];

const failures = [];

for (const [label, script] of audits) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync('npm', ['run', script], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) failures.push(`${label} (${script})`);
}

console.log('\n=== V36.4 Sürüm Kalite Kapısı Özeti ===');
if (failures.length) {
  for (const item of failures) console.error(`FAIL ${item}`);
  process.exit(1);
}

console.log(`PASS ${audits.length}/${audits.length} kritik denetim başarıyla tamamlandı.`);
console.log('Ana sayfa, S.S.S. ve Referanslar kilit koruması V36.1 denetimi içinde doğrulandı.');
