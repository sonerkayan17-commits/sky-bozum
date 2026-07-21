# Sky Bozum V25 — SEO Motoru

## Uygulanan geliştirmeler

- Makale sayfalarına eksiksiz canonical, Open Graph ve Twitter Card metadata yapısı eklendi.
- Her makale için 1200×630 boyutunda dinamik sosyal paylaşım görseli üretimi eklendi.
- Makale metadata alanlarına yayın tarihi, güncelleme tarihi, kategori, etiketler, yazar ve büyük görsel önizleme direktifleri eklendi.
- Article şeması daha kapsamlı `BlogPosting` şemasına dönüştürüldü.
- BlogPosting şemasına kelime sayısı, tahmini okuma süresi, kategori, anahtar kelimeler, görsel, yazar, yayıncı ve konu ilişkileri eklendi.
- Makale SSS ve breadcrumb şemaları korunarak BlogPosting grafiğine bağlandı.
- Bilgi Merkezi ana sayfasına Blog, CollectionPage ve ItemList yapılandırılmış verileri eklendi.
- Kategori merkezlerine CollectionPage, BreadcrumbList ve ItemList şemaları eklendi.
- Bilgi Merkezi ve kategori sayfalarının sosyal paylaşım metadata alanları tamamlandı.
- `/feed.xml` RSS akışı oluşturuldu ve ana metadata içinde keşfedilebilir hale getirildi.
- Web uygulama manifesti eklendi.
- Sitemap makale güncelleme tarihlerini içerik bazında kullanabilecek hale getirildi.
- Robots dosyasına host bilgisi ve yönetim/API yolları için tarama kısıtları eklendi.
- SEO URL, tarih, görsel, kelime sayısı ve JSON-LD işlemleri merkezi `app/lib/seo.ts` yardımcı dosyasına taşındı.
- Makale veri tipine isteğe bağlı `publishedAt` ve `updatedAt` alanları eklendi.

## Kontrol notu

ZIP bütünlüğü ve kaynak dosyaların temel yapısal kontrolleri yapılmıştır. Ortamda bağımlılık kurulumu 120 saniye içinde tamamlanamadığı için `next build` çalıştırılamamıştır. Paket `node_modules` ve `.next` klasörleri olmadan hazırlanmıştır.
