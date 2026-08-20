import { readFileSync } from 'node:fs';

const files = {
  rules: readFileSync('firestore.rules', 'utf8'),
  encrypt: readFileSync('app/api/code-sale/encrypt/route.ts', 'utf8'),
  reveal: readFileSync('app/api/admin/code-sales/reveal/route.ts', 'utf8'),
  admin: readFileSync('app/yonetim/AdminOperationPanel.tsx', 'utf8'),
  member: readFileSync('app/components/member/MemberOperations.tsx', 'utf8'),
  wallet: readFileSync('app/components/member/MemberWallet.tsx', 'utf8'),
};

const checks = [
  ['Kodlar sunucuda şifreleniyor', files.encrypt.includes('encryptStockCode(code)') && files.encrypt.includes("stockCodeHash('razer-code-sale', 'all'")],
  ['Kod gönderimi doğrulanmış oturum istiyor', files.encrypt.includes('verifyFirebaseIdentity(request)') && files.encrypt.includes('identity.emailVerified')],
  ['Kod kasası yalnız yöneticiye açılıyor', files.reveal.includes('requireStoreAdmin(identity)') && files.reveal.includes("'Cache-Control': 'no-store'")],
  ['Tamamlanmış kod kasası yeniden açılmıyor', files.reveal.includes("status === 'completed'") && files.reveal.includes("status === 'cancelled'")],
  ['Tekil kod talepleri korunuyor', files.rules.includes('match /codeSaleClaims/{claimId}') && files.rules.includes('allow update, delete: if false;')],
  ['Üye ve admin IBAN erişimi sınırlandırılmış', files.rules.includes('match /memberPrivate/{memberId}') && files.rules.includes('allow read: if isAdmin() || (signedIn() && request.auth.uid == memberId)')],
  ['Kod alanları yönetici güncellemesinde değiştirilemiyor', files.rules.includes('request.resource.data.codesEncrypted == resource.data.codesEncrypted') && files.rules.includes('request.resource.data.codeHashes == resource.data.codeHashes')],
  ['Her kod için ayrı inceleme sonucu var', files.admin.includes('reviewCode(operation, index') && files.admin.includes('approvedCodeCount') && files.admin.includes('rejectedCodeCount')],
  ['Ödeme öncesi tüm kodlar inceleniyor', files.admin.includes('operation.codeReviews.length !== operation.codeCount')],
  ['Bakiye ödemesi tek transaction içinde', files.admin.includes('runTransaction') && files.admin.includes("`code-sale-${operation.id}`") && files.admin.includes("payoutState: 'paid'")],
  ['Üye inceleme ve ödeme sonucunu izliyor', files.member.includes('member-code-review-result') && files.member.includes('payoutReference')],
  ['Cüzdan gerçek zamanlı hesap defterini izliyor', files.wallet.includes("collection(db, 'memberLedger')") && files.wallet.includes('onSnapshot')],
];

let failed = 0;
for (const [label, passed] of checks) {
  console.log(`${passed ? 'OK' : 'FAIL'} ${label}`);
  if (!passed) failed += 1;
}

if (failed) {
  console.error(`Kod satış akışı denetiminde ${failed} kontrol başarısız.`);
  process.exit(1);
}

console.log('Razer Gold kod satış ve ödeme akışı denetimi geçti.');
