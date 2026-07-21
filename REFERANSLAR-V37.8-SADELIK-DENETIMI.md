# Sky Bozum Referanslar V37.8 — Sadelik Denetimi

## Uygulanan kararlar

- Tawk.to ve özel arşiv kayıtları veri katmanından tamamen kaldırıldı.
- Referans veri modeli yalnızca açık kaynak WM Aracı kayıtlarına indirildi.
- İlk ekranda üç seçilmiş yorum korunuyor.
- Kartlardaki sabit 300 px minimum yükseklik kaldırıldı; kartlar içerik kadar büyüyor.
- Kalan yorumlar büyük kartlarla değil, açılır kompakt arşiv satırlarıyla gösteriliyor.
- Dev ikon, güven protokolü, kanıt duvarı, sayaç ve filtre katmanları bulunmuyor.
- Yeni yorum formu ve admin onay akışı korunuyor.
- Form erişilebilirliği için yıldız seçimlerinde `aria-pressed`, sonuç mesajlarında `aria-live` eklendi.

## Kapsam

Yalnızca `app/referanslar` alanı değiştirildi. Navbar, footer, ana sayfa, route sistemi ve diğer sayfalara dokunulmadı.

## Doğrulama

- Veri taraması: 11 WM Aracı kaydı, 0 Tawk.to kaydı.
- Eski 300 px kart minimum yüksekliği kaldırıldı.
- Paket içinde `node_modules` bulunmuyor.
- Ortamda bağımlılık kurulumu tamamlanamadığı için Next.js build çalıştırılamadı.
