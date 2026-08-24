import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const coverText=fs.readFileSync(path.join(root,'app/lib/premiumArticleCovers.ts'),'utf8');
const metaText=fs.readFileSync(path.join(root,'app/lib/articleVisualSystem.ts'),'utf8');
const covers=new Set([...coverText.matchAll(/'([^']+)'\s*:\s*'[^']+'/g)].map(m=>m[1]));
const metas=new Set([...metaText.matchAll(/'([^']+)'\s*:\s*\{\s*family:/g)].map(m=>m[1]));
const missingMeta=[...covers].filter(x=>!metas.has(x));
if(missingMeta.length){console.error('Metadata eksik kapaklar:',missingMeta);process.exit(1)}
const phase=/phase:\s*'([^']+)'/.exec(metaText)?.[1]??'bilinmiyor';
console.log(`OK: ${covers.size} aktif kapağın tamamında görsel metadata var. Aşama: ${phase}`);

const sourceFiles = [
  'app/components/articles/ArticleVisual.tsx',
  'app/lib/featuredArticles.ts',
  'app/bilgi-merkezi/[slug]/page.tsx',
];
const missingAssets = [];
for (const sourceFile of sourceFiles) {
  const sourcePath = path.join(root, sourceFile);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const assetPaths = [...source.matchAll(/['"](\/(?:images|blog-covers)\/[^'"]+)['"]/g)].map((match) => match[1]);
  for (const assetPath of assetPaths) {
    if (!fs.existsSync(path.join(root, 'public', assetPath.slice(1)))) missingAssets.push(`${sourceFile}: ${assetPath}`);
  }
}
if (missingAssets.length) {
  console.error('Eksik makale içi görsel yolları:', missingAssets);
  process.exit(1);
}
console.log('OK: Makale içi küratörlü görsel yollarının tamamı mevcut.');

const coverComponent = fs.readFileSync(path.join(root, 'app/components/articles/ArticleCover.tsx'), 'utf8');
const explorerComponent = fs.readFileSync(path.join(root, 'app/components/articles/ArticleExplorer.tsx'), 'utf8');
const articleVisualComponent = fs.readFileSync(path.join(root, 'app/components/articles/ArticleVisual.tsx'), 'utf8');

if (/priority=\{priority\s*\|\|/.test(coverComponent)) {
  console.error('ArticleCover metadata üzerinden priority zorlamaya devam ediyor.');
  process.exit(1);
}
if (/loading=["']eager["']/.test(explorerComponent)) {
  console.error('ArticleExplorer içinde görünür alan dışı görseller eager yükleniyor.');
  process.exit(1);
}
if (/hepsipay-nedir-nasil-kullanilir-content\.svg[\s\S]{0,260}className=["'][^"']*object-cover/.test(articleVisualComponent)) {
  console.error('Hepsipay SVG içerik görseli object-cover ile kırpılıyor.');
  process.exit(1);
}
console.log('OK: Kart görselleri yalnız görünür önceliğe göre yükleniyor; SVG içerik görseli kırpılmıyor.');

if (explorerComponent.includes('editorial-toolbar sticky top-3')) {
  console.error('Mobil filtre paneli varsayılan olarak sticky kalıyor.');
  process.exit(1);
}
if (explorerComponent.includes('min-h-[238px]')) {
  console.error('Makale kartı metin alanında eski 238px zorunlu yükseklik kalmış.');
  process.exit(1);
}
console.log('OK: Mobil filtre paneli ekranı kaplamıyor; kart metin alanı gereksiz yüksekliğe zorlanmıyor.');


if (explorerComponent.includes("const discoveryMode = !query")) {
  console.error('Boşluk karakterli arama discovery modunu yanlış kapatıyor.');
  process.exit(1);
}
if (explorerComponent.includes("setQuery(''); setTopic(item);")) {
  console.error('Boş sonuç konu düğmeleri diğer filtreleri temizlemiyor.');
  process.exit(1);
}
if (!explorerComponent.includes("isVectorAsset(visual.card) ? 'object-contain")) {
  console.error('Kategori SVG görselleri kırpılmaya karşı korunmuyor.');
  process.exit(1);
}
console.log('OK: Boş arama, boş sonuç yönlendirmesi ve kategori SVG hizası güvenli.');


const categoryPage = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/kategori/[slug]/page.tsx'), 'utf8');
const topicPage = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/konu/[slug]/page.tsx'), 'utf8');
if (!categoryPage.includes('ArticleCover article={article}')) {
  console.error('Kategori merkezi premium kapakları kullanmıyor.');
  process.exit(1);
}
if (!topicPage.includes('ArticleCover article={article}')) {
  console.error('Konu merkezi premium kapakları kullanmıyor.');
  process.exit(1);
}
if (!categoryPage.includes("categoryVisual.hero.toLowerCase().endsWith('.svg')")) {
  console.error('Kategori SVG hero kırpma koruması eksik.');
  process.exit(1);
}

const detailPage = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/[slug]/page.tsx'), 'utf8');
const feedbackComponent = fs.readFileSync(path.join(root, 'app/components/articles/ArticleFeedback.tsx'), 'utf8');
const supportLinkComponent = fs.readFileSync(path.join(root, 'app/components/articles/ArticleSupportLink.tsx'), 'utf8');
if (!detailPage.includes('<ArticleFeedback slug={article.slug} />')) {
  console.error('Makale geri bildirim bileşeni detay sayfasına bağlı değil.');
  process.exit(1);
}
if (!feedbackComponent.includes('localStorage.getItem')) {
  console.error('Makale geri bildirimi yeniden açılışta geri yüklenmiyor.');
  process.exit(1);
}
console.log('OK: Kategori ve konu merkezleri premium kapakları kullanıyor; SVG hero kırpılmıyor.');
console.log('OK: Makale geri bildirimi detay sayfasına bağlı ve önceki seçim geri yükleniyor.');

const shareButtons = fs.readFileSync(path.join(root, 'app/components/ShareButtons.tsx'), 'utf8');
if (!shareButtons.includes("document.execCommand('copy')")) {
  console.error('Paylaşım düğmesinde eski tarayıcılar için kopyalama yedeği yok.');
  process.exit(1);
}
if (!shareButtons.includes('resetStatus(2800)')) {
  console.error('Paylaşım hata durumu kullanıcı arayüzünde kalıcı kalıyor.');
  process.exit(1);
}
if (!detailPage.includes('href="/bilgi-merkezi"') || !detailPage.includes('Kategoriye dön')) {
  console.error('Uzun makalenin sonunda Bilgi Merkezi ve kategori geri dönüşleri eksik.');
  process.exit(1);
}
console.log('OK: Paylaşım yedek kopyalama ile dayanıklı; makale sonunda açık geri dönüş bağlantıları var.');

if (!articleVisualComponent.includes('src={infographic.src} alt={infographic.alt} fill sizes="(max-width: 1023px) 100vw, 820px" className="object-contain p-2 sm:p-4"')) {
  console.error('Küratörlü makale infografikleri object-cover ile kırpılıyor.');
  process.exit(1);
}
if (!detailPage.includes('lg:max-h-[calc(100vh-8rem)]') || !detailPage.includes('lg:overflow-y-auto')) {
  console.error('Uzun masaüstü yan menüsü ekran içinde kaydırılabilir değil.');
  process.exit(1);
}
if ((supportLinkComponent.match(/aria-label="WhatsApp üzerinden destek alın; yeni sekmede açılır"/g) ?? []).length < 2) {
  console.error('Yeni sekmede açılan WhatsApp bağlantılarında erişilebilir açıklama eksik.');
  process.exit(1);
}
console.log('OK: Küratörlü infografikler kırpılmıyor; uzun yan menü kaydırılabilir ve dış destek bağlantıları açıklamalı.');


const focusTargets = [
  ['app/bilgi-merkezi/page.tsx', 'focus-ring knowledge-entry-card group flex min-h-48 flex-col rounded-2xl'],
  ['app/bilgi-merkezi/arama-niyeti/page.tsx', 'focus-ring rounded-2xl'],
  ['app/bilgi-merkezi/sorun-cozme/page.tsx', 'focus-ring group rounded-3xl'],
  ['app/components/articles/LearningPathShowcase.tsx', 'focus-ring knowledge-learning-card'],
  ['app/components/articles/ArticleExplorer.tsx', 'focus-ring group overflow-hidden rounded-2xl'],
];
for (const [relativePath, marker] of focusTargets) {
  const content = fs.readFileSync(path.join(root, relativePath), 'utf8');
  if (!content.includes(marker)) {
    console.error(`Kritik bağlantıda görünür klavye odağı eksik: ${relativePath}`);
    process.exit(1);
  }
}
if (!detailPage.includes('article-sidebar-support article-sidebar-support--compact') ||
    !supportLinkComponent.includes('aria-label="WhatsApp üzerinden destek alın; yeni sekmede açılır"') ||
    !supportLinkComponent.includes('className="focus-ring rounded-md"')) {
  console.error('Sadeleştirilmiş makale yan panelinde erişilebilir destek bağlantısı eksik.');
  process.exit(1);
}
if (detailPage.includes('İLGİLİ HİZMET') || detailPage.includes('KONU MERKEZİ')) {
  console.error('Makale yan panelindeki ikincil tanıtım blokları yeniden eklenmiş.');
  process.exit(1);
}
console.log('OK: Ana keşif, öğrenme yolu, sorun çözme ve sadeleştirilmiş makale bağlantıları görünür klavye odağı taşıyor.');
const breadcrumbFiles = [
  'app/bilgi-merkezi/[slug]/page.tsx',
  'app/bilgi-merkezi/kategori/[slug]/page.tsx',
  'app/bilgi-merkezi/konu/[slug]/page.tsx',
  'app/bilgi-merkezi/sorun-cozme/[slug]/page.tsx',
];
for (const file of breadcrumbFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (!source.includes('aria-current="page"')) { console.error(`${file}: breadcrumb mevcut sayfayı aria-current ile işaretlemiyor.`); process.exit(1); }
  const bareSeparators = [...source.matchAll(/<span>\/<\/span>/g)];
  if (bareSeparators.length) { console.error(`${file}: breadcrumb ayraçları aria-hidden taşımıyor.`); process.exit(1); }
}
console.log('OK: Dinamik Bilgi Merkezi breadcrumb yapıları mevcut sayfayı bildiriyor; ayraçlar ekran okuyucudan gizli.');
if (detailPage.includes('/brand-logo.webp')) {
  console.error('Makale yapılandırılmış verisi pakette bulunmayan brand-logo.webp dosyasını bildiriyor.');
  process.exit(1);
}
console.log('OK: Makale yapılandırılmış verisi eksik yayıncı logo dosyasına referans vermiyor.');



const troubleshootingIndex = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/sorun-cozme/page.tsx'), 'utf8');
if (!troubleshootingIndex.includes('className="focus-ring rounded-full')) {
  console.error('Sorun çözme kategori atlama bağlantılarında görünür klavye odağı eksik.');
  process.exit(1);
}
console.log('OK: Sorun çözme kategori atlama bağlantıları görünür klavye odağı taşıyor.');

const knowledgeIndex = fs.readFileSync(path.join(root, 'app/bilgi-merkezi/page.tsx'), 'utf8');
if (!knowledgeIndex.includes('Mobil ödeme, operatör bakiyesi, Paycell, Pokus, Razer Gold ve dijital kod rehberlerini gösteren')) {
  console.error('Bilgi Merkezi hero açıklaması ana mobil bozum ekosistemini yansıtmıyor.');
  process.exit(1);
}
if (knowledgeIndex.includes('Mobil Ödeme ile Cihaz Finansmanı')) {
  console.error('Bilgi Merkezi hero alanında cihaz finansmanı mesajı yeniden kullanılmış.');
  process.exit(1);
}
console.log('OK: Bilgi Merkezi hero alanı cihaz finansmanı yerine mobil ödeme ve dijital bakiye ekosistemini temsil ediyor.');
