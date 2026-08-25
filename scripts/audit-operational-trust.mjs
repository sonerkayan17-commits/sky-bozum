import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const account = read('app/components/AccountAccess.tsx');
const member = read('app/components/member/MemberHub.tsx');
const authActions = read('app/lib/auth-actions.ts');
const privacy = read('app/gizlilik-politikasi/page.tsx');
const terms = read('app/kullanim-sartlari/page.tsx');
const management = read('app/yonetim/ReleaseReadinessPanel.tsx');
const managementPage = read('app/yonetim/page.tsx');

const checks = [
  ['E-posta işlemleri merkezi ana alan adına dönüyor', authActions.includes('SITE_URL') && authActions.includes('handleCodeInApp: false')],
  ['Kayıt doğrulama bağlantısı güvenli ayarı kullanıyor', account.includes('sendEmailVerification(result.user, authActionSettings())')],
  ['Parola yenileme bağlantısı güvenli ayarı kullanıyor', account.includes('sendPasswordResetEmail(auth, email.trim(), authActionSettings())')],
  ['Üye merkezi aynı e-posta sözleşmesini kullanıyor', member.includes("authActionSettings('/hesabim')")],
  ['Gizlilik metni teknik sağlayıcıları ve iletişimi açıklıyor', privacy.includes('Hizmet sağlayıcıları') && privacy.includes('siteConfig.email') && privacy.includes('siteConfig.domain')],
  ['Kullanım şartları bağımsız hizmet ve uyuşmazlık akışını açıklıyor', terms.includes('Bağımsız hizmet modeli') && terms.includes('İptal, uyuşmazlık ve iletişim')],
  ['Referans güncelliği gerçek yayın verisinden hesaplanıyor', managementPage.includes('latestReferenceAt') && management.includes('referenceAgeDays')],
  ['Eski referanslar otomatik olarak dikkat durumuna düşüyor', management.includes("referenceAgeDays > 180") && management.includes('Yenileme gerekli')],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log(`\nOperasyonel güven denetimi: ${checks.length}/${checks.length}`);
