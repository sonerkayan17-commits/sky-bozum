import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'app/components/articles/ArticleExplorer.tsx');
const source = fs.readFileSync(file, 'utf8');

const checks = [
  ['Canlı sonuç durumunun sabit kimliği', 'id="article-result-status"'],
  ['Arama alanının arşiv ilişkisi', 'aria-controls="article-archive" aria-keyshortcuts="/"'],
  ['Sıralama kontrolünün arşiv ilişkisi', 'id="article-sort" aria-controls="article-archive"'],
  ['Kategori kontrolünün arşiv ilişkisi', 'id="article-category" aria-controls="article-archive"'],
  ['Konu düğmelerinin arşiv ilişkisi', 'onClick={() => { setHasResultInteraction(true); setTopic(item); }} aria-controls="article-archive"'],
  ['Hızlı konu düğmelerinin arşiv ilişkisi', 'onClick={() => openTopic(item)} aria-controls="article-archive"'],
  ['Yeni içerikler düğmesinin arşiv ilişkisi', 'onClick={showNewestArticles} aria-controls="article-archive"'],
  ['Dinamik durum kontrollerin açıklamasına bağlanmıyor', !source.includes('aria-describedby="article-result-status"')],
  ['Arşiv bölgesinin gerçek sonuç içeriğini kapsaması', source.indexOf('id="article-archive"') < source.indexOf('searchIsPending ? <div className="premium-card mt-5 p-10 text-center"') && source.indexOf('</section>', source.indexOf('id="article-archive"')) > source.indexOf('visibleGridResults.map((article) => <ArchiveArticleCard key={article.slug} article={article}/>)')],
];

const missing = checks.filter(([, token]) => typeof token === 'boolean' ? !token : !source.includes(token));
if (missing.length) {
  console.error('Filtre kontrol ilişkisi auditi başarısız:');
  for (const [label] of missing) console.error(`- ${label}`);
  process.exit(1);
}

console.log('Filtre kontrol ilişkisi auditi başarılı.');
console.log('- Arama, sıralama, kategori, konu ve yeni içerikler kontrolleri article-archive sonucunu bildiriyor.');
console.log('- Canlı sonuç durumu bağımsız duyuruluyor; kontrollere tekrarlı dinamik açıklama olarak bağlanmıyor.');
console.log('- article-archive hedefi başlık, yükleme, sonuç kartları ve boş sonuç görünümünü birlikte kapsıyor.');
