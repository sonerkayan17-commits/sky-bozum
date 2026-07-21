# Referanslar V34 — Sade Yeniden Tasarım

## Yapılanlar

- Referanslar arayüzü sıfırdan sade biçimde yeniden yazıldı.
- Tawk.to, WhatsApp ve özel arşiv kayıtları kullanıcı arayüzünden tamamen çıkarıldı.
- Yalnızca açık kaynak WM Aracı yorumları gösteriliyor.
- İlk ekranda üç kompakt yorum kartı yer alıyor.
- Gereksiz kanıt duvarı, güven protokolü, sayaçlar, filtreler, dev ikonlar ve uzun işlem kartları kaldırıldı.
- “Tüm yorumları görüntüle” düğmesiyle kalan WM Aracı yorumları açılabiliyor.
- Kaynak bağlantıları her kartın içinde korunuyor.
- Firebase tabanlı, admin onayına düşen “Yeni yorum yap” formu eklendi.
- Onaylanmış site yorumları geldiğinde otomatik olarak ayrı ve kompakt bir alanda gösteriliyor.
- Mobil, tablet ve masaüstü düzenleri yeniden hazırlandı.

## Korunanlar

- Mevcut `/referanslar` rotası
- Navbar ve footer sistemi
- WM Aracı kaynak bağlantıları
- Firebase yorum altyapısı
- SEO ve JSON-LD altyapısı
