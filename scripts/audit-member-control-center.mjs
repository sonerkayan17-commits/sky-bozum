import { readFile } from 'node:fs/promises';

const files = Object.fromEntries(await Promise.all([
  ['notifications', 'app/components/member/MemberNotifications.tsx'],
  ['orders', 'app/components/member/MemberOrders.tsx'],
  ['catalog', 'app/components/products/ProductCatalog.tsx'],
  ['content', 'app/lib/contentAdmin.ts'],
  ['admin', 'app/yonetim/AdminConsole.tsx'],
  ['memberHub', 'app/components/member/MemberHub.tsx'],
  ['memberProgress', 'app/lib/memberProgress.ts'],
  ['forum', 'app/yonetim/ForumModerationPanel.tsx'],
  ['release', 'app/yonetim/ReleaseReadinessPanel.tsx'],
  ['rules', 'firestore.rules'],
].map(async ([key, path]) => [key, await readFile(path, 'utf8')])));

const checks = [
  ['Üye sosyal, mesaj ve stok bildirimlerini ayrı yönetiyor', files.notifications.includes("togglePreference('social')") && files.notifications.includes("togglePreference('messages')") && files.notifications.includes("togglePreference('stock')")],
  ['Para ve güvenlik bildirimleri tercihlerden bağımsız kalıyor', files.notifications.includes('preferenceKey') && files.notifications.includes('return null')],
  ['Bildirim tercihleri yalnız hesap sahibi tarafından yazılıyor', files.rules.includes('match /notificationPreferences/{memberId}') && files.rules.includes('request.auth.uid == memberId')],
  ['Dijital teslimat iptal ve sorun koşulunu açıkça gösteriyor', files.orders.includes('İPTAL / SORUN BİLDİRİMİ') && files.orders.includes('otomatik iptal yapılamaz')],
  ['Başarısız satın alma sonrası paket seçimi korunuyor', files.catalog.includes('sky-product-selection:') && files.catalog.includes('Seçiminiz bu oturum için korundu')],
  ['İçerik yeniden inceleme tarihi veri modelinde mevcut', files.content.includes('reviewDueAt')],
  ['Yönetim geciken içerik kontrollerini ayırıyor', files.admin.includes('admin-review-date') && files.admin.includes('is-overdue')],
  ['Üye merkezi eksik profil adımlarını görünür kılıyor', files.memberHub.includes('PROFİL TAMAMLAMA') && files.memberHub.includes('profileCompletion')],
  ['Seviye avantajları doğrulanmış işlem teyidine bağlı anlatılıyor', files.memberProgress.includes('yönetim teyitli') && files.memberHub.includes('yalnız yönetim defterine işlenen') && files.memberHub.includes('doğrulanmış hareketlerden')],
  ['Forum onay kuyruğu bekleyen konuları öncelikli açıyor', files.forum.includes('ONAY KUYRUĞU') && /useState<[\s\S]{0,160}>\(["']pending["']\)/.test(files.forum)],
  ['Yasal metin, referans ve e-posta itibarı yayın kontrolünde', files.release.includes('legalConsistencyReviewed') && files.release.includes('referenceFreshnessReviewed') && files.release.includes('emailReputationMonitored')],
];

let failed = 0;
for (const [label, result] of checks) {
  if (!result) failed += 1;
  console.log(`${result ? 'OK' : 'FAIL'} ${label}`);
}
if (failed) process.exit(1);
console.log(`Üye ve içerik kontrol merkezi denetimi geçti (${checks.length}/${checks.length}).`);
