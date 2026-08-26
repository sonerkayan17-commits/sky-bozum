import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'app/components/articles/ArticleExplorer.tsx'), 'utf8');
const checks = [
  ['const archivePageSize = 18', 'Arşiv sayfa boyutu dengeli iki ve üç sütun düzenine göre sabitlenmemiş.'],
  ['const archivePageCount = Math.max(1, Math.ceil(gridResults.length / archivePageSize))', 'Arşiv toplam sayfa sayısını gerçek sonuç adedinden hesaplamıyor.'],
  ['const safeArchivePage = Math.min(archivePage, archivePageCount)', 'Arşiv aktif sayfası geçerli aralıkta tutulmuyor.'],
  ['const archiveStartIndex = (safeArchivePage - 1) * archivePageSize', 'Arşiv başlangıç indisini aktif sayfaya göre hesaplamıyor.'],
  ['const visibleGridResults = gridResults.slice(archiveStartIndex, archiveStartIndex + archivePageSize)', 'Arşiv sonuçları aktif sayfanın aralığına göre dilimlenmiyor.'],
  ['const displayedArchiveCount = visibleGridResults.length', 'Arşiv başlığında gerçek görünür adet hesaplanmıyor.'],
  ['{displayedArchiveCount}</strong> gösteriliyor', 'Arşiv başlığı görünür içerik sayısını göstermiyor.'],
  ['toplam <strong className="text-white">{gridResults.length}</strong>', 'Arşiv başlığı toplam içerik sayısını göstermiyor.'],
  ['md:grid-cols-2 xl:grid-cols-3', 'Arşiv masaüstünde dengeli üç sütunlu grid kullanmıyor.'],
  ['function ArchiveArticleCard', 'Arşiv özel kompakt kart bileşeni kullanmıyor.'],
  ['businessPriorityScore', 'Mobil bozum odaklı içerik öncelik skoru bulunmuyor.'],
  ["featuredArticleSlugs", 'Öne çıkan rehberler sabit ana makale sırasına bağlanmamış.'],
  ["const popular = discoveryMode ? discoveryRemainder.slice(0, 5) : []", 'Popüler rehber başlangıç sırası dört öne çıkan içerikle uyumlu değil.'],
  ['function goToArchivePage(page: number)', 'Arşiv sayfa değişimini yöneten işlev bulunmuyor.'],
  ['aria-label="Bilgi Merkezi sayfaları"', 'Arşiv numaralı sayfalaması erişilebilir bir navigasyon adı kullanmıyor.'],
  ["aria-current={page === safeArchivePage ? 'page' : undefined}", 'Aktif arşiv sayfası ekran okuyucuya bildirilmiyor.'],
  ['disabled={safeArchivePage === 1}', 'Arşiv önceki düğmesi ilk sayfada devre dışı kalmıyor.'],
  ['disabled={safeArchivePage === archivePageCount}', 'Arşiv sonraki düğmesi son sayfada devre dışı kalmıyor.'],
  ['showNewestArticles', 'Yeni içerik düğmesi kontrollü yönlendirme işlevini kullanmıyor.'],
  ['aria-controls="article-archive"', 'Yeni içerik düğmesi sonuç arşivini aria-controls ile bildirmiyor.'],
  ['id="article-archive"', 'Makale arşivi için sabit hedef kimliği eksik.'],
  ['tabIndex={-1}', 'Makale arşivi programatik odak almaya uygun değil.'],
  ["revealAndFocus(() => archiveRef.current, 'start')", 'Yeni içerik eylemi sonuç arşivi yönlendirme yardımcısını kullanmıyor.'],
  ['element.scrollIntoView({ behavior: preferredScrollBehavior(), block })', 'Ortak yönlendirme yardımcısı hedefi görünür alana taşımıyor.'],
  ['element.focus({ preventScroll: true })', 'Ortak yönlendirme yardımcısı klavye odağını hedefe aktarmıyor.'],
  ['aria-labelledby="article-archive-title"', 'Makale arşivi erişilebilir başlığıyla ilişkilendirilmemiş.'],
];
for (const [marker, message] of checks) {
  if (!source.includes(marker)) {
    console.error(message);
    process.exit(1);
  }
}

const archiveCardMatch = source.match(/function ArchiveArticleCard[\s\S]*?function CompactArticleLink/);
if (!archiveCardMatch) {
  console.error('Arşiv kartı bileşeni bulunamadı.');
  process.exit(1);
}
const archiveCardSource = archiveCardMatch[0];
if (archiveCardSource.includes('<Image') || archiveCardSource.includes('premiumArticleCovers')) {
  console.error('Arşiv kartları görseli olan ve olmayan içerikler arasında tekrar kalite farkı oluşturuyor.');
  process.exit(1);
}
if (archiveCardSource.includes('Rehberi aç') || archiveCardSource.includes('Rehberi oku')) {
  console.error('Arşiv kartında tüm kart bağlantısına ek olarak tekrarlı CTA metni bulunuyor.');
  process.exit(1);
}
if (!archiveCardSource.includes('font-black') || !archiveCardSource.includes('line-clamp-3') || !archiveCardSource.includes('sm:line-clamp-2') || !archiveCardSource.includes('sm:text-[17px]')) {
  console.error('Arşiv kartı tipografisi mobilde üç, geniş ekranda iki satırlı okunabilir yapıda değil.');
  process.exit(1);
}

if (!archiveCardSource.includes('w-[2px]') || !archiveCardSource.includes('presentation.strip') || !archiveCardSource.includes('presentation.dot')) {
  console.error('Arşiv kartlarında kategori renkleri ince şerit ve küçük nokta sistemiyle sadeleştirilmemiş.');
  process.exit(1);
}
if (archiveCardSource.includes('bg-gradient-to-br ${presentation.accent}') || archiveCardSource.includes('size-8 items-center justify-center')) {
  console.error('Arşiv kartlarında görsel kaos oluşturan büyük renkli kategori rozeti hâlâ kullanılıyor.');
  process.exit(1);
}

const compactLinkMatch = source.match(/function CompactArticleLink[\s\S]*?function ArticleExplorer/);
if (!compactLinkMatch) {
  console.error('Kompakt makale bağlantısı bileşeni bulunamadı.');
  process.exit(1);
}
const compactLinkSource = compactLinkMatch[0];
const decorativeMarkers = compactLinkSource.match(/aria-hidden="true"/g) ?? [];
if (decorativeMarkers.length < 2) {
  console.error('Kompakt makale bağlantısındaki sıra numarası ve yön oku ekran okuyucudan gizlenmemiş.');
  process.exit(1);
}


const articleCardMatch = source.match(/function ArticleCard[\s\S]*?function CompactArticleLink/);
if (!articleCardMatch) {
  console.error('Premium makale kartı bileşeni bulunamadı.');
  process.exit(1);
}
const articleCardSource = articleCardMatch[0];
if (!articleCardSource.includes('aria-labelledby={titleId}') || !articleCardSource.includes('<h2 id={titleId}')) {
  console.error('Premium makale kartı bağlantısı yalnız makale başlığıyla adlandırılmıyor.');
  process.exit(1);
}


if (!source.includes("useId, useMemo") || !articleCardSource.includes("useId().replace(/:/g, '')") || !compactLinkSource.includes("useId().replace(/:/g, '')")) {
  console.error('Makale bağlantısı başlık kimlikleri örnek bazında benzersiz React useId değerleri kullanmıyor.');
  process.exit(1);
}
if (articleCardSource.includes('article-card-title-${article.slug}') || compactLinkSource.includes('compact-article-title-${article.slug}')) {
  console.error('Slug tabanlı yinelenebilir başlık kimlikleri hâlâ kullanılıyor.');
  process.exit(1);
}

if (!compactLinkSource.includes('aria-labelledby={titleId}') || !compactLinkSource.includes('<strong id={titleId}')) {
  console.error('Kompakt makale bağlantısı yalnız makale başlığıyla adlandırılmıyor.');
  process.exit(1);
}

if (!/featured\.slice\(0, 5\)\.map\(\(article, index\) => <ArticleCard[^>]+priority=\{index < 2\}/.test(source)) {
  console.error('Öne çıkan rehberler Popüler rehberlerle aynı düzende beş dengeli premium kart olarak render edilmiyor.');
  process.exit(1);
}

const articleMetaMatch = source.match(/function ArticleMeta[\s\S]*?function ArticleCard/);
if (!articleMetaMatch) {
  console.error('Makale meta bileşeni bulunamadı.');
  process.exit(1);
}
const articleMetaSource = articleMetaMatch[0];
if (!articleMetaSource.includes('<span aria-hidden="true">⏱ </span>')) {
  console.error('Okuma süresi kronometre simgesi ekran okuyucudan gizlenmemiş.');
  process.exit(1);
}
if (articleMetaSource.includes('`⏱ ${article.readTime}`')) {
  console.error('Okuma süresi kronometre simgesi hâlâ erişilebilir metne gömülü.');
  process.exit(1);
}


const decorativeActionChecks = [
  ['Merkezi aç <span aria-hidden="true">→</span>', 'Kategori merkezi yön oku ekran okuyucudan gizlenmemiş.'],
  ['{count} rehber <span aria-hidden="true">→</span>', 'Konu kartı yön oku ekran okuyucudan gizlenmemiş.'],
  ['Yeni içerikleri göster <span aria-hidden="true">→</span>', 'Yeni içerikler düğmesi yön oku ekran okuyucudan gizlenmemiş.'],
  ['aria-hidden="true">⌕</div>', 'Boş sonuç simgesi ekran okuyucudan gizlenmemiş.'],
];
for (const [marker, message] of decorativeActionChecks) {
  if (!source.includes(marker)) {
    console.error(message);
    process.exit(1);
  }
}

if (source.includes("onClick={() => setSort('newest')}")) {
  console.error('Eski yalnızca sıralama değiştiren yeni içerik düğmesi hâlâ mevcut.');
  process.exit(1);
}
console.log('OK: Arşiv yönlendirmesi doğrulandı; numaralı sayfalama, iki/üç sütunlu kart sistemi, odak yönetimi ve bağlantı adları erişilebilir.');
