import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const rules = read('firestore.rules');
const memberCase = read('app/components/member/MemberCommerceCase.tsx');
const orders = read('app/components/member/MemberOrders.tsx');
const operations = read('app/components/member/MemberOperations.tsx');
const admin = read('app/yonetim/AdminCommerceCasePanel.tsx');
const catalog = read('app/components/products/ProductCatalog.tsx');

const checks = [
  ['Satın alma bakiye, stok, kod ve siparişi tek işlemde değiştiriyor', catalog.includes('runTransaction') && catalog.includes('transaction.update(memberRef') && catalog.includes('transaction.update(selectedCodeRef') && catalog.includes('transaction.set(orderRef')],
  ['Teslimat sonrası gösterim hatası sipariş kaydına güvenli dönüş sağlıyor', catalog.includes('completedOrderId') && catalog.includes('Siparişlerim alanına kaydedildi')],
  ['Üye siparişe bağlı teslimat veya kod sorunu açabiliyor', orders.includes("allowedKinds={['delivery_issue', 'invalid_code']}")],
  ['Üye işlem aşamasına göre iptal veya ödeme incelemesi açabiliyor', operations.includes("? ['cancellation'] : ['payment_issue']")],
  ['İnceleme kaydı otomatik para veya kod değişikliği yapmadığını açıklıyor', memberCase.includes('otomatik iade, iptal veya ikinci ödeme oluşturmaz')],
  ['Kurallar inceleme kaydını gerçek sipariş veya işleme bağlıyor', rules.includes('match /commerceCases/{caseId}') && rules.includes('documents/productOrders/$(request.resource.data.targetId)') && rules.includes('documents/operations/$(request.resource.data.targetId)')],
  ['İptal talebi yalnız güvenli erken işlem aşamalarında açılıyor', rules.includes('data.status in ["new", "awaiting_product"]')],
  ['Üye finansal belgeyi inceleme talebi üzerinden değiştiremiyor', rules.includes('request.resource.data.diff(resource.data).affectedKeys().hasOnly(["status", "resolution", "updatedBy", "updatedAt"]')],
  ['Yönetici sonucu denetim kaydı ve üyeye bildirimle kapatıyor', admin.includes("batch.set(auditRef") && admin.includes("batch.set(notificationRef")],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log(`\nTicaret hata kurtarma denetimi: ${checks.length}/${checks.length}`);
