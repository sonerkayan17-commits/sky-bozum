import fs from 'node:fs';

const file = 'app/components/articles/ArticleExplorer.tsx';
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['popstate dinleyicisi', "window.addEventListener('popstate', restoreStateFromUrl)"],
  ['popstate temizliği', "window.removeEventListener('popstate', restoreStateFromUrl)"],
  ['URL arama değeri', "params.get('q')"],
  ['kategori doğrulaması', 'categories.includes(requestedCategory)'],
  ['sıralama izin listesi', 'sortOptions.some((item) => item.value === requestedSort)'],
  ['konu izin listesi', 'topicOptions.includes(requestedTopic as Topic)'],
  ['arama state yenilemesi', 'setQuery(nextQuery)'],
  ['kategori state yenilemesi', 'setCategory('],
  ['sıralama state yenilemesi', 'setSort('],
  ['konu state yenilemesi', 'setTopic('],
  ['geçmiş geri yükleme yarış koruması', 'suppressNextUrlSyncRef.current = true'],
  ['URL senkronizasyonu bir tur atlanıyor', 'if (suppressNextUrlSyncRef.current)'],
  ['atlama bayrağı güvenle sıfırlanıyor', 'suppressNextUrlSyncRef.current = false'],
  ['gereksiz atlama önleniyor', 'stateWillChange'],
  ['değişiklik yoksa erken çıkış', 'if (!stateWillChange) return'],
  ['arama yalnız değişince yenileniyor', 'if (current.query !== nextQuery) setQuery(nextQuery)'],
  ['kategori yalnız değişince yenileniyor', 'if (current.category !== nextCategory) setCategory(nextCategory)'],
  ['sıralama yalnız değişince yenileniyor', 'if (current.sort !== nextSort) setSort(nextSort)'],
  ['konu yalnız değişince yenileniyor', 'if (current.topic !== nextTopic) setTopic(nextTopic)'],
  ['URL zamanlayıcı ref ile izleniyor', 'const urlSyncTimerRef = useRef<number | null>(null)'],
  ['popstate bekleyen zamanlayıcıyı iptal ediyor', 'window.clearTimeout(urlSyncTimerRef.current)'],
  ['iptal edilen zamanlayıcı refi sıfırlanıyor', 'urlSyncTimerRef.current = null'],
  ['URL zamanlayıcısı kimlikle kuruluyor', 'const timerId = window.setTimeout(() =>'],
  ['aktif zamanlayıcı ref üzerinden saklanıyor', 'urlSyncTimerRef.current = timerId'],
  ['eski callback yeni refi temizlemiyor', 'if (urlSyncTimerRef.current === timerId) urlSyncTimerRef.current = null'],
];


const cancelIndex = source.indexOf('if (urlSyncTimerRef.current !== null)');
const earlyReturnIndex = source.indexOf('if (!stateWillChange) return');
if (cancelIndex === -1 || earlyReturnIndex === -1 || cancelIndex > earlyReturnIndex) {
  console.error('Tarayıcı geçmişi senkronizasyon denetimi başarısız:');
  console.error('- Bekleyen URL zamanlayıcısı state eşitliği erken çıkışından önce iptal edilmiyor');
  process.exit(1);
}

const missing = checks.filter(([, token]) => !source.includes(token));
if (missing.length) {
  console.error('Tarayıcı geçmişi senkronizasyon denetimi başarısız:');
  for (const [label] of missing) console.error(`- ${label}`);
  process.exit(1);
}

console.log(`Tarayıcı geçmişi senkronizasyon denetimi geçti (${checks.length + 1} kontrol).`);
