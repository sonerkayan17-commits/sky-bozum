# Sky Bozum V26 — Akıllı İç Bağlantı Motoru

## Eklenen sistemler

- Makaleleri kategori, hizmet, başlık ve anahtar kelime yakınlığıyla puanlayan merkezi ilişki motoru.
- Her makalenin sonunda üç yerine altı akıllı ilgili içerik önerisi.
- Uzun makalelerde belirli bölümlerin ardından bağlama uygun “Bu bölümle ilgili” bağlantı blokları.
- En az iki makalesi bulunan hizmetler için otomatik ürün/konu merkezleri.
- Konu merkezlerinin site aramasına ve XML sitemap’e eklenmesi.
- Makale kenar paneline ilgili konu merkezi bağlantısı.
- Sabit dahili bağlantılar için otomatik kırık bağlantı denetim komutu: `npm run audit:links`.

## Yeni rotalar

`/bilgi-merkezi/konu/[slug]`

Bu sayfalar ilgili hizmete bağlı tüm rehberleri tek merkezde toplar ve hizmet sayfasına doğal geçiş sağlar.

## Kalite ilkeleri

- Bağlantılar rastgele değil, ortak hizmet, kategori ve kelime sinyalleriyle sıralanır.
- Bir makale kendi kendisine önerilmez.
- Aynı bağlantının gereksiz tekrarını azaltmak için bölüm içi öneriler iki içerikle sınırlandırılır.
- Konu merkezi yalnız en az iki bağlantılı makale varsa oluşturulur.
