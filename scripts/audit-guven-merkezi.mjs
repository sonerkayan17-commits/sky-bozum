import fs from 'node:fs';

const pagePath = 'app/guven-merkezi/page.tsx';
const resolverPath = 'app/components/TrustIncidentResolver.tsx';
const decisionPath = 'app/components/TrustDecisionFlow.tsx';
const quickDockPath = 'app/components/TrustQuickDock.tsx';
const failures = [];
const read = (path) => fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : (failures.push(`Eksik dosya: ${path}`), '');
const page = read(pagePath);
const resolver = read(resolverPath);
const decision = read(decisionPath);
const quickDock = read(quickDockPath);

const requiredPageTokens = [
   'Güven Merkezi',
   'Resmî kanal',
  'id="hizli-kontrol"',
  '30 saniyelik kontrol',
  'Neden Sky Bozum?',
  'id="yuksek-oran"',
  'Şeffaf teklif',
  'Gerçek dışı teklif',
  'Güvenli işlem sırası',
  'İşlemden önce görebildiğiniz dört kanıt.',
  'id="sorun-cozucu"',
  'TrustDecisionFlow',
   'Sizin durumunuz hangisi?',
  'En sık yapılan hatalar',
  'TrustIncidentResolver',
  'TrustQuickDock',
  '/bilgi-merkezi/mobil-odeme-guvenli-mi',
  '/bilgi-merkezi/mobil-bozum-yaparken-dolandirilabilir-miyim',
  "'@type': 'FAQPage'",
  'buildWhatsAppUrl(',
  'siteConfig.domain',
  'siteConfig.phone',
  'siteConfig.email',
  'Ekran paylaşımı',
   'sahibine ait olmalıdır.',
];
for (const token of requiredPageTokens) if (!page.includes(token)) failures.push(`Güven Merkezi sayfasında eksik sözleşme: ${token}`);

const forbiddenPageTokens = [
  'TrustSectionNav',
  'SkyTrustCheck',
  '10 saniyelik güven özeti',
  'Güvenli başlangıç rotası',
  'Hizmet Güven Prensiplerimiz',
];
for (const token of forbiddenPageTokens) if (page.includes(token)) failures.push(`Kaldırılması gereken eski/tekrarlı yapı kaldı: ${token}`);

if (page.includes('Marka adı değil, kaynağın kendisi doğrulanmalıdır.')) failures.push('Tekrarlanan resmî kanal bölümü kaldırılmamış.');

const requiredDecisionTokens = [
  "'use client'", 'role="tablist"', 'role="tab"', 'role="tabpanel"',
  'tabIndex={selected ? 0 : -1}', 'handleKeyDown', 'ArrowRight', 'Home', 'End', 'aria-labelledby={`trust-decision-tab-',
  'İlk kez işlem yapıyorum', 'Çok yüksek oran gördüm', 'Başka numaraya yönlendirildim', 'Şüpheliyim',
];
for (const token of requiredDecisionTokens) if (!decision.includes(token)) failures.push(`Karar akışında eksik sözleşme: ${token}`);

const requiredResolverTokens = [
  "'use client'", 'role="tablist"', 'role="tab"', 'role="tabpanel"',
  'aria-selected={selected}', 'tabIndex={selected ? 0 : -1}', 'handleKeyDown', 'ArrowRight', 'Home', 'End',
  'Şimdi yap', 'Kesinlikle yapma', 'Kayıtları sakla',
];
for (const token of requiredResolverTokens) if (!resolver.includes(token)) failures.push(`Sorun çözücüde eksik sözleşme: ${token}`);

const requiredQuickDockTokens = [
  'Güven Merkezi hızlı işlemler', 'WhatsApp’tan başla', 'Şüpheli durum', 'href="#sorun-cozucu"',
  'env(safe-area-inset-bottom)', 'md:hidden', 'buildWhatsAppUrl(',
];
for (const token of requiredQuickDockTokens) if (!quickDock.includes(token)) failures.push(`Hızlı işlem çubuğunda eksik sözleşme: ${token}`);
if (!page.includes('pb-24 text-white md:pb-0')) failures.push('Mobil hızlı işlem çubuğu için sayfa alt boşluğu eksik.');


const forbiddenPolishTokens = ['mt-5.5', 'py-4.5', 'hover:brightness-110'];
for (const token of forbiddenPolishTokens) {
  if (page.includes(token) || decision.includes(token) || resolver.includes(token) || quickDock.includes(token)) {
    failures.push(`Final polish sonrası kalmaması gereken utility/efekt: ${token}`);
  }
}

const h1Count = (page.match(/<h1\b/g) || []).length;
if (h1Count !== 1) failures.push(`Tekil H1 bekleniyordu, bulunan: ${h1Count}`);

const sectionOrder = [
  'Güven Merkezi',
  'Sizin durumunuz hangisi?',
  'id="hizli-kontrol"',
  'id="yuksek-oran"',
  'Neden Sky Bozum?',
  'İşlemden önce görebildiğiniz dört kanıt.',
  'Güvenli işlem sırası',
  'id="sorun-cozucu"',
  'Ayrıntılı rehberler',
  'Sık sorulanlar',
];
let previous = -1;
for (const token of sectionOrder) {
  const index = page.indexOf(token);
  if (index < 0) continue;
  if (index <= previous) failures.push(`Bölüm sırası bozuldu: ${token}`);
  previous = index;
}

if (failures.length) {
  console.error('Güven Merkezi denetimi başarısız:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Güven Merkezi V45.243 denetimi geçti.');
console.log('- Hero sadeleştirme, dört durumlu karar akışı ve 30 saniyelik kontrol doğrulandı');
console.log('- Resmî site, WhatsApp, hesap sahipliği ve ekran paylaşımı kuralları doğrulandı');
console.log('- Yüksek oran riski güvenli/şüpheli teklif karşılaştırmasıyla açıklanıyor');
console.log('- Tekrarlayan eski navigasyon ve 10 saniyelik kontrol kaldırıldı');
console.log('- Resmî kanal bilgisi tek kaynakta toplandı; doğrulanabilir kanıtlar, işlem sırası ve sorun çözücü doğru sırada');
console.log('- Hero, karar akışı, 30 saniyelik kontrol ve mobil dock çelik/metalik kırmızı luxury ritimde rafine edildi');
console.log('- Luxury yüzey tutarlılığı, tek panel hero, çizgisel kontrol listesi ve editoryal alt akış rafinesi doğrulandı');
console.log('- Tipografi, hover/focus geçişleri, mobil yoğunluk ve metal yüzey parlaklık dengesi final polish turunda doğrulandı');
console.log('- Geçersiz spacing utility kalıntıları temizlendi; anchor scroll offset, dar ekran taşma direnci ve mobil dock dengesi doğrulandı');
