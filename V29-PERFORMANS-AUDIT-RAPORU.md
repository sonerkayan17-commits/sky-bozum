# Sky Bozum V29 — Performans ve Production Audit

## Uygulanan iyileştirmeler

- Next Image için AVIF/WebP, cihaz genişliği ve 30 günlük minimum görsel önbelleği tanımlandı.
- Statik Next dosyalarına immutable; public görsellere uzun süreli cache başlıkları eklendi.
- Firebase paketinin daha küçük modül parçalarına ayrılmasını destekleyen package import optimizasyonu açıldı.
- Ana sayfanın ilk ekranından sonraki ağır bölümler `content-visibility: auto` ile görünüm alanına yaklaşana kadar render bütçesinden çıkarıldı.
- Hero içindeki ilk marka görseli yüksek öncelikli yüklemeye alındı.
- Mobil viewport, safe-area ve koyu tema tarayıcı rengi merkezi olarak tanımlandı.
- Ham `<img>`, büyük kaynak dosyaları, ağır görseller ve riskli event listener kullanımlarını tarayan `npm run audit:performance` komutu eklendi.
- Mevcut `loading.tsx`, `error.tsx`, sitemap, robots, SEO ve iç bağlantı sistemleri korundu.

## Kontrol komutları

```bash
npm install
npm run audit:links
npm run audit:performance
npm run lint
npm run build
```

## Not

Lighthouse puanı hosting, ağ, üçüncü taraf canlı destek kodu ve production sunucusuna göre değişir. Bu sürüm puan garantisi vermek yerine ölçülebilir performans temeli ve tekrar çalıştırılabilir audit sistemi kurar.
